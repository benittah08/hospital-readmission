# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    employee_id = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=20, default='clinician')  # admin, staff, clinician

    def __str__(self):
        return self.username
