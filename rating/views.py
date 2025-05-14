from django.shortcuts import render, redirect
from django.contrib.auth.decorators import user_passes_test, login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.core.paginator import Paginator, InvalidPage, EmptyPage

from members.query.users_query import UsersQuery
from rating.query.log_rating_query import LogRatingQuery
from .models.log_rating import LogRating
from .models.atividade import Atividade
from members.models.profile import Profile
from members.models.users import Users, User
from rating.models.nivel import Nivel
from rating.models.nivel_choices import NivelChoices
from rating.models.pendencia import Pendencia
from members.models.profile_pendencia import ProfilePendencia
from django.core.paginator import Paginator, InvalidPage, EmptyPage


@user_passes_test(lambda u: u.is_superuser)
def log_rating(request):
    query = request.GET.get("busca")
    if query:
        usuarios_list = UsersQuery.get_users_by_query(query)
        logs = LogRatingQuery.get_log_rating_by_query(query, usuarios_list)
    else:
        logs = LogRating.objects.all().order_by("-updated_at")
    paginas = Paginator(logs, 25)
    try:
        page = int(request.GET.get('page', '1'))
    except ValueError:
        page = 1
    try:
        logs = paginas.page(page)
    except (EmptyPage, InvalidPage):
        logs = paginas.page(paginas.num_pages)
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
        
    paginas = Paginator(logs, 25)
    try:
        page = int(request.GET.get('page', '1'))
    except ValueError:
        page = 1
    try:
        logs = paginas.page(page)
    except (EmptyPage, InvalidPage):
        logs = paginas.page(paginas.num_pages)

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

@csrf_exempt
@login_required(login_url='login')
def my_pendings(request):
    if request.method == 'POST':
        p_pendencia_id = request.POST.get('profile_pendencia_id')
        p_pendencia = ProfilePendencia.objects.get(id=p_pendencia_id)
        p_pendencia.pendencia_status = 1
        p_pendencia.save()
    profile = Profile.get_or_create_profile(request.user)
    if profile.nivel.lower() == '':
        nivel = Nivel.objects.get(nivel=NivelChoices.APPRENTICE)
    else:
        nivel = Nivel.objects.get(nivel=profile.nivel.lower())
    nivel = nivel.proximo_nivel()
    pendencias = Pendencia.objects.filter(nivel=nivel)
    profile_pendencias = ProfilePendencia.objects.filter(profile=profile).filter(nivel=nivel)
    if len(profile_pendencias) < len(pendencias):
        ProfilePendencia.add_pendencias(profile, pendencias)
        profile_pendencias = ProfilePendencia.objects.filter(profile=profile).filter(nivel=nivel)    
    return render(
        request, 
        'pendencias/my_pendings.html', 
        {
            'pendencias': pendencias, 
            'profile_pendencias': profile_pendencias
        }
    )
    
@login_required(login_url='login')
def user_pending(request, username):
    user = Users.objects.get(username=username)
    profile = Profile.get_or_create_profile(user)        
    profile_pendencias = ProfilePendencia.get_pendencias(profile)
    
    return render(
        request,
        'pendencias/user_pending.html', 
        {            
            'profile_pendencias': profile_pendencias,
            'usuario': user,
            'profile': profile,
        }
    )


@user_passes_test(lambda u: u.is_superuser)
def add_pendencia(request):
    if request.method == "POST":
        nivel = Nivel.objects.get(nivel=request.POST.get('select-nivel', None))
        pendencia = Pendencia()
        pendencia.nivel = nivel
        pendencia.pendencia = request.POST.get('pendencia', None)
        pendencia.save()
    pendencias = Pendencia.objects.all()
    niveis = Nivel.objects.all()
    return render(
        request, 
        'pendencias/add_pendencia.html', 
        {
            'niveis': niveis, 
            'pendencias': pendencias
        }
    )


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
def register_activity(request):
    if request.method == 'POST':
        activity = Atividade()
        activity.nome_atividade = request.POST.get('atividade', None)
        activity.pontuacao = int(request.POST.get('pontuacao', None))
        activity.updated_by = request.user
        activity.save()
        redirect('register_activity')

    return render(request, 'register_activity.html')


@user_passes_test(lambda u: u.is_superuser)
def remove_pendencia(request, id: int):
    if request.method == 'GET':
        pendencia = Pendencia.objects.get(id=id)
        return render(request, 'pendencias/remove_pendencia.html', {'pendencia': pendencia})
    if request.method == 'POST':
        pendencia = Pendencia.objects.get(id=id)
        pendencia.delete()
        return redirect('add_pendencia')


@user_passes_test(lambda u: u.is_superuser)
def edita_pendencia(request, id: int):
    if request.method == 'GET':
        niveis = Nivel.objects.all()
        pendencia = Pendencia.objects.get(id=id)
        return render(request, 'pendencias/edita_pendencia.html', {
            'niveis': niveis,
            'pendencia': pendencia,
        })
    if request.method == 'POST':
        nivel_id = request.POST.get('select-nivel', '1')
        pendencia_nome = request.POST.get('pendencia', '')
        pendencia = Pendencia.objects.get(id=id)
        nivel = Nivel.objects.get(id=nivel_id)
        pendencia.pendencia = pendencia_nome
        pendencia.nivel = nivel
        pendencia.save()
        return redirect('add_pendencia')
    
    
@user_passes_test(lambda u: u.is_superuser)
def add_pendencia_usuario(request, id: int):
    if request.method == 'GET':
        pendencias = Pendencia.objects.all()
        usuario = Users.objects.get(id=id)
        return render(request, 'pendencias/usuarios/add_pendencia_usuario.html', {
            'pendencias': pendencias,
            'usuario': usuario,
        })
    if request.method == 'POST':
        usuario = request.POST.get('usuario', None)
        pendencia_id = request.POST.get('select-pendencia', None)
        usuario = Users.objects.get(username=usuario)
        pendencia = Pendencia.objects.get(id=pendencia_id)
        profile = Profile.get_or_create_profile(usuario)
        ProfilePendencia.add_pendencias(profile, [pendencia])
        return redirect('user_pending', username=usuario.username)
    

@user_passes_test(lambda u: u.is_superuser)
def finaliza_pendencia_usuario(request, profile_pendencia_id: int):
    if request.method == 'POST':
        profile_pendencia = ProfilePendencia.objects.get(id=profile_pendencia_id)
        ProfilePendencia.update_pendencia_status(2, profile_pendencia)
        return redirect('user_pending', username=profile_pendencia.profile.user.username)
    
    
@user_passes_test(lambda u: u.is_superuser)
def remove_pendencia_usuario(request, profile_pendencia_id: int):
    if request.method == 'POST':
        profile_pendencia = ProfilePendencia.objects.get(id=profile_pendencia_id)
        profile_pendencia.delete()
        messages.success(request, 'Pendência removida com sucesso!')
        return redirect('user_pending', username=profile_pendencia.profile.user.username)
    
    
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
        LogRating.add_log_rating(profile, int(pontuacao), user.id)
        if profile.nivel.lower() != NivelChoices.GUARDIAN and len(ProfilePendencia.get_pendencias(profile)) == 0 and profile.is_next_level():                
            profile.change_level()
        profile.pontuacao += int(pontuacao)
        profile.save()
        return redirect('user_log_rating', username=user.username)