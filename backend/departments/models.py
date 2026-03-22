from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=5, unique=True)  # 🔥 IMPORTANT

    def __str__(self):
        return f"{self.name} ({self.code})"