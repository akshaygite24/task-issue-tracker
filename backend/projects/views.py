from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Projects
from .serializers import ProjectSerializer, ProjectMemberSerializer, ProjectMemberListSerializer


class ProjectListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = Projects.objects.filter(members=request.user)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = ProjectSerializer(
            data=request.data,
            context={'request': request},
        )

        if serializer.is_valid():
            project = serializer.save()
            return Response(
                ProjectSerializer(project).data,
                status=status.HTTP_201_CREATED,
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ProjectDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProjectSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        return Projects.objects.filter(members=self.request.user)


class ProjectMemberApiView(APIView):
    permission_classes = [IsAuthenticated]


    def get(self, request, project_id):
        project = Projects.objects.get(id=project_id)

        if request.user not in project.members.all():
            return Response(
                {"detail": "You are not a member of this project."},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        serializer = ProjectMemberListSerializer(
            project.members.all(),
            many=True,
        )

        return Response(serializer.data, status=status.HTTP_200_OK)


    def post(self, request, project_id):
        project = Projects.objects.get(id=project_id)

        if project.owner != request.user:
            return Response(
                {"detail": "Only the project owner can add members."},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        serializer = ProjectMemberSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user_id']

            project.members.add(user)

            return Response(
                {"detail": "Member added successfully."},
                status=status.HTTP_200_OK,
            )
        else:
            raise serializer.ValidationError(serializer.errors)
        
    def delete(self, request, project_id):
        project = Projects.objects.get(id=project_id)

        if project.owner != request.user:
            return Response(
                {"detail": "Only the project owner can remove members."},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        serializer = ProjectMemberSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user_id']

            project.members.remove(user)

            return Response(
                {"detail": "Member removed successfully."},
                status=status.HTTP_200_OK,
            )
        else:
            raise serializer.ValidationError(serializer.errors)
