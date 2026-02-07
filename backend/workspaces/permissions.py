from .models import WorkspaceMember

def is_workspace_admin(user, workspace):
    return WorkspaceMember.objects.filter(
        user=user,
        workspace=workspace,
        role="admin"
    ).exists()
