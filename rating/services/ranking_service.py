from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum, F, OuterRef, Subquery, IntegerField
from django.db.models.functions import Coalesce
from members.models.profile import Profile
from rating.models.log_rating import LogRating


def get_liberdade_queryset(periodo=None):
    qs = Profile.objects.filter(user__is_fraguista=True)

    now = timezone.now()
    start, end = _get_period_bounds(periodo, now)

    lograting_qs = LogRating.objects.filter(
        user_id=OuterRef("user__user_ptr_id")
    )

    if start:
        lograting_qs = lograting_qs.filter(updated_at__gte=start)
    if end:
        lograting_qs = lograting_qs.filter(updated_at__lt=end)

    lograting_qs = (
        lograting_qs
        .values("user_id")
        .annotate(total=Sum("pontuacao_ganha"))
        .values("total")[:1]
    )

    score_subquery = Subquery(lograting_qs, output_field=IntegerField())

    coalesce_args = (
        [score_subquery, F("pontuacao"), 0]
        if not (start or end)
        else [score_subquery, 0]
    )

    return (
        qs
        .annotate(score=Coalesce(*coalesce_args))
        .order_by("-score")
    )


def build_ranking_list(queryset):
    ranking = []
    for i, profile in enumerate(queryset, start=1):
        ranking.append({
            "position": i,
            "profile": profile,
            "score": profile.score
        })
    return ranking


def _get_period_bounds(periodo, now):
    if periodo == "7d":
        week_start = now - timedelta(days=now.weekday())
        week_start = week_start.replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        week_end = week_start + timedelta(days=7)
        return week_start, week_end

    if periodo == "30d":
        month_start = now.replace(
            day=1, hour=0, minute=0, second=0, microsecond=0
        )
        if month_start.month == 12:
            next_month_start = month_start.replace(
                year=month_start.year + 1, month=1
            )
        else:
            next_month_start = month_start.replace(
                month=month_start.month + 1
            )
        return month_start, next_month_start

    return None, None
