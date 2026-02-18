from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Workspace, WorkspaceMember, WorkspaceInvitation
from core.permissions import IsWorkspaceAdminPermission
from .serializers import WorkspaceSerializer

User = get_user_model()


class WorkspaceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        workspaces = Workspace.objects.filter(
            members__user=request.user
        ).distinct()

        return Response(
            WorkspaceSerializer(workspaces, many=True).data
        )

    def post(self, request):
        name = request.data.get("name")

        if not name:
            return Response(
                {"detail": "name is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        workspace = Workspace.objects.create(
            name=name,
            owner=request.user
        )

        # creator becomes admin
        WorkspaceMember.objects.get_or_create(
            workspace=workspace,
            user=request.user,
            defaults={"role": "admin"}
        )

        return Response(
            WorkspaceSerializer(workspace).data,
            status=status.HTTP_201_CREATED
        )


class WorkspaceDetailView(APIView):
    permission_classes = [IsAuthenticated, IsWorkspaceAdminPermission]

    def delete(self, request, pk):
        workspace = get_object_or_404(Workspace, id=pk)

        # check workspace admin permission
        self.check_object_permissions(request, workspace)

        workspace.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AddWorkspaceMemberView(APIView):
    permission_classes = [IsAuthenticated, IsWorkspaceAdminPermission]

    def post(self, request, workspace_id):
        workspace = get_object_or_404(Workspace, id=workspace_id)

        # check workspace admin permission
        self.check_object_permissions(request, workspace)

        email = request.data.get("email")
        role = request.data.get("role", "member")

        if not email:
            return Response(
                {"detail": "email required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = get_object_or_404(User, email=email)

        WorkspaceMember.objects.get_or_create(
            workspace=workspace,
            user=user,
            defaults={"role": role}
        )

        return Response({"message": "member added"})


class InviteWorkspaceMemberView(APIView):
    permission_classes = [IsAuthenticated, IsWorkspaceAdminPermission]

    def post(self, request, workspace_id):
        workspace = get_object_or_404(Workspace, id=workspace_id)

        # check workspace admin permission
        self.check_object_permissions(request, workspace)

        email = request.data.get("email")

        if not email:
            return Response(
                {"detail": "email required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        existing_user = User.objects.filter(email=email).first()

        if existing_user:
            WorkspaceMember.objects.get_or_create(
                workspace=workspace,
                user=existing_user,
                defaults={"role": "member"}
            )

            send_mail(
                "added to workspace",
                f"you were added to workspace: {workspace.name}",
                settings.EMAIL_HOST_USER,
                [email],
            )

            return Response({"message": "user added"})

        invite = WorkspaceInvitation.objects.create(
            workspace=workspace,
            email=email,
            invited_by=request.user
        )

        signup_link = f"http://localhost:5173/signup?token={invite.token}"

        send_mail(
            "workspace invitation",
            f"you are invited to join workspace: {workspace.name}\n\nsignup here:\n{signup_link}",
            settings.EMAIL_HOST_USER,
            [email],
        )

        return Response({"message": "invitation sent"})


# remove from workspaces


class RemoveWorkspaceMemberView(APIView):
    permission_classes = [IsAuthenticated, IsWorkspaceAdminPermission]

    def delete(self, request, workspace_id, user_id):
        workspace = get_object_or_404(Workspace, id=workspace_id)

        # admin permission check
        self.check_object_permissions(request, workspace)

        member = get_object_or_404(
            WorkspaceMember,
            workspace=workspace,
            user_id=user_id
        )

        # prevent removing admin
        if member.role == "admin":
            return Response(
                {"detail": "Admin cannot be removed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        member.delete()

        return Response(
            {"message": "Workspace member removed"},
            status=status.HTTP_200_OK
        )
