from django.contrib import messages
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import user_passes_test, login_required

from log.models.log import Log
from members.models.profile import Profile
from members.models.profile_pendencia import ProfilePendencia
from members.models.users import Users
from members.query.profiles_query import ProfilesQuery
from members.query.users_query import UsersQuery
from rating.models.atividade import Atividade
from rating.models.log_rating import LogRating
from rating.models.nivel import Nivel
from rating.models.nivel_choices import NivelChoices
from rating.query.log_rating_query import LogRatingQuery
from utils.paginator import pagina_lista


@user_passes_test(lambda u: u.is_superuser)
def log_rating(request):
    query = request.GET.get("busca")
    if query:
        usuarios_list = UsersQuery.get_users_by_query(query)
        logs = LogRatingQuery.get_log_rating_by_query(query, usuarios_list)
    else:
        logs = LogRating.objects.all().order_by("-updated_at")
    logs = pagina_lista(request, logs, 25)
    
    return render(request, 'log_rating.html', {'logs': logs})


@login_required(login_url='login')
def user_log_rating(request, username=None):
    data_inicial = request.GET.get("data_inicial")
    data_final = request.GET.get("data_final")
    usuario = Users.objects.get(username=username) if username else request.user
    profile = Profile.get_or_create_profile(usuario)
    if profile.nivel.lower() == '':
        nivel = Nivel.objects.get(nivel=NivelChoices.APPRENTICE)
    else:
        nivel = Nivel.objects.get(nivel=profile.nivel.lower())
    pts_prx_nivel = 0
    if profile.nivel.lower() != NivelChoices.GUARDIAN:    
        pts_prx_nivel = nivel.proximo_nivel().pontuacao_base - profile.pontuacao
    proximo_nivel = (nivel.proximo_nivel().nivel,  pts_prx_nivel if pts_prx_nivel >= 0 else 0)

    logs = LogRating.objects.filter(user_id=usuario).order_by("-updated_at")

    if data_inicial:
        logs = logs.filter(updated_at__gte=data_inicial)
    if data_final:
        logs = logs.filter(updated_at__lte=data_final)
        
    logs = pagina_lista(request, logs, 25)

    return render(
        request,
        'user_log_rating.html', 
        {
            'logs': logs,
            'profile': profile,
            'proximo_nivel': proximo_nivel,
            'usuario': usuario,
        }
    )

@user_passes_test(lambda u: u.is_superuser)
def add_rating_point(request):
    if request.method == 'POST':
        try: 
            ids = request.POST.getlist('usuarios[]')
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
        except Exception as e:
            Log.salva_log(e)
            messages.warning(request, 'Erro ao adicionar pontuação.')
            
        return redirect('logs')
    query = request.GET.get("busca")
    profiles_list = ProfilesQuery.get_profiles_by_query(query)
    profiles = pagina_lista(request, profiles_list, 25)
    
    atividades = Atividade.objects.all()
    return render(
        request,
        'add_rating.html',
        {
            'profiles': profiles,
            'atividades': atividades,
        }
    )
