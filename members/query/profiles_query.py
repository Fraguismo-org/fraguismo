from django.db.models import Q
from members.models.profile import Profile
from services.query_filter_service import QueryFilterService
from services.query_type import QueryType


class ProfilesQuery:
    @staticmethod
    def get_profiles_by_query(query):
        profiles = None
        if not query:
            return Profile.objects.all()
        query_type = QueryFilterService.query_type(query) if query else None
        match query_type:
            case QueryType.ID:
                profiles = Profile.objects.filter(user__id=query)
            case QueryType.EMAIL:
                profiles = Profile.objects.filter(user__email__istartswith=query)
            case QueryType.PHONE:
                profiles = Profile.objects.filter(user__fone__istartswith=query)
            case QueryType.INSTAGRAM:
                profiles = Profile.objects.filter(user__instagram__istartswith=query)
            case QueryType.USERNAME:
                profiles = Profile.objects.filter(
                    Q(user__username__istartswith=query) | 
                    Q(user__first_name__istartswith=query) | 
                    Q(user__last_name__istartswith=query)
                )                
                
            case _:
                profiles = Profile.objects.all()
        return profiles   