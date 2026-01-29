from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Project
from .serializers import ProjectSerializer

class ProjectListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        projects = Project.objects.all()  # simple
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
