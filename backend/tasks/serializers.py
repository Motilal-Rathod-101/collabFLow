# backend/tasks/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Task
from projects.models import ProjectMember

User = get_user_model()


class AssigneeSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "name")

    def get_name(self, obj):
        return obj.email


class TaskSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(read_only=True)

    assignee = AssigneeSerializer(read_only=True)
    assignee_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="assignee",
        write_only=True,
        required=False,
        allow_null=True
    )

    created_by = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Task
        fields = "__all__"

    def validate(self, data):
        assignee = data.get("assignee")

        project = (
            self.context.get("project")
            or (self.instance.project if self.instance else None)
        )

        if assignee and project:
            is_member = ProjectMember.objects.filter(
                project=project,
                user=assignee
            ).exists()

            if not is_member:
                raise serializers.ValidationError({
                    "assignee": "user is not a member of this project"
                })

        return data
