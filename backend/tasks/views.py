from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Task
from .serializers import TaskSerializer
from projects.models import Project
from projects.permissions import is_project_member, is_project_admin


class TaskListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)

        if not is_project_member(request.user, project):
            return Response(
                {"detail": "forbidden"},
                status=status.HTTP_403_FORBIDDEN
            )

        tasks = (
            Task.objects
            .filter(project=project)
            .select_related("assignee", "created_by")
        )

        serializer = TaskSerializer(
            tasks,
            many=True,
            context={"project": project}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)

        # only project admin can create task
        if not is_project_admin(request.user, project):
            return Response(
                {"detail": "only admin can create task"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = TaskSerializer(
            data=request.data,
            context={"project": project}
        )
        serializer.is_valid(raise_exception=True)

        task = serializer.save(
            project=project,
            created_by=request.user
        )

        return Response(
            TaskSerializer(task, context={"project": project}).data,
            status=status.HTTP_201_CREATED
        )


class TaskDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        task = get_object_or_404(Task, id=pk)

        # must be project member
        if not is_project_member(request.user, task.project):
            return Response(
                {"detail": "forbidden"},
                status=status.HTTP_403_FORBIDDEN
            )

        # only admin or assignee can update
        if not (
            is_project_admin(request.user, task.project)
            or task.assignee == request.user
        ):
            return Response(
                {"detail": "only admin or assignee can update task"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = TaskSerializer(
            task,
            data=request.data,
            partial=True,
            context={"project": task.project}
        )
        serializer.is_valid(raise_exception=True)
        task = serializer.save()

        return Response(
            TaskSerializer(task, context={"project": task.project}).data,
            status=status.HTTP_200_OK
        )

    def delete(self, request, pk):
        task = get_object_or_404(Task, id=pk)

        if not is_project_admin(request.user, task.project):
            return Response(
                {"detail": "only admin can delete task"},
                status=status.HTTP_403_FORBIDDEN
            )

        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BulkDeleteTaskView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        ids = request.data.get("ids", [])

        if not ids:
            return Response(
                {"detail": "no task ids provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        tasks = Task.objects.filter(id__in=ids).select_related("project")

        for task in tasks:
            if not is_project_admin(request.user, task.project):
                return Response(
                    {"detail": "only admin can delete tasks"},
                    status=status.HTTP_403_FORBIDDEN
                )

        deleted_count, _ = tasks.delete()

        return Response(
            {"deleted": deleted_count},
            status=status.HTTP_200_OK
        )
