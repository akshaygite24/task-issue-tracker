from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Tasks
from .serializers import TaskSerializer

from .permissions import IsTaskEditor, IsTaskDeletor
from rest_framework.generics import RetrieveUpdateDestroyAPIView

class TaskListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tasks = Tasks.objects.filter(
            project__members=request.user
        )

        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = TaskSerializer(
            data=request.data,
            context={'request': request},
        )


        if serializer.is_valid():
            task = serializer.save()
            return Response(
                TaskSerializer(task).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class TaskDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Tasks.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            self.permission_classes.append(IsTaskEditor)
        elif self.request.method == 'DELETE':
            self.permission_classes.append(IsTaskDeletor)
        return super().get_permissions()