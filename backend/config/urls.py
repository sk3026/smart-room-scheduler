from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def home(request):
    return JsonResponse({"message": "Smart Room Scheduler API is running"})


urlpatterns = [
    path("", home),

    path("admin/", admin.site.urls),

    path("api/", include("users.urls")),
    path("api/rooms/", include("rooms.urls")),
    path("api/schedule/", include("schedules.urls")),
    path("api/subjects/", include("subjects.urls")),
]