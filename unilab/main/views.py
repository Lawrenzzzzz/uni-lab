from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login as django_login, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.mail import EmailMessage
from django.conf import settings

from .serializers import SignupSerializer

User = get_user_model()


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

    user = authenticate(request, username=user_obj.username, password=password)
    if user is None:
        return Response({"detail": "Invalid email or password."}, status=status.HTTP_400_BAD_REQUEST)

    django_login(request, user)
    return Response({"message": "Logged in successfully.", "email": user.email})