from django.contrib import admin
from .models import EmailVerificationCode

# Register your models here.


@admin.register(EmailVerificationCode)
class EmailVerificationCodeAdmin(admin.ModelAdmin):
    list_display = ("user", "code", "created_at", "expires_at", "attempts", "consumed_at")
    list_filter = ("consumed_at",)
    search_fields = ("user__email", "code")
    readonly_fields = ("created_at",)