from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Workspace, WorkspaceMember, WorkspaceInvitation
from core.permissions import is_workspace_admin
from .serializers import WorkspaceSerializer

User = get_user_model()


class WorkspaceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        workspaces = Workspace.objects.filter(
            members__user=request.user
        ).distinct()
        return Response(WorkspaceSerializer(workspaces, many=True).data)

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
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        workspace = get_object_or_404(Workspace, id=pk)

        if not is_workspace_admin(request.user, workspace):
            return Response(
                {"detail": "only admin can delete workspace"},
                status=status.HTTP_403_FORBIDDEN
            )

        workspace.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AddWorkspaceMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, workspace_id):
        workspace = get_object_or_404(Workspace, id=workspace_id)

        if not is_workspace_admin(request.user, workspace):
            return Response(
                {"detail": "only admin can add members"},
                status=status.HTTP_403_FORBIDDEN
            )

        role = request.data.get("role", "member")
        email = request.data.get("email")

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
    permission_classes = [IsAuthenticated]

    def post(self, request, workspace_id):
        workspace = get_object_or_404(Workspace, id=workspace_id)

        if not is_workspace_admin(request.user, workspace):
            return Response({"detail": "forbidden"}, status=403)

        email = request.data.get("email")

        if not email:
            return Response({"detail": "email required"}, status=400)

        # if user already exists add directly
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

        # create invitation
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
