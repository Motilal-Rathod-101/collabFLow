from rest_framework import serializers
from .models import Comment
from django.contrib.auth import get_user_model

User = get_user_model()


class CommentUserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "name")

    def get_name(self, obj):
        return obj.email


class CommentSerializer(serializers.ModelSerializer):
    user = CommentUserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = "__all__"
