from .models import ProjectMember

def is_project_admin(user, project):
    return ProjectMember.objects.filter(
        user=user,
        project=project,
        role="admin"
    ).exists()
