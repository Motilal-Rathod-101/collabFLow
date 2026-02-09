from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse

from .serializers import SignupSerializer


def home(request):
    return HttpResponse("Welcome to the Home page !")


class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            SignupSerializer(user).data,
            status=status.HTTP_201_CREATED
        )
