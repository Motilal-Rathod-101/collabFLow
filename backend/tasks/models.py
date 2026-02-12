from django.db import models
from django.conf import settings
from projects.models import Project
import uuid

class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    STATUS_CHOICES = [
        ('TODO', 'TODO'),
        ('IN_PROGRESS', 'IN_PROGRESS'),
        ('DONE', 'DONE'),
    ]

    TYPE_CHOICES = [
        ('TASK', 'TASK'),
        ('BUG', 'BUG'),
        ('FEATURE', 'FEATURE'),
        ('IMPROVEMENT', 'IMPROVEMENT'),
        ('OTHER', 'OTHER'),
    ]

    PRIORITY_CHOICES = [
        ('LOW', 'LOW'),
        ('MEDIUM', 'MEDIUM'),
        ('HIGH', 'HIGH'),
    ]

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='tasks'
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='TODO'
    )

    type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='TASK'
    )

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='MEDIUM'
    )

    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tasks'
    )

    created_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    related_name="created_tasks"
    )


    due_date = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
