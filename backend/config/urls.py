
from django.contrib import admin
from django.urls import path
from .views import home
from django.urls import path, include




urlpatterns = [
    path('admin/', admin.site.urls),
    path('home/', home),
    path('api/tasks/', include('tasks.urls')),
    path("api/projects/", include("projects.urls")),
    path("api/tasks/", include("tasks.urls")),

]
