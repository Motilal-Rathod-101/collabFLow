from rest_framework import serializers
from .models import User
from workspaces.models import WorkspaceInvitation, WorkspaceMember


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "image",
        ]
        read_only_fields = ["email"]


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    token = serializers.UUIDField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = User
        fields = ("id", "email", "username", "password", "token")

    def create(self, validated_data):
        token = validated_data.pop("token", None)

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        # auto workspace join
        if token:
            invite = WorkspaceInvitation.objects.filter(
                token=token,
                accepted=False
            ).first()

            if invite and invite.email.lower() == user.email.lower():
                WorkspaceMember.objects.get_or_create(
                    workspace=invite.workspace,
                    user=user,
                    defaults={"role": "member"}
                )

                invite.accepted = True
                invite.save(update_fields=["accepted"])

        return user

# rest pass
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
