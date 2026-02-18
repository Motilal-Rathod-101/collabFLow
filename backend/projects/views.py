from tasks.models import Task
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Project, ProjectMember
from core.permissions import (
    IsProjectAdminPermission,
    IsProjectMemberPermission,
)
from .serializers import ProjectSerializer, ProjectMemberSerializer


class ProjectListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = Project.objects.filter(
            workspace__members__user=request.user
        ).distinct()

        return Response(
            ProjectSerializer(projects, many=True).data
        )

    def post(self, request):
        serializer = ProjectSerializer(
            data=request.data,
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)
        project = serializer.save()

        return Response(
            ProjectSerializer(project).data,
            status=status.HTTP_201_CREATED
        )


class ProjectDetailView(APIView):
    permission_classes = [IsAuthenticated, IsProjectAdminPermission]

    def put(self, request, pk):
        project = get_object_or_404(Project, id=pk)

        # check admin permission
        self.check_object_permissions(request, project)

        serializer = ProjectSerializer(
            project,
            data=request.data,
            partial=True,
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def delete(self, request, pk):
        project = get_object_or_404(Project, id=pk)

        # check admin permission
        self.check_object_permissions(request, project)

        project.delete()

        return Response(
            {"message": "Project deleted"},
            status=status.HTTP_204_NO_CONTENT
        )


class ProjectMembersView(APIView):
    permission_classes = [IsAuthenticated, IsProjectMemberPermission]

    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)

        # check project membership
        self.check_object_permissions(request, project)

        members = ProjectMember.objects.filter(
            project=project
        ).select_related("user")

        return Response(
            ProjectMemberSerializer(members, many=True).data
        )


class AddProjectMemberView(APIView):
    permission_classes = [IsAuthenticated, IsProjectAdminPermission]

    def post(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)

        # check admin permission
        self.check_object_permissions(request, project)

        user_id = request.data.get("user")
        role = request.data.get("role", "member")

        if role not in ["admin", "member"]:
            return Response({"detail": "invalid role"}, status=400)

        if not user_id:
            return Response({"detail": "user required"}, status=400)

        ProjectMember.objects.get_or_create(
            project=project,
            user_id=user_id,
            defaults={"role": role}
        )

        return Response({"message": "Member added"})



class RemoveProjectMemberView(APIView):
    permission_classes = [IsAuthenticated, IsProjectAdminPermission]

    def delete(self, request, project_id, user_id):
        # get project
        project = get_object_or_404(Project, id=project_id)

        # check admin permission
        self.check_object_permissions(request, project)

        # get member
        member = get_object_or_404(
            ProjectMember,
            project=project,
            user_id=user_id
        )

        # prevent removing admin
        if member.role == "admin":
            return Response(
                {"detail": "Admin cannot be removed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # unassign tasks of removed member
        Task.objects.filter(
            project=project,
            assignee_id=user_id
        ).update(assignee=None)

        # remove membership
        member.delete()

        return Response(
            {"message": "Member removed successfully"},
            status=status.HTTP_200_OK
        )
