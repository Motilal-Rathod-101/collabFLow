from django.urls import path
from .views import SignupView

from .views import UserProfileView
urlpatterns = [
    path("signup/", SignupView.as_view()),
    path("user/profile/", UserProfileView.as_view()),
]
