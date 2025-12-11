from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from rating.services.ranking_service import get_liberdade_queryset, build_ranking_list
from rating.services.ranking_filter_service import filter_ranking


@login_required(login_url='login')
def ranking_liberdade(request):
    periodo = request.GET.get("periodo")   # 7d, 30d
    busca = request.GET.get("q")

    queryset = get_liberdade_queryset(periodo)
    ranking = build_ranking_list(queryset)
    ranking = filter_ranking(ranking, busca)

    return render(request, 'ranking_liberdade.html', {
        "ranking": ranking,
        "busca": busca,
        "periodo": periodo
    })
