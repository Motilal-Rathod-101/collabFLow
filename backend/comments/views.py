from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Comment
from .serializers import CommentSerializer
from tasks.models import Task
from core.permissions import IsProjectMemberPermission


class CommentListView(APIView):
    permission_classes = [IsAuthenticated, IsProjectMemberPermission]

    def get(self, request):
        task_id = request.query_params.get("task")

        if not task_id:
            return Response(
                {"detail": "task query param is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        task = get_object_or_404(Task, id=task_id)

        # check project membership
        self.check_object_permissions(request, task.project)

        comments = (
            Comment.objects
            .filter(task=task)
            .select_related("user")
            .order_by("created_at")
        )

        serializer = CommentSerializer(comments, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        task_id = request.data.get("task")

        if not task_id:
            return Response(
                {"detail": "task is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        task = get_object_or_404(Task, id=task_id)

        # check project membership
        self.check_object_permissions(request, task.project)

        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save(user=request.user)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )
