from django.urls import path
from .views import ScheduleListView, ScheduleCreateView, ScheduleUpdateView

urlpatterns = [

    # GET schedules
    path("", ScheduleListView.as_view()),

    # CREATE schedule
    path("create/", ScheduleCreateView.as_view()),

    # UPDATE schedule
    path("<int:pk>/", ScheduleUpdateView.as_view()),
]