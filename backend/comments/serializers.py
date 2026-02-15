from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Comment

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
        read_only_fields = ["user"]

    # validate comment content
    def validate_content(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "comment cannot be empty"
            )
        return value
