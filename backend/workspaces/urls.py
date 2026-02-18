from django.urls import path
from .views import (
    WorkspaceListView,
    WorkspaceDetailView,
    AddWorkspaceMemberView,
    InviteWorkspaceMemberView,
    RemoveWorkspaceMemberView
)

urlpatterns = [
    path("workspaces/", WorkspaceListView.as_view()),
    path("workspaces/<uuid:pk>/", WorkspaceDetailView.as_view()),
    path("workspaces/<uuid:workspace_id>/members/", AddWorkspaceMemberView.as_view()),
    path("workspaces/<uuid:workspace_id>/invite/", InviteWorkspaceMemberView.as_view()),
    path("workspaces/<uuid:workspace_id>/members/<uuid:user_id>/",RemoveWorkspaceMemberView.as_view(),),

]
