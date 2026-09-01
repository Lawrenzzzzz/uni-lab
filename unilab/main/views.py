from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import EmailMessage
from django.conf import settings


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