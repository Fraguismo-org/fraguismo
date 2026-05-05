from pyexpat.errors import messages
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import user_passes_test
from django.core.paginator import Paginator, InvalidPage, EmptyPage

from log.models.log import Log
from members.models.profile import Profile
from members.models.profile_pendencia import ProfilePendencia
from members.models.users import Users
from members.query.users_query import UsersQuery
from rating.models.atividade import Atividade
from rating.models.log_rating import LogRating
from rating.models.nivel_choices import NivelChoices
from rating.services.pontos_service import PontosService
from utils.paginator import pagina_lista


@user_passes_test(lambda u: u.is_superuser)
def add_rating_point(request):
    if request.method == 'POST':
        ids = request.POST.getlist('usuarios')
        atividade_id = request.POST.get('select-atividade')
        pontuacao = request.POST.get('pontuacao')        
        result = PontosService.add(ids, atividade_id, pontuacao, request.user.id)
        if result["result"]:
            return redirect('logs')
        messages.error(request, result["message"])

    query = request.GET.get("busca")    
    usuarios_list = UsersQuery.get_users_by_query(query)
    usuarios = pagina_lista(request, usuarios_list, 25)
    
    atividades = Atividade.objects.all()
    return render(
        request,
        'add_rating.html',
        {
            'usuarios': usuarios,
            'atividades': atividades,
        }
    )

    
@user_passes_test(lambda u: u.is_superuser)
def editar_pontuacao(request, user_id: int):
    if request.method == 'GET':
        user = Users.objects.get(id=user_id)
        profile = Profile.get_or_create_profile(user)
        return render(request, 'editar_pontuacao.html', {'profile': profile, 'usuario': user})
    if request.method == 'POST':        
        pontuacao = request.POST.get('pontos', 0)
        user = Users.objects.get(id=user_id)
        profile = Profile.get_or_create_profile(user)
        result = PontosService.editar(profile, pontuacao, request.user.id)
        
        if not result["result"]:
            messages.error(request, result["message"])
        
        return redirect('user_log_rating', username=user.username)        