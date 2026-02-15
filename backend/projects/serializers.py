from rest_framework import serializers
from .models import Project, ProjectMember
from tasks.serializers import TaskSerializer
from core.serializers import UserSerializer
from workspaces.models import WorkspaceMember


class ProjectMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ProjectMember
        fields = "__all__"


class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    members = ProjectMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = "__all__"

    # validate project name
    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "project name cannot be empty"
            )
        return value

    # validate dates
    def validate(self, data):
        start = data.get("start_date")
        end = data.get("end_date")

        if start and end and end < start:
            raise serializers.ValidationError(
                "end date cannot be before start date"
            )

        return data

    # create project and auto add creator as admin
    def create(self, validated_data):
        request = self.context["request"]
        workspace = validated_data["workspace"]

        # ensure creator is workspace member
        if not WorkspaceMember.objects.filter(
            workspace=workspace,
            user=request.user
        ).exists():
            raise serializers.ValidationError(
                "you are not a workspace member"
            )

        project = Project.objects.create(**validated_data)

        ProjectMember.objects.create(
            project=project,
            user=request.user,
            role="admin"
        )

        return project
