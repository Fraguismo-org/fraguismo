from rating.models.log_rating import LogRating
from services.query_filter_service import QueryFilterService
from services.query_type import QueryType
from django.db.models import Q


class LogRatingQuery:
    @staticmethod
    def get_log_rating_by_query(query, users=None):
        logs = None
        if not query:
            return LogRating.objects.all().order_by("-updated_at")
        query_type = QueryFilterService.query_type(query) if query else None
        match query_type:
            case QueryType.ID:
                logs = LogRating.objects.filter(user_id__id__in=users).order_by("-updated_at")
            case QueryType.EMAIL:
                logs = LogRating.objects.filter(user_id__email__istartswith=users).order_by("-updated_at")
            case QueryType.PHONE:
                logs = LogRating.objects.filter(user_id__fone__istartswith=users).order_by("-updated_at")
            case QueryType.INSTAGRAM:
                logs = LogRating.objects.filter(user_id__instagram__istartswith=users).order_by("-updated_at")
            case QueryType.USERNAME:
                logs = LogRating.objects.filter(
                    Q(user_id__username__istartswith=users) | 
                    Q(user_id__first_name__istartswith=users) | 
                    Q(user_id___last_name__istartswith=users)
                ).order_by("-updated_at")
                
            case _:
                logs = LogRating.objects.all().order_by("-updated_at")
        return logs