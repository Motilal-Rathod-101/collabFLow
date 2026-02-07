from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Workspace, WorkspaceMember
from .serializers import WorkspaceSerializer
from .permissions import is_workspace_admin


class WorkspaceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # user sirf wahi workspaces dekhega jisme wo member hai
        workspaces = Workspace.objects.filter(
            members__user=request.user
        )
        return Response(WorkspaceSerializer(workspaces, many=True).data)

    def post(self, request):
        workspace = Workspace.objects.create(
            name=request.data["name"],
            owner=request.user
        )

        # creator becomes admin
        WorkspaceMember.objects.create(
            workspace=workspace,
            user=request.user,
            role="admin"
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

        WorkspaceMember.objects.get_or_create(
            workspace=workspace,
            user_id=request.data["user"],
            defaults={"role": request.data.get("role", "member")}
        )

        return Response({"message": "Member added"}, status=200)
