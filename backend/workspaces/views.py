from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Workspace, WorkspaceMember
from .permissions import is_workspace_admin
from .serializers import WorkspaceSerializer

User = get_user_model()


class WorkspaceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        workspaces = Workspace.objects.filter(members__user=request.user).distinct()
        return Response(WorkspaceSerializer(workspaces, many=True).data)

    def post(self, request):
        name = request.data.get("name")
        if not name:
            return Response({"detail": "name is required"}, status=status.HTTP_400_BAD_REQUEST)

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
                {"detail": "Only admin can delete workspace"},
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
                {"detail": "Only admin can add members"},
                status=status.HTTP_403_FORBIDDEN
            )

        role = request.data.get("role", "member")
        if role not in ["admin", "member"]:
            role = "member"

        user_id = request.data.get("user")
        email = request.data.get("email")

        user = None
        if user_id:
            user = get_object_or_404(User, id=user_id)
        elif email:
            user = get_object_or_404(User, email=email)
        else:
            return Response(
                {"detail": "user or email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        WorkspaceMember.objects.get_or_create(
            workspace=workspace,
            user=user,
            defaults={"role": role}
        )

        return Response({"message": "Member added"}, status=status.HTTP_200_OK)


class InviteWorkspaceMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, workspace_id):
        workspace = get_object_or_404(Workspace, id=workspace_id)

        if not is_workspace_admin(request.user, workspace):
            return Response(
                {"detail": "Only admin can invite members"},
                status=status.HTTP_403_FORBIDDEN
            )

        email = request.data.get("email")
        role = request.data.get("role", "member")

        if role not in ["admin", "member"]:
            role = "member"

        if not email:
            return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)

            WorkspaceMember.objects.get_or_create(
                workspace=workspace,
                user=user,
                defaults={"role": role}
            )

            send_mail(
                subject="You have been added to a workspace",
                message=f"You were added to workspace: {workspace.name}",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=False,
            )

            return Response({"message": "User added & email sent"}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            send_mail(
                subject="Workspace Invitation",
                message=f"You are invited to join workspace: {workspace.name}. Please sign up.",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=False,
            )

            return Response({"message": "Invitation email sent"}, status=status.HTTP_200_OK)
