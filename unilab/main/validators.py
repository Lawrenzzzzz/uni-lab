import re
from django.core.exceptions import ValidationError


class ComplexityValidator:
    """Requires an uppercase, lowercase, digit, and special character."""

    SPECIAL_CHARS = r'[!@#$%^&*(),.?":{}|<>_\-+=~`\[\];\'\\/]'

    def validate(self, password, user=None):
        missing = []
        if not re.search(r'[A-Z]', password):
            missing.append("an uppercase letter")
        if not re.search(r'[a-z]', password):
            missing.append("a lowercase letter")
        if not re.search(r'\d', password):
            missing.append("a number")
        if not re.search(self.SPECIAL_CHARS, password):
            missing.append("a special character")

        if missing:
            raise ValidationError(
                "Password must contain " + ", ".join(missing) + ".",
                code="password_missing_complexity",
            )

    def get_help_text(self):
        return (
            "Your password must contain at least one uppercase letter, "
            "one lowercase letter, one number, and one special character."
        )