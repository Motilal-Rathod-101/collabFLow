from projects.models import ProjectMember
from workspaces.models import WorkspaceMember



def is_project_member(user, project):
    return ProjectMember.objects.filter(
        project=project,
        user=user
    ).exists()


def is_project_admin(user, project):
    return ProjectMember.objects.filter(
        project=project,
        user=user,
        role="admin"
    ).exists()


def is_workspace_admin(user, workspace):
    return WorkspaceMember.objects.filter(
        user=user,
        workspace=workspace,
        role="admin"
    ).exists()
