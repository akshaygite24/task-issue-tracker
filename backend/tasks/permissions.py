from rest_framework.permissions import BasePermission

class IsTaskEditor(BasePermission):
    """
    Allows update if user is creater or assignee of the task.
    """

    def has_object_permission(self, request, view, object):
        return (
            object.created_by == request.user or
            object.assigned_to == request.user
        )
    

class IsTaskDeletor(BasePermission):
    """
    Allows deletion if user is the creator of task or project owner.
    """

    def has_object_permission(self, request, view, object):
        return (
            object.created_by == request.user or
            object.project.owner == request.user
        )