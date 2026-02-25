from django.urls import path
from .views import ScheduleListCreateView, ScheduleDetailView, TeacherScheduleView

urlpatterns = [
    path("schedule/", ScheduleListCreateView.as_view()),
    path("schedule/<int:pk>/", ScheduleDetailView.as_view()),
    path("schedule/teacher/", TeacherScheduleView.as_view()),
]