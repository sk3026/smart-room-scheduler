from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Schedule
from .serializers import ScheduleSerializer


class ScheduleListCreateView(generics.ListCreateAPIView):
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "SUPERADMIN":
            return Schedule.objects.all()

        if user.role == "HOD":
            return Schedule.objects.filter(
                teacher__department=user.department
            )

        if user.role == "TEACHER":
            return Schedule.objects.filter(
                teacher=user
            )

        return Schedule.objects.none()

    def perform_create(self, serializer):
        user = self.request.user

        if user.role not in ["HOD", "SUPERADMIN"]:
            raise PermissionDenied("Only HOD or SUPERADMIN can create schedules.")

        teacher = serializer.validated_data["teacher"]
        room = serializer.validated_data["room"]
        subject = serializer.validated_data["subject"]

        if user.role == "HOD":
            if teacher.department != user.department:
                raise PermissionDenied("Cannot assign teacher from another department.")
            if room.department != user.department:
                raise PermissionDenied("Cannot assign room from another department.")
            if subject.department != user.department:
                raise PermissionDenied("Cannot assign subject from another department.")

        serializer.save()


class ScheduleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        user = self.request.user

        if user.role not in ["HOD", "SUPERADMIN"]:
            raise PermissionDenied("Only HOD or SUPERADMIN can update schedules.")

        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user

        if user.role not in ["HOD", "SUPERADMIN"]:
            raise PermissionDenied("Only HOD or SUPERADMIN can delete schedules.")

        instance.delete()


class TeacherScheduleView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        schedules = Schedule.objects.filter(teacher=request.user)
        serializer = ScheduleSerializer(schedules, many=True)
        return Response(serializer.data)