from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated


class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializers = RegisterSerializer(data=request.data)

        if serializers.is_valid():
            user = serializers.save()

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "user":{
                        "id": user.id,
                        "username": user.username,
                    }, 
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_201_CREATED,
                )
        
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
            )
    
class UserSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '').strip()

        if not query or len(query) < 2:
            return Response([], status=status.HTTP_200_OK)
        
        users = User.objects.filter(
            username__icontains=query
        ).values('id', 'username')[:10]

        return Response(list(users), status=status.HTTP_200_OK)
