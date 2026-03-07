from rest_framework import serializers
from .models import Schedule


class ScheduleSerializer(serializers.ModelSerializer):

    teacher_name = serializers.CharField(
        source="teacher.username",
        read_only=True
    )

    subject_name = serializers.CharField(
        source="subject.name",
        read_only=True
    )

    room_name = serializers.CharField(
        source="room.room_number",
        read_only=True
    )

    # ✅ FIX: send department name
    department = serializers.CharField(
        source="teacher.department.name",
        read_only=True
    )

    class Meta:
        model = Schedule
        fields = [
            "id",
            "day",
            "start_time",
            "end_time",
            "teacher",
            "teacher_name",
            "subject",
            "subject_name",
            "room",
            "room_name",
            "department"
        ]