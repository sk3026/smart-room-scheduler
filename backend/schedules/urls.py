from django.urls import path
from .views import ScheduleListView, ScheduleUpdateView

urlpatterns = [
    path("", ScheduleListView.as_view()),
    path("<int:pk>/", ScheduleUpdateView.as_view()),
]