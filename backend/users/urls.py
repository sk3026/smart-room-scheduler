from django.urls import path
from .views import (
    LoginView,
    UserListView,
    UserCreateView,
    UserUpdateView,
    TeacherListView,
    CreateAdminView   # 👈 ADD THIS
)

urlpatterns = [

    path("login/", LoginView.as_view()),

    path("users/", UserListView.as_view()),

    path("users/create/", UserCreateView.as_view()),

    path("users/<int:pk>/", UserUpdateView.as_view()),

    path("users/teachers/", TeacherListView.as_view()),

    path("create-admin/", CreateAdminView.as_view()),  
]