from django.urls import path
from .views import RegisterView, LoginAPIView, UserSearchView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('search/', UserSearchView.as_view(), name='user-search'),
]
