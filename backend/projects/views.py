# backend/projects/views.py
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Project, ProjectMember
from core.permissions import is_project_admin
from .serializers import ProjectSerializer, ProjectMemberSerializer


class ProjectListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = Project.objects.filter(workspace__members__user=request.user).distinct()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        workspace = serializer.validated_data["workspace"]

        if not workspace.members.filter(user=request.user).exists():
            return Response(
                {"detail": "Not a workspace member"},
                status=status.HTTP_403_FORBIDDEN
            )

        project = serializer.save()

        ProjectMember.objects.get_or_create(
            project=project,
            user=request.user,
            defaults={"role": "admin"}
        )

        return Response(ProjectSerializer(project).data, status=status.HTTP_201_CREATED)


class ProjectDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        project = get_object_or_404(Project, id=pk)

        if not ProjectMember.objects.filter(project=project, user=request.user).exists():
            return Response({"detail": "Not a project member"}, status=status.HTTP_403_FORBIDDEN)

        if not is_project_admin(request.user, project):
            return Response({"detail": "Only admin can edit"}, status=status.HTTP_403_FORBIDDEN)

        serializer = ProjectSerializer(project, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        project = get_object_or_404(Project, id=pk)

        if not ProjectMember.objects.filter(project=project, user=request.user).exists():
            return Response({"detail": "Not a project member"}, status=status.HTTP_403_FORBIDDEN)

        if not is_project_admin(request.user, project):
            return Response({"detail": "Only admin can delete"}, status=status.HTTP_403_FORBIDDEN)

        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProjectMembersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)

        if not ProjectMember.objects.filter(project=project, user=request.user).exists():
            return Response({"detail": "Not a project member"}, status=status.HTTP_403_FORBIDDEN)

        members = ProjectMember.objects.filter(project=project).select_related("user")
        return Response(ProjectMemberSerializer(members, many=True).data, status=status.HTTP_200_OK)


class AddProjectMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)

        if not is_project_admin(request.user, project):
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

        role = request.data.get("role", "member")
        if role not in ["admin", "member"]:
            role = "member"

        user_id = request.data.get("user")
        if not user_id:
            return Response({"detail": "user is required"}, status=status.HTTP_400_BAD_REQUEST)

        ProjectMember.objects.get_or_create(
            project=project,
            user_id=user_id,
            defaults={"role": role}
        )

        return Response({"message": "Member added"}, status=status.HTTP_200_OK)


class RemoveProjectMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id, user_id):
        project = get_object_or_404(Project, id=project_id)

        if not is_project_admin(request.user, project):
            return Response({"detail": "Only admin can remove members"}, status=status.HTTP_403_FORBIDDEN)

        if str(request.user.id) == str(user_id):
            return Response({"detail": "Admin cannot remove himself"}, status=status.HTTP_400_BAD_REQUEST)

        member = get_object_or_404(ProjectMember, project=project, user_id=user_id)
        member.delete()

        return Response({"message": "Member removed"}, status=status.HTTP_200_OK)


class ChangeProjectMemberRoleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id, user_id):
        project = get_object_or_404(Project, id=project_id)

        if not is_project_admin(request.user, project):
            return Response({"detail": "Only admin can change roles"}, status=status.HTTP_403_FORBIDDEN)

        new_role = request.data.get("role")
        if new_role not in ["admin", "member"]:
            return Response({"detail": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)

        if str(request.user.id) == str(user_id) and new_role != "admin":
            return Response({"detail": "Admin cannot change his own role"}, status=status.HTTP_400_BAD_REQUEST)

        member = get_object_or_404(ProjectMember, project=project, user_id=user_id)
        member.role = new_role
        member.save(update_fields=["role"])

        return Response({"message": "Role updated"}, status=status.HTTP_200_OK)
