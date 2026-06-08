from django.utils.functional import SimpleLazyObject

from members.models.users import Users


def member(request):
    if not request.user.is_authenticated:
        return {}
    return {'member': SimpleLazyObject(
        lambda: Users.get_or_create_member(user_request=request.user)
    )}
