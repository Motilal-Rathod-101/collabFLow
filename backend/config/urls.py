
from django.contrib import admin
from django.urls import path, include
from core.views import home

urlpatterns = [
    path("admin/", admin.site.urls),
    path("home/",home),
    path("api/", include("workspaces.urls")),
    path("api/", include("projects.urls")),
    path("api/", include("tasks.urls")),
    path("api/", include("comments.urls")),
]
