import random

from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.db import models
from django.utils import timezone
from datetime import timedelta


class UserManager(BaseUserManager):
    # Manager for the custom User model backed by accounts.users.

    def create_user(self, email, full_name, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address.")
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_email_verified", True)
        return self.create_user(email, full_name, password, **extra_fields)

    def get_by_natural_key(self, email):
        # Case-insensitive lookup so "Foo@Bar.com" and "foo@bar.com" match.
        return self.get(email__iexact=email)


class User(AbstractBaseUser):
    """
    Maps 1:1 onto the `users` table in the `accounts` database
    (see accounts.sql). managed=False because the table already
    exists and is not owned by Django's migration framework.
    """

    id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    # DB column is `password_hashed`; AbstractBaseUser expects a field
    # literally named `password`, so we override it with a db_column.
    password = models.CharField(max_length=255, db_column="password_hashed")
    is_active = models.BooleanField(default=True)
    is_email_verified = models.BooleanField(default=False)
    # NOT NULL in the DB with no Python-side default would break inserts,
    # so give it an explicit default; MySQL's own ON UPDATE CURRENT_TIMESTAMP
    # keeps it fresh too.
    last_login = models.DateTimeField(default=timezone.now, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    objects = UserManager()

    class Meta:
        db_table = "users"
        managed = False

    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.full_name

    def get_short_name(self):
        return self.full_name.split(" ")[0] if self.full_name else self.email


class StudentProfile(models.Model):
    """
    Maps 1:1 onto the `student_profile` table in the `students`
    database (see students.sql). Routed to the `students_db`
    connection by main.db_router.StudentsRouter.
    """

    student_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        db_column="user_id",
        related_name="student_profile",
    )
    student_age = models.IntegerField()
    student_birthday = models.DateField()
    course = models.CharField(max_length=255, null=True, blank=True)
    profile_picture = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "student_profile"
        managed = False

    def __str__(self):
        return f"{self.user_id} — {self.course or 'no course'}"


class EmailVerificationCode(models.Model):
    """
    One-time 6-digit codes used to verify a user's email address during
    onboarding. This is a brand-new table (not part of accounts.sql or
    students.sql) so it's fully managed by Django migrations and lives
    on the `default` (accounts) connection, same as User.
    """

    CODE_LIFETIME = timedelta(minutes=10)
    MAX_ATTEMPTS = 5

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="verification_codes",
    )
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    attempts = models.PositiveSmallIntegerField(default=0)
    consumed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "email_verification_codes"

    def __str__(self):
        return f"code for {self.user_id} (expires {self.expires_at:%Y-%m-%d %H:%M})"

    @classmethod
    def generate_for(cls, user):
        """Invalidate any codes still outstanding for this user and
        issue a fresh one."""
        cls.objects.filter(user=user, consumed_at__isnull=True).update(
            consumed_at=timezone.now()
        )
        code = f"{random.randint(0, 999999):06d}"
        return cls.objects.create(
            user=user,
            code=code,
            expires_at=timezone.now() + cls.CODE_LIFETIME,
        )

    def is_expired(self):
        return timezone.now() >= self.expires_at

    def is_usable(self):
        return self.consumed_at is None and not self.is_expired() and self.attempts < self.MAX_ATTEMPTS