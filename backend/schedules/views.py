from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Schedule
from .serializers import ScheduleSerializer


# 📅 List Schedule (filter by room)
class ScheduleListView(generics.ListAPIView):
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        room_id = self.request.query_params.get("room")
        queryset = Schedule.objects.all()

        if room_id:
            queryset = queryset.filter(room_id=room_id)

        return queryset


# ✏ Update Schedule
class ScheduleUpdateView(generics.UpdateAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        user = self.request.user
        schedule = self.get_object()

        # 🔐 Only HOD of same department or SUPERADMIN
        if user.role == "HOD":
            if schedule.room.department != user.department:
                raise PermissionDenied("You cannot edit other department schedules")

        elif user.role != "SUPERADMIN":
            raise PermissionDenied("Only HOD or SUPERADMIN can update schedules")

        serializer.save()