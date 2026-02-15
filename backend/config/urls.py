
from django.contrib import admin
from django.urls import path, include
from core.views import home
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path("admin/", admin.site.urls),
        # jwt  
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # apps 
    path("home/",home),
    path("api/", include("workspaces.urls")),
    path("api/", include("projects.urls")),
    path("api/", include("tasks.urls")),
    path("api/auth/", include("core.urls")),
        
]
