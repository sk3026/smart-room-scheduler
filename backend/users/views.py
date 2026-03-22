from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import LoginSerializer, UserSerializer
from .models import User


# ===================== LOGIN =====================
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            return Response(serializer.validated_data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===================== LIST USERS (SUPERADMIN) =====================
class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role != "SUPERADMIN":
            return User.objects.none()

        return User.objects.all().select_related("department")


# ===================== CREATE USER =====================
class UserCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        if request.user.role != "SUPERADMIN":
            return Response(
                {"detail": "Only SUPERADMIN can create users."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            # 🔥 FIX: Remove department for admin
            if user.role == "SUPERADMIN":
                user.department = None
                user.save()

            return Response(
                {
                    "id": user.id,
                    "username": user.username,
                    "role": user.role,
                    "department": user.department.name if user.department else None,
                    "department_code": user.department.code if user.department else None
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===================== UPDATE USER =====================
class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):

        if request.user.role != "SUPERADMIN":
            return Response(
                {"detail": "Only SUPERADMIN can update users."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):

        role = serializer.validated_data.get("role")
        department = serializer.validated_data.get("department")

        # 🔥 Only one HOD per department
        if role == "HOD" and department:
            User.objects.filter(
                department=department,
                role="HOD"
            ).exclude(pk=self.get_object().pk).update(role="TEACHER")

        user = serializer.save()

        # 🔥 Remove department for SUPERADMIN
        if user.role == "SUPERADMIN":
            user.department = None
            user.save()


# ===================== TEACHER LIST =====================
class TeacherListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        # SUPERADMIN → all teachers
        if user.role == "SUPERADMIN":
            return User.objects.filter(role="TEACHER")

        # HOD → only own department teachers
        if user.role == "HOD":
            return User.objects.filter(
                role="TEACHER",
                department=user.department
            )

        # others → none
        return User.objects.none()