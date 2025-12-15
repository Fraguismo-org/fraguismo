from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum
from django.db.models.functions import Coalesce
from members.models.profile import Profile


def get_liberdade_queryset(periodo=None):
    qs = Profile.objects.filter(user__is_fraguista=True)

    # filtro por tempo
    if periodo == "7d":
        qs = qs.filter(user__date_joined__gte=timezone.now() - timedelta(days=7))
    elif periodo == "30d":
        qs = qs.filter(user__date_joined__gte=timezone.now() - timedelta(days=30))

    # soma e normalização da pontuação
    return qs.annotate(
        score=Coalesce(Sum("pontuacao"), 0)
    ).order_by("-score")


def build_ranking_list(queryset):
    ranking = []
    for i, profile in enumerate(queryset, start=1):
        ranking.append({
            "posicao": i,
            "profile": profile,
            "pontuacao": profile.score
        })
    return ranking
