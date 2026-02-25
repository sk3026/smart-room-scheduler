from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import LoginSerializer, UserSerializer
from .models import User


# 🔐 Login View (PUBLIC)
class LoginView(APIView):
    permission_classes = [AllowAny]   # ✅ Allow login without token

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            return Response(serializer.validated_data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 📋 List Users (SUPERADMIN only)
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != "SUPERADMIN":
            return User.objects.none()
        return User.objects.all()


# ✏ Update User Role (SUPERADMIN only)
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

        # 🚨 Enforce only one HOD per department
        if role == "HOD" and department:
            User.objects.filter(
                department=department,
                role="HOD"
            ).exclude(pk=self.get_object().pk).update(role="TEACHER")

        serializer.save()