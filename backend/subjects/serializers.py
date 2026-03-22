from rest_framework import serializers
from .models import Subject


class SubjectSerializer(serializers.ModelSerializer):

    department_name = serializers.CharField(source="department.name", read_only=True)
    department_code = serializers.CharField(source="department.code", read_only=True)

    class Meta:
        model = Subject
        fields = [
            "id",
            "name",
            "code",              # 🔥 subject code (OS01, DB01)
            "department",
            "department_name",  # 🔥 for UI
            "department_code"   # 🔥 for filtering (_01)
        ]