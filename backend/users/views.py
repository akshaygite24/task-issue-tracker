from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status


class RegisterView(APIView):
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