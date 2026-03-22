from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from departments.models import Department


# ===================== LOGIN =====================
class LoginSerializer(serializers.Serializer):

    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):

        user = authenticate(
            username=data["username"],
            password=data["password"]
        )

        if user is None:
            raise serializers.ValidationError("Invalid credentials")

        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "role": user.role,
                "department": user.department.name if user.department else None,
                "department_code": user.department.code if user.department else None
            }
        }


# ===================== USER SERIALIZER =====================
class UserSerializer(serializers.ModelSerializer):

    department = serializers.SlugRelatedField(
        queryset=Department.objects.all(),
        slug_field="name",
        required=False,
        allow_null=True
    )

    department_code = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "password", "role", "department", "department_code"]
        extra_kwargs = {
            "password": {"write_only": True, "required": False}
        }

    # 🔥 ADD department_code
    def get_department_code(self, obj):
        return obj.department.code if obj.department else None

    def create(self, validated_data):

        password = validated_data.pop("password", None)

        user = User(**validated_data)

        if password:
            user.set_password(password)

        # 🔥 FIX: remove department for SUPERADMIN
        if user.role == "SUPERADMIN":
            user.department = None

        user.save()
        return user

    def update(self, instance, validated_data):

        instance.username = validated_data.get("username", instance.username)
        instance.role = validated_data.get("role", instance.role)

        # 🔥 FIX: department handling
        if instance.role == "SUPERADMIN":
            instance.department = None
        else:
            instance.department = validated_data.get("department", instance.department)

        password = validated_data.get("password")
        if password:
            instance.set_password(password)

        instance.save()
        return instance