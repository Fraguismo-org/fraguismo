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


@user_passes_test(lambda u: u.is_superuser)
def add_rating_point(request):
    if request.method == 'POST':
        ids = request.POST.getlist('usuarios')
        atividade_id = request.POST.get('select-atividade')
        pontuacao = request.POST.get('pontuacao')
        
        if pontuacao == None:
            atividade = Atividade.objects.get(id=atividade_id)
            pontuacao = str(atividade.pontuacao)
        
        if not str.isdigit(pontuacao) and pontuacao == '0':
            messages.warning(request, 'Adicione uma pontuação válida!')
            
        for id in ids:     
            profile = Profile.objects.get(user_id=id)                               
            LogRating.add_log_rating(profile, int(pontuacao), request.user.id, atividade)
            if profile.nivel.lower() != NivelChoices.GUARDIAN and len(ProfilePendencia.get_pendencias(profile)) == 0 and profile.is_next_level():                
                profile.change_level()
            profile.pontuacao += int(pontuacao)
            profile.save()
            
        return redirect('logs')
    query = request.GET.get("busca")    
    usuarios_list = UsersQuery.get_users_by_query(query)
    paginas = Paginator(usuarios_list, 25)
    try:
        page = int(request.GET.get('page', '1'))
    except ValueError:
        page = 1
    try:
        usuarios = paginas.page(page)
    except (EmptyPage, InvalidPage):
        usuarios = paginas.page(paginas.num_pages)
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
        try:
            pontuacao = request.POST.get('pontos', 0)
            user = Users.objects.get(id=user_id)
            profile = Profile.get_or_create_profile(user)
            LogRating.add_log_rating(profile, int(pontuacao), user.id)
            if profile.nivel.lower() != NivelChoices.GUARDIAN and len(ProfilePendencia.get_pendencias(profile)) == 0 and profile.is_next_level():                
                profile.change_level()
            profile.pontuacao += int(pontuacao)
            profile.save()
            return redirect('user_log_rating', username=user.username)
        except Exception as e:
            Log.salva_log(e)