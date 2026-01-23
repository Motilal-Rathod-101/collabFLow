import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser


# Custom User model
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    image = models.URLField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# Choices for roles, status, and types
class WorkspaceRole(models.TextChoices):
    ADMIN = "ADMIN", "Admin"
    MEMBER = "MEMBER", "Member"


class TaskStatus(models.TextChoices):
    TODO = "TODO", "Todo"
    IN_PROGRESS = "IN_PROGRESS", "In Progress"
    DONE = "DONE", "Done"


class TaskType(models.TextChoices):
    TASK = "TASK", "Task"
    BUG = "BUG", "Bug"
    FEATURE = "FEATURE", "Feature"
    IMPROVEMENT = "IMPROVEMENT", "Improvement"
    OTHER = "OTHER", "Other"


class ProjectStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Active"
    PLANNING = "PLANNING", "Planning"
    COMPLETED = "COMPLETED", "Completed"
    ON_HOLD = "ON_HOLD", "On Hold"
    CANCELLED = "CANCELLED", "Cancelled"


class Priority(models.TextChoices):
    LOW = "LOW", "Low"
    MEDIUM = "MEDIUM", "Medium"
    HIGH = "HIGH", "High"


# Workspace models
class Workspace(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True, null=True)
    settings = models.JSONField(default=dict)
    owner = models.ForeignKey(User, related_name="owned_workspaces", on_delete=models.CASCADE)
    image_url = models.URLField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class WorkspaceMember(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, related_name="workspaces", on_delete=models.CASCADE)
    workspace = models.ForeignKey(Workspace, related_name="members", on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=WorkspaceRole.choices, default=WorkspaceRole.MEMBER)
    message = models.TextField(blank=True, default="")

    class Meta:
        unique_together = ("user", "workspace")


# Project models
class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.MEDIUM)
    status = models.CharField(max_length=15, choices=ProjectStatus.choices, default=ProjectStatus.ACTIVE)
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    team_lead = models.ForeignKey(User, related_name="projects", on_delete=models.CASCADE)
    workspace = models.ForeignKey(Workspace, related_name="projects", on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ProjectMember(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, related_name="project_memberships", on_delete=models.CASCADE)
    project = models.ForeignKey(Project, related_name="members", on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user", "project")


# Task and Comment models
class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, related_name="tasks", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=15, choices=TaskStatus.choices, default=TaskStatus.TODO)
    type = models.CharField(max_length=15, choices=TaskType.choices, default=TaskType.TASK)
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.MEDIUM)
    assignee = models.ForeignKey(User, related_name="tasks", on_delete=models.CASCADE)
    due_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField()
    user = models.ForeignKey(User, related_name="comments", on_delete=models.CASCADE)
    task = models.ForeignKey(Task, related_name="comments", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
