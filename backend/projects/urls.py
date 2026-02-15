from django.urls import path
from .views import (
    ProjectListView,
    ProjectDetailView,
    ProjectMembersView,
    AddProjectMemberView,
    # RemoveProjectMemberView,
    # ChangeProjectMemberRoleView,
)

urlpatterns = [
    path("projects/", ProjectListView.as_view()),
    path("projects/<uuid:pk>/", ProjectDetailView.as_view()),

    path("projects/<uuid:project_id>/members/", ProjectMembersView.as_view()),
    path("projects/<uuid:project_id>/members/add/", AddProjectMemberView.as_view()),

    
    # new
    # path(
    #     "projects/<uuid:project_id>/members/<uuid:user_id>/remove/",
    #     RemoveProjectMemberView.as_view()
    # ),
    # path(
    #     "projects/<uuid:project_id>/members/<uuid:user_id>/role/",
    #     ChangeProjectMemberRoleView.as_view()
    # ),
]
