from django.db import models
from departments.models import Department


class Subject(models.Model):
    name = models.CharField(max_length=100)
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name="subjects"
    )

    def __str__(self):
        return self.name