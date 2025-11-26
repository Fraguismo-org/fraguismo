from datetime import timedelta

from django.contrib.auth.decorators import login_required
from django.db.models import Q, Sum
from django.db.models.functions import Coalesce
from django.shortcuts import render
from django.utils import timezone

from members.models.profile import Profile
from services.query_filter_service import QueryFilterService
from services.query_type import QueryType


def _build_ranking_list(queryset, score_field):
    ranking = []
    for index, profile in enumerate(queryset, start=1):
        score = getattr(profile, score_field) or 0
        ranking.append(
            {
                "position": index,
                "profile": profile,
                "score": score,
            }
        )
    return ranking


def _filter_ranking(ranking, query):
    if not query:
        return ranking

    query = query.strip().lower()
    query_type = QueryFilterService.query_type(query)

    def matches(entry):
        user = entry["profile"].user
        username = (user.username or "").lower()
        email = (user.email or "").lower()
        full_name = f"{(user.first_name or '').strip()} {(user.last_name or '').strip()}".strip().lower()

        match query_type:
            case QueryType.EMAIL:
                return email.startswith(query)
            case QueryType.ID:
                return str(user.id) == query
            case _:
                return (
                    query in username
                    or query in email
                    or (full_name and query in full_name)
                )

    return [entry for entry in ranking if matches(entry)]


@login_required(login_url="login")
def ranking_liberdade(request):
    busca = request.GET.get("busca", "").strip()
    aba = request.GET.get("aba", "geral")

    def ranking_for_display(ranking):
        return ranking if busca else ranking[:50]

    now = timezone.localtime(timezone.now())
    inicio_semana = now - timedelta(days=7)
    inicio_mes = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    base_profiles = (
        Profile.objects.select_related("user")
        .filter(user__is_fraguista=True)
        .order_by("-pontuacao", "user__username")
    )

    ranking_geral = _build_ranking_list(base_profiles, "pontuacao")

    mensal_qs = base_profiles.annotate(
        pontos_mes=Coalesce(
            Sum(
                "user__lograting__pontuacao_ganha",
                filter=Q(user__lograting__updated_at__gte=inicio_mes),
            ),
            0,
        )
    ).order_by("-pontos_mes", "user__username")
    ranking_mensal = _build_ranking_list(mensal_qs, "pontos_mes")

    semanal_qs = base_profiles.annotate(
        pontos_semana=Coalesce(
            Sum(
                "user__lograting__pontuacao_ganha",
                filter=Q(user__lograting__updated_at__gte=inicio_semana),
            ),
            0,
        )
    ).order_by("-pontos_semana", "user__username")
    ranking_semanal = _build_ranking_list(semanal_qs, "pontos_semana")

    context = {
        "aba": aba,
        "busca": busca,
        "ranking_geral": ranking_for_display(_filter_ranking(ranking_geral, busca)),
        "ranking_mensal": ranking_for_display(_filter_ranking(ranking_mensal, busca)),
        "ranking_semanal": ranking_for_display(_filter_ranking(ranking_semanal, busca)),
        "inicio_semana": inicio_semana,
        "inicio_mes": inicio_mes,
    }

    return render(request, "ranking_liberdade.html", context)
