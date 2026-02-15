from projects.models import ProjectMember
from workspaces.models import WorkspaceMember
from rest_framework.permissions import BasePermission


# check if user belongs to project
def is_project_member(user, project):
    return ProjectMember.objects.filter(
        project=project,
        user=user
    ).exists()


# check if user is project admin
def is_project_admin(user, project):
    return ProjectMember.objects.filter(
        project=project,
        user=user,
        role="admin"
    ).exists()


# check if user is workspace admin
def is_workspace_admin(user, workspace):
    return WorkspaceMember.objects.filter(
        user=user,
        workspace=workspace,
        role="admin"
    ).exists()


class IsProjectAdminPermission(BasePermission):
    # user must be authenticated
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    # allow only project admins
    def has_object_permission(self, request, view, obj):
        return is_project_admin(request.user, obj)


class IsProjectMemberPermission(BasePermission):
    # user must be authenticated
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    # allow project members
    def has_object_permission(self, request, view, obj):
        return is_project_member(request.user, obj)


class IsWorkspaceAdminPermission(BasePermission):
    # user must be authenticated
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    # allow workspace admins
    def has_object_permission(self, request, view, obj):
        return is_workspace_admin(request.user, obj)
