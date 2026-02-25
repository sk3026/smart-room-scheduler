from django.db import models

class Room(models.Model):
    room_number = models.CharField(max_length=20)
    capacity = models.IntegerField()
    department = models.ForeignKey(
        "departments.Department",
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.room_number