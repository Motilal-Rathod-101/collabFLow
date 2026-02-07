from django.urls import path
from .views import WorkspaceListView, WorkspaceDetailView


urlpatterns = [
    path("workspaces/", WorkspaceListView.as_view(), name="workspace-list"),
        path("workspaces/<uuid:pk>/", WorkspaceDetailView.as_view()),
        

]
