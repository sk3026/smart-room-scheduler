from django.urls import path
from .views import (
    ScheduleListView,
    ScheduleCreateView,
    ScheduleUpdateView,
    ScheduleDeleteView,
    schedule_matrix
)

urlpatterns = [

    # List schedules
    path("", ScheduleListView.as_view()),

    # Create schedule
    path("create/", ScheduleCreateView.as_view()),

    # Update schedule
    path("<int:pk>/", ScheduleUpdateView.as_view()),

    # Delete schedule
    path("delete/<int:pk>/", ScheduleDeleteView.as_view()),

    # Timetable matrix
    path("matrix/", schedule_matrix),

]