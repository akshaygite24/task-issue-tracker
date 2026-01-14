from rest_framework import serializers
from .models import Projects
from django.contrib.auth.models import User

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = ['id', 'name', 'description', 'owner', 'members', 'created_at']
        read_only_fields = ['id', 'owner', 'members', 'created_at']

    def create(self, validated_date):
        request = self.context['request']
        user = request.user

        # add user as owner 
        Project = Projects.objects.create(
            owner=user,
            **validated_date
        )

        # add user(owner) as member
        Project.members.add(user)

        return Project


class ProjectMemberSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()

    def validate_user_id(self, value):
        try:
            user = User.objects.get(id=value)
            return user
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this ID does not exist.")
        
class ProjectMemberListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']