from django.urls import path
from .views import ProjectListCreateView, ProjectMemberApiView, ProjectDetailView

urlpatterns = [
    path('', ProjectListCreateView.as_view(), name='project-list-create'),
    path("<int:pk>/", ProjectDetailView.as_view(), name='project-detail'),
    path("<int:project_id>/members/", ProjectMemberApiView.as_view(), name='project-member-manage'),
]