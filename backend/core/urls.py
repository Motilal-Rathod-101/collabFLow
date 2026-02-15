from django.urls import path
from .views import SignupView, LoginView, UserProfileView

urlpatterns = [
    path("signup/", SignupView.as_view()),
    path("login/", LoginView.as_view()),   # ⭐ ADD THIS
    path("user/profile/", UserProfileView.as_view()),
]
