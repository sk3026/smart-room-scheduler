from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import api_view, permission_classes
from rest_framework import serializers

from .models import Schedule
from .serializers import ScheduleSerializer


# 📅 List Schedule (filter by room)
class ScheduleListView(generics.ListAPIView):

    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        room_id = self.request.query_params.get("room")

        queryset = Schedule.objects.select_related(
            "room",
            "teacher",
            "subject"
        )

        if room_id:
            queryset = queryset.filter(room_id=room_id)

        return queryset


# ➕ Create Schedule
class ScheduleCreateView(generics.CreateAPIView):

    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        user = self.request.user

        teacher = serializer.validated_data["teacher"]
        room = serializer.validated_data["room"]
        day = serializer.validated_data["day"]
        start_time = serializer.validated_data["start_time"]

        # 🔐 HOD restriction
        if user.role == "HOD":
            if teacher.department != user.department:
                raise PermissionDenied(
                    "You can only assign teachers from your department"
                )

        elif user.role != "SUPERADMIN":
            raise PermissionDenied(
                "Only HOD or SUPERADMIN can create schedules"
            )

        # 🚫 Room conflict
        if Schedule.objects.filter(
            room=room,
            day=day,
            start_time=start_time
        ).exists():
            raise serializers.ValidationError("Room already booked")

        # 🚫 Teacher conflict
        if Schedule.objects.filter(
            teacher=teacher,
            day=day,
            start_time=start_time
        ).exists():
            raise serializers.ValidationError("Teacher already assigned")

        serializer.save()


# ✏ Update Schedule
class ScheduleUpdateView(generics.UpdateAPIView):

    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):

        user = self.request.user
        schedule = self.get_object()

        # 🔐 HOD restriction
        if user.role == "HOD":
            if schedule.teacher.department != user.department:
                raise PermissionDenied(
                    "You cannot edit other department schedules"
                )

        elif user.role != "SUPERADMIN":
            raise PermissionDenied(
                "Only HOD or SUPERADMIN can update schedules"
            )

        serializer.save()


# 📊 Schedule Matrix API (for timetable UI)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def schedule_matrix(request):

    schedules = Schedule.objects.select_related(
        "room",
        "teacher",
        "subject"
    )

    rooms = set()
    matrix = {}

    # collect rooms
    for s in schedules:
        rooms.add(s.room.room_number)

    # define all slots
    slots = [
        "09-10",
        "10-11",
        "11-12",
        "13-14",
        "14-15",
        "15-16",
        "16-17"
    ]

    # initialize matrix with VACANT
    for room in rooms:
        matrix[room] = {slot: "VACANT" for slot in slots}

    # fill actual schedules
    for s in schedules:

        room = s.room.room_number
        slot = f"{s.start_time.strftime('%H')}-{s.end_time.strftime('%H')}"

        matrix[room][slot] = f"{s.subject.name} - {s.teacher.username}"

    return Response(matrix)


class ScheduleDeleteView(generics.DestroyAPIView):

    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):

        user = self.request.user

        if user.role == "HOD":
            if instance.teacher.department != user.department:
                raise PermissionDenied(
                    "You cannot delete other department schedules"
                )

        elif user.role != "SUPERADMIN":
            raise PermissionDenied(
                "Only HOD or SUPERADMIN can delete schedules"
            )

        instance.delete()