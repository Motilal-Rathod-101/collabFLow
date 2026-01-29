
# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Workspace
from .serializers import WorkspaceSerializer

class WorkspaceListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        workspaces = Workspace.objects.all()
        serializer = WorkspaceSerializer(workspaces, many=True)
        return Response(serializer.data)
