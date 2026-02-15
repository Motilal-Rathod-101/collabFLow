from django.urls import path
from .views import SignupView, LoginView, UserProfileView,ChangePasswordView

urlpatterns = [
    path("signup/", SignupView.as_view()),
    path("login/", LoginView.as_view()),  
    path("user/profile/", UserProfileView.as_view()),
    path("change-password/", ChangePasswordView.as_view()),
]
