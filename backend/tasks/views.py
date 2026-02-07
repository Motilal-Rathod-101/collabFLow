from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework import status

from .models import Task
from .serializers import TaskSerializer
from projects.models import Project
from core.permissions import is_project_member, is_project_admin


class TaskListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)

        if not is_project_member(request.user, project):
            return Response({"detail": "Forbidden"}, status=403)

        tasks = Task.objects.filter(project=project)
        return Response(TaskSerializer(tasks, many=True).data)

    def post(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)

        if not is_project_member(request.user, project):
            return Response({"detail": "Forbidden"}, status=403)

        serializer = TaskSerializer(
            data=request.data,
            context={"project": project}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(project=project)

        return Response(serializer.data, status=201)



class TaskDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        task = get_object_or_404(Task, id=pk)

        if (
            task.assignee != request.user
            and not is_project_admin(request.user, task.project)
        ):
            return Response({"detail": "Forbidden"}, status=403)

        serializer = TaskSerializer(task, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def delete(self, request, pk):
        task = get_object_or_404(Task, id=pk)

        if not is_project_admin(request.user, task.project):
            return Response(
                {"detail": "Only admin can delete task"},
                status=403
            )

        task.delete()
        return Response(status=204)


class BulkDeleteTaskView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        ids = request.data.get("ids", [])

        if not ids:
            return Response(
                {"detail": "No task ids provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        tasks = Task.objects.filter(id__in=ids)

        for task in tasks:
            if not is_project_admin(request.user, task.project):
                return Response(
                    {"detail": "Only admin can delete tasks"},
                    status=403
                )

        deleted, _ = tasks.delete()

        return Response({"deleted": deleted}, status=200)
