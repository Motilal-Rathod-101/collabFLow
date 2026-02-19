from django.urls import path
from .views import TaskListView, TaskDetailView, BulkDeleteTaskView

urlpatterns = [
    path("projects/<uuid:project_id>/tasks/", TaskListView.as_view()),
    path("tasks/<uuid:pk>/", TaskDetailView.as_view()),
    path("tasks/bulk-delete/", BulkDeleteTaskView.as_view()),

]
