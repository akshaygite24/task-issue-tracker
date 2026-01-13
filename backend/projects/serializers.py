from rest_framework import serializers
from .models import Projects


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

