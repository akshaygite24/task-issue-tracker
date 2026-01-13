from rest_framework import serializers
from .models import Tasks

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tasks
        fields = ['id', 'title', 'description', 'status', 'priority', 'project', 'created_by', 'assigned_to', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']

    def create(self, validated_data):
        request = self.context['request']
        user = request.user

        project = validated_data['project']
        assigned_to = validated_data['assigned_to']


        # user must be a member of the project to create a task
        if user not in project.members.all():
            raise serializers.ValidationError("You must be a member of the project to create a task.")
        
        # assignee must be a member of the project
        if assigned_to not in project.members.all():
            raise serializers.ValidationError("Assignee must be a member of the project.")
        
        task = Tasks.objects.create(
            created_by=user,
            **validated_data
        )

        return task