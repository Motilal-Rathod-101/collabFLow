from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Workspace, WorkspaceMember, WorkspaceInvitation
from projects.serializers import ProjectSerializer
from core.serializers import UserSerializer

User = get_user_model()


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


# serializer used while creating workspace
class WorkspaceCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Workspace
        fields = ["name"]

    # validate workspace name
    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "workspace name cannot be empty"
            )
        return value

    # create workspace and add owner as admin
    def create(self, validated_data):
        user = self.context["request"].user

        workspace = Workspace.objects.create(
            owner=user,
            **validated_data
        )

        WorkspaceMember.objects.create(
            workspace=workspace,
            user=user,
            role="admin"
        )

        return workspace


# serializer for adding member
class AddWorkspaceMemberSerializer(serializers.Serializer):
    email = serializers.EmailField()
    role = serializers.ChoiceField(
        choices=["admin", "member"],
        default="member"
    )

    # check user exists
    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "user with this email does not exist"
            )
        return value


# invitation serializer
class WorkspaceInviteSerializer(serializers.Serializer):
    email = serializers.EmailField()

    # prevent inviting existing member
    def validate(self, data):
        workspace = self.context["workspace"]
        email = data["email"]

        if WorkspaceMember.objects.filter(
            workspace=workspace,
            user__email=email
        ).exists():
            raise serializers.ValidationError(
                "user already member of workspace"
            )

        return data
