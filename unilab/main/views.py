from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login as django_login, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.mail import EmailMessage
from django.conf import settings
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie
from datetime import timedelta

from .serializers import SignupSerializer, OnboardingSerializer, VerifyEmailCodeSerializer
from .models import EmailVerificationCode

User = get_user_model()

# Minimum gap between two "send code" requests for the same user, so the
# Resend button can't be hammered into spamming their inbox.
RESEND_COOLDOWN = timedelta(seconds=30)


@api_view(['GET'])
@ensure_csrf_cookie
@authentication_classes([])
@permission_classes([AllowAny])
def csrf(request):
    """Sets the csrftoken cookie. The frontend calls this once (e.g. on
    load) so it has a token to send back as X-CSRFToken on state-changing
    requests made while a session is active (e.g. /auth/onboarding/)."""
    return Response({"detail": "CSRF cookie set."})


@api_view(['POST'])
def send_contact_email(request):
    name = (request.data.get('name') or '').strip()
    sender_email = (request.data.get('email') or '').strip()
    subject = (request.data.get('subject') or '').strip()
    message = (request.data.get('message') or '').strip()
    cc = (request.data.get('cc') or '').strip()

    if not sender_email or not subject or not message:
        return Response(
            {"error": "email, subject, and message are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    full_subject = f"[UNI-Lab Contact] {subject}"
    body = f"From: {name or 'Anonymous'} <{sender_email}>\n\n{message}"

    email = EmailMessage(
        subject=full_subject,
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[settings.CONTACT_RECIPIENT_EMAIL],
        cc=[cc] if cc else None,
        reply_to=[sender_email],
    )

    try:
        email.send(fail_silently=False)
    except Exception as e:
        return Response(
            {"error": "Failed to send email.", "detail": str(e)},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    return Response({"success": True, "message": "Email sent successfully."})


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Log the user in immediately so the Onboarding step (which
        # needs to know who to attach the student_profile row to)
        # can rely on request.user / the session.
        django_login(request, user)
        return Response(
            {"message": "Account created successfully.", "email": user.email},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def check_password_strength(request):
    password = request.data.get('password', '')
    try:
        validate_password(password)
        return Response({"valid": True, "errors": []})
    except DjangoValidationError as e:
        return Response({"valid": False, "errors": list(e.messages)})


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email', '')
    password = request.data.get('password', '')

    try:
        user_obj = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        return Response({"detail": "Invalid email or password."}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=user_obj.email, password=password)
    if user is None:
        return Response({"detail": "Invalid email or password."}, status=status.HTTP_400_BAD_REQUEST)

    django_login(request, user)
    return Response({"message": "Logged in successfully.", "email": user.email})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_verification_code(request):
    """Issues a fresh 6-digit code and emails it to the logged-in user.
    Called automatically when Onboarding.jsx reaches the 'Verify' step,
    and again whenever the user taps 'Resend code'."""
    user = request.user

    if user.is_email_verified:
        return Response({"detail": "Your email is already verified."}, status=status.HTTP_400_BAD_REQUEST)

    recent = (
        EmailVerificationCode.objects
        .filter(user=user, consumed_at__isnull=True)
        .order_by('-created_at')
        .first()
    )
    if recent and not recent.is_expired() and timezone.now() - recent.created_at < RESEND_COOLDOWN:
        wait = RESEND_COOLDOWN - (timezone.now() - recent.created_at)
        return Response(
            {"detail": f"Please wait {int(wait.total_seconds()) + 1}s before requesting another code."},
            status=status.HTTP_429_TOO_MANY_REQUESTS,
        )

    record = EmailVerificationCode.generate_for(user)

    email = EmailMessage(
        subject="Your UNI-Lab verification code",
        body=(
            f"Hi {user.get_short_name()},\n\n"
            f"Your UNI-Lab verification code is: {record.code}\n\n"
            f"This code expires in 10 minutes. If you didn't request this, "
            f"you can safely ignore this email.\n\n— UNI-Lab"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )

    try:
        email.send(fail_silently=False)
    except Exception as e:
        return Response(
            {"error": "Failed to send verification email.", "detail": str(e)},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    return Response({"message": "Verification code sent.", "email": user.email})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_email(request):
    """Checks the 6-digit code the user typed into Onboarding.jsx's
    'Verify' step and, if correct, flips is_email_verified on."""
    if request.user.is_email_verified:
        return Response({"message": "Your email is already verified.", "verified": True})

    serializer = VerifyEmailCodeSerializer(data=request.data, context={"user": request.user})
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Email verified.", "verified": True})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def onboarding(request):
    """Saves the Onboarding.jsx Details + Course steps into
    students.student_profile for the currently logged-in user."""
    serializer = OnboardingSerializer(data=request.data, context={"user": request.user})
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Profile completed."},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)