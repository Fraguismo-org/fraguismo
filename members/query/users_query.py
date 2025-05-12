from django.db.models import Q
from members.models.users import Users
from services.query_filter_service import QueryFilterService
from services.query_type import QueryType


class UsersQuery:
    @staticmethod
    def get_users_by_query(query):
        usuarios = None
        if not query:
            return Users.objects.all()
        query_type = QueryFilterService.query_type(query) if query else None
        match query_type:
            case QueryType.ID:
                usuarios = Users.objects.filter(id=query)
            case QueryType.EMAIL:
                usuarios = Users.objects.filter(email__istartswith=query)
            case QueryType.PHONE:
                usuarios = Users.objects.filter(fone__istartswith=query)
            case QueryType.INSTAGRAM:
                usuarios = Users.objects.filter(instagram__istartswith=query)
            case QueryType.USERNAME:
                usuarios = Users.objects.filter(
                    Q(username__istartswith=query) | 
                    Q(first_name__istartswith=query) | 
                    Q(last_name__istartswith=query)
                )                
                
            case _:
                usuarios = Users.objects.all()
        return usuarios