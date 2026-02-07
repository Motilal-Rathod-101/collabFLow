from projects.models import ProjectMember


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
