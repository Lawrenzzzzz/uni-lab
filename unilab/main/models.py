from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.db import models
from django.utils import timezone


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