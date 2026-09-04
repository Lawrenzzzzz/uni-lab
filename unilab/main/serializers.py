from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import StudentProfile

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