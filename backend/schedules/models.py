from django.db import models

class Schedule(models.Model):
    teacher = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE
    )
    room = models.ForeignKey(
        "rooms.Room",
        on_delete=models.CASCADE
    )
    subject = models.ForeignKey(
        "subjects.Subject",
        on_delete=models.CASCADE
    )

    day = models.CharField(max_length=20)
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f"{self.teacher} - {self.subject} - {self.day}"