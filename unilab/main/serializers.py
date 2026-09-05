from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils import timezone
from rest_framework import serializers

from .models import StudentProfile, EmailVerificationCode

User = get_user_model()


class SignupSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        try:
            validate_password(attrs['password'])
        except DjangoValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'].strip(),
            password=validated_data['password'],
        )


class OnboardingSerializer(serializers.Serializer):
    """Validates the Onboarding.jsx 'Details' + 'Course' steps and
    creates the matching row in students.student_profile."""

    age = serializers.IntegerField(min_value=13, max_value=120)
    birthday = serializers.DateField()
    course = serializers.CharField(max_length=255)

    def validate(self, attrs):
        user = self.context['user']
        if not user.is_email_verified:
            raise serializers.ValidationError(
                "Please verify your email address before finishing your profile."
            )
        if StudentProfile.objects.filter(user_id=user.id).exists():
            raise serializers.ValidationError("A student profile already exists for this account.")
        return attrs

    def create(self, validated_data):
        user = self.context['user']
        return StudentProfile.objects.create(
            user_id=user.id,
            student_age=validated_data['age'],
            student_birthday=validated_data['birthday'],
            course=validated_data['course'],
        )


class VerifyEmailCodeSerializer(serializers.Serializer):
    """Validates the six-digit code from the Onboarding.jsx 'Verify' step
    against the most recent EmailVerificationCode issued to this user."""

    code = serializers.RegexField(r'^\d{6}$', error_messages={
        'invalid': 'Enter all six digits.',
    })

    def validate_code(self, value):
        user = self.context['user']
        record = (
            EmailVerificationCode.objects
            .filter(user=user, consumed_at__isnull=True)
            .order_by('-created_at')
            .first()
        )

        if record is None or record.is_expired():
            raise serializers.ValidationError(
                "That code has expired. Request a new one and try again."
            )

        if record.attempts >= EmailVerificationCode.MAX_ATTEMPTS:
            raise serializers.ValidationError(
                "Too many incorrect attempts. Request a new code."
            )

        if record.code != value:
            record.attempts += 1
            record.save(update_fields=['attempts'])
            remaining = EmailVerificationCode.MAX_ATTEMPTS - record.attempts
            if remaining <= 0:
                raise serializers.ValidationError(
                    "Too many incorrect attempts. Request a new code."
                )
            raise serializers.ValidationError("That code isn't right. Please try again.")

        self.context['record'] = record
        return value

    def save(self):
        user = self.context['user']
        record = self.context['record']
        record.consumed_at = timezone.now()
        record.save(update_fields=['consumed_at'])
        user.is_email_verified = True
        user.save(update_fields=['is_email_verified'])
        return user