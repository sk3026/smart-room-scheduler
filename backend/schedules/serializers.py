from rest_framework import serializers
from .models import Schedule

class ScheduleSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source="teacher.username", read_only=True)
    subject_name = serializers.CharField(source="subject.name", read_only=True)

    class Meta:
        model = Schedule
        fields = [
            "id",
            "day",
            "start_time",
            "end_time",
            "teacher",
            "room",
            "subject",
            "teacher_name",
            "subject_name",
        ]