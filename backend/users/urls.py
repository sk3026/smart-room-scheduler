from django.urls import path
from .views import LoginView, UserListView, UserUpdateView, TeacherListView

urlpatterns = [
    path("login/", LoginView.as_view()),
    path("users/", UserListView.as_view()),
    path("users/<int:pk>/", UserUpdateView.as_view()),

    
    path("users/teachers/", TeacherListView.as_view()),
]