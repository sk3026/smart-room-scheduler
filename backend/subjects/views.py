from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Subject
from .serializers import SubjectSerializer


class SubjectListView(generics.ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]