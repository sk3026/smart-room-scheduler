from django.urls import path
from .views import (
    ScheduleListView,
    ScheduleCreateView,
    ScheduleUpdateView,
    schedule_matrix
)

urlpatterns = [

    # 📅 List schedules
    path("", ScheduleListView.as_view()),

    # ➕ Create schedule
    path("create/", ScheduleCreateView.as_view()),

    # ✏ Update schedule
    path("<int:pk>/", ScheduleUpdateView.as_view()),

    # 📊 Timetable matrix for UI
    path("matrix/", schedule_matrix),

]