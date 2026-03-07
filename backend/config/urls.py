from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/", include("users.urls")),
    path("api/rooms/", include("rooms.urls")),
    path("api/schedule/", include("schedules.urls")),

    # ✅ NEW
    path("api/subjects/", include("subjects.urls")),
    path("", TemplateView.as_view(template_name="index.html")),

]