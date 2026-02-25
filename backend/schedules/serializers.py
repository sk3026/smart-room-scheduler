from rest_framework import serializers
from .models import Schedule

class ScheduleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Schedule
        fields = "__all__"

    def validate(self, data):
        teacher = data["teacher"]
        room = data["room"]
        day = data["day"]
        start_time = data["start_time"]
        end_time = data["end_time"]

        # Check room conflict
        room_conflict = Schedule.objects.filter(
            room=room,
            day=day,
            start_time__lt=end_time,
            end_time__gt=start_time
        ).exists()

        if room_conflict:
            raise serializers.ValidationError("Room already booked at this time.")

        # Check teacher conflict
        teacher_conflict = Schedule.objects.filter(
            teacher=teacher,
            day=day,
            start_time__lt=end_time,
            end_time__gt=start_time
        ).exists()

        if teacher_conflict:
            raise serializers.ValidationError("Teacher already has a class at this time.")

        return data