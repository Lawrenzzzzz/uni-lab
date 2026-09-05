from django.urls import path
from . import views

urlpatterns = [
    path('contact/send-email/', views.send_contact_email, name='send-contact-email'),
    path('auth/signup/', views.signup, name='signup'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/check-password/', views.check_password_strength, name='check-password'),
    path('auth/onboarding/', views.onboarding, name='onboarding'),
    path('auth/verify-email/send/', views.send_verification_code, name='send-verification-code'),
    path('auth/verify-email/', views.verify_email, name='verify-email'),
    path('auth/csrf/', views.csrf, name='csrf'),
]