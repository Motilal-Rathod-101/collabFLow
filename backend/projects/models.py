from django.db import models
import uuid
from core.models import User
from workspaces.models import Workspace


class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="projects"
    )

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=[
            ("PLANNING", "Planning"),
            ("ACTIVE", "Active"),
            ("ON_HOLD", "On Hold"),
            ("COMPLETED", "Completed"),
        ],
        default="PLANNING",
    )

    priority = models.CharField(
        max_length=20,
        choices=[
            ("LOW", "Low"),
            ("MEDIUM", "Medium"),
            ("HIGH", "High"),
        ],
        default="MEDIUM",
    )

    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # same project name cannot exist twice in one workspace
        unique_together = ["workspace", "name"]

    def __str__(self):
        return self.name


class ProjectMember(models.Model):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("member", "Member"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="members"
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="member")
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # prevent duplicate members
        unique_together = ["project", "user"]

    def __str__(self):
        return f"{self.user} → {self.project}"
