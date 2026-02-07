from rest_framework import serializers
from .models import Task
from projects.models import ProjectMember


class TaskSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Task
        fields = "__all__"

    def validate(self, data):
        assignee = data.get("assignee")

        project = self.context.get("project") or (
            self.instance.project if self.instance else None
        )

        if assignee and project:
            is_member = ProjectMember.objects.filter(
                project=project,
                user=assignee
            ).exists()

            if not is_member:
                raise serializers.ValidationError({
                    "assignee": "User is not a member of this project"
                })

        return data
