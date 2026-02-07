from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Project, ProjectMember
from .serializers import ProjectSerializer, ProjectMemberSerializer
from .permissions import is_project_admin

# from .views import ProjectDetailView


# class ProjectListView(APIView):
#     permission_classes = [AllowAny]

#     def get(self, request):
#         projects = Project.objects.all()  # simple
#         serializer = ProjectSerializer(projects, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = ProjectSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         project = serializer.save()
#         return Response(ProjectSerializer(project).data, status=201)\
        

# class ProjectDetailView(APIView):
#     permission_classes = [AllowAny]

#     def put(self, request, pk):
#         project = Project.objects.get(id=pk)
#         serializer = ProjectSerializer(project, data=request.data, partial=True)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data)

#     def delete(self, request, pk):
#         project = Project.objects.get(id=pk)
#         project.delete()
#         return Response(status=204)
# class ProjectMembersView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, project_id):
#         project = get_object_or_404(Project, id=project_id)
#         members = ProjectMember.objects.filter(project=project)
#         return Response(ProjectMemberSerializer(members, many=True).data)
    
# class AddProjectMemberView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, project_id):
#         project = get_object_or_404(Project, id=project_id)

#         if not is_project_admin(request.user, project):
#             return Response({"detail": "Forbidden"}, status=403)

#         ProjectMember.objects.get_or_create(
#             project=project,
#             user_id=request.data["user"],
#             defaults={"role": request.data.get("role", "member")}
#         )
#         return Response({"message": "Member added"})
class ProjectListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = Project.objects.filter(workspace__members__user=request.user)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        project = serializer.save()

        # ✅ creator becomes admin
        ProjectMember.objects.create(
            project=project,
            user=request.user,
            role="admin"
        )

        return Response(ProjectSerializer(project).data, status=201)

class ProjectDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        project = get_object_or_404(Project, id=pk)

        if not is_project_admin(request.user, project):
            return Response({"detail": "Only admin can edit"}, status=403)

        serializer = ProjectSerializer(project, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        project = get_object_or_404(Project, id=pk)

        if not is_project_admin(request.user, project):
            return Response({"detail": "Only admin can delete"}, status=403)

        project.delete()
        return Response(status=204)
class ProjectMembersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)

        # only project members can view
        if not ProjectMember.objects.filter(
            project=project, user=request.user
        ).exists():
            return Response(
                {"detail": "Not a project member"},
                status=403
            )

        members = ProjectMember.objects.filter(project=project)
        return Response(ProjectMemberSerializer(members, many=True).data)

class AddProjectMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)

        if not is_project_admin(request.user, project):
            return Response({"detail": "Forbidden"}, status=403)

        ProjectMember.objects.get_or_create(
            project=project,
            user_id=request.data["user"],
            defaults={"role": request.data.get("role", "member")}
        )

        return Response({"message": "Member added"})
    
class RemoveProjectMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id, user_id):
        project = get_object_or_404(Project, id=project_id)

        # only admin can remove
        if not is_project_admin(request.user, project):
            return Response({"detail": "Only admin can remove members"}, status=403)

        # admin cannot remove himself
        if str(request.user.id) == str(user_id):
            return Response(
                {"detail": "Admin cannot remove himself"},
                status=400
            )

        member = get_object_or_404(
            ProjectMember,
            project=project,
            user_id=user_id
        )

        member.delete()
        return Response({"message": "Member removed"})
class ChangeProjectMemberRoleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id, user_id):
        project = get_object_or_404(Project, id=project_id)

        # only admin can change roles
        if not is_project_admin(request.user, project):
            return Response(
                {"detail": "Only admin can change roles"},
                status=403
            )

        new_role = request.data.get("role")

        if new_role not in ["admin", "member"]:
            return Response(
                {"detail": "Invalid role"},
                status=400
            )

        #admin cannot demote himself
        if str(request.user.id) == str(user_id) and new_role != "admin":
            return Response(
                {"detail": "Admin cannot change his own role"},
                status=400
            )

        member = get_object_or_404(
            ProjectMember,
            project=project,
            user_id=user_id
        )

        member.role = new_role
        member.save()

        return Response({"message": "Role updated"})
