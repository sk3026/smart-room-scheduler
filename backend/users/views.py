from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import LoginSerializer, UserSerializer
from .models import User


# LOGIN
class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            return Response(serializer.validated_data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# LIST USERS (SUPERADMIN)
class UserListView(generics.ListAPIView):

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        if self.request.user.role != "SUPERADMIN":
            return User.objects.none()

        return User.objects.all()


# CREATE USER (SUPERADMIN)
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

            return Response(
                {
                    "id": user.id,
                    "username": user.username,
                    "role": user.role,
                    "department": user.department.name if user.department else None
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# UPDATE USER ROLE
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

        # Only one HOD per department
        if role == "HOD" and department:

            User.objects.filter(
                department=department,
                role="HOD"
            ).exclude(pk=self.get_object().pk).update(role="TEACHER")

        serializer.save()


# TEACHER LIST
class TeacherListView(generics.ListAPIView):

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return User.objects.filter(role="TEACHER")
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class CreateAdminView(APIView):
    permission_classes = [AllowAny]  # temporary

    def get(self, request):
        if not UserModel.objects.filter(username="admin").exists():
            UserModel.objects.create_superuser(
                username="admin",
                email="admin@gmail.com",
                password="admin123"
            )
            return Response({"status": "admin created"})
        
        return Response({"status": "admin already exists"})