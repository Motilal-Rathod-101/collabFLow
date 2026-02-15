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

    # validate title
    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "task title cannot be empty"
            )
        return value

    # main validation
    def validate(self, data):
        assignee = data.get("assignee")

        # get project from context or instance
        if self.instance:
            project = self.instance.project
        else:
            project = self.context.get("project")

        # assignee must be project member
        if assignee and project:
            is_member = ProjectMember.objects.filter(
                project=project,
                user=assignee
            ).exists()

            if not is_member:
                raise serializers.ValidationError({
                    "assignee": "user is not a member of this project"
                })

        # due date basic validation
        due_date = data.get("due_date")
        if due_date and self.instance:
            if due_date < self.instance.created_at.date():
                raise serializers.ValidationError(
                    {"due_date": "due date cannot be before task creation"}
                )

        return data
