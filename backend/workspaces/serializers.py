from rest_framework import serializers
from .models import Workspace, WorkspaceMember
from projects.serializers import ProjectSerializer
from core.serializers import UserSerializer


class WorkspaceMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = WorkspaceMember
        fields = ["id", "user", "role"]


class WorkspaceSerializer(serializers.ModelSerializer):
    members = WorkspaceMemberSerializer(many=True, read_only=True)
    projects = ProjectSerializer(many=True, read_only=True)

    class Meta:
        model = Workspace
        fields = [
            "id",
            "name",
            "created_at",
            "owner",
            "members", 
            "projects",
        ]
        read_only_fields = ["owner"]   