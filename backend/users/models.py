from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.hashers import make_password
from departments.models import Department


class User(AbstractUser):

    ROLE_CHOICES = (
        ("TEACHER", "Teacher"),
        ("HOD", "HOD"),
        ("SUPERADMIN", "SuperAdmin"),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="TEACHER"
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def save(self, *args, **kwargs):
        # Ensure password is always hashed
        if not self.password.startswith("pbkdf2"):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username