from django.shortcuts import render, redirect
from django.contrib.auth.decorators import user_passes_test, login_required
from django.contrib import messages
from .models.log_rating import LogRating
from .models.atividade import Atividade
from members.models.profile import Profile
from members.models.users import Users, User
from rating.models.nivel import Nivel
from rating.models.pendencia import Pendencia
from members.models.profile_pendencia import ProfilePendencia


@user_passes_test(lambda u: u.is_superuser)
def log_rating(request):
    query = request.GET.get("busca")
    if query:
        opcao = request.GET.get("filter_field")
        match opcao:
            case 'first_name':
                users = User.objects.filter(first_name__istartswith=query).values_list('first_name', flat=True)
                logs = LogRating.objects.filter(user_id__first_name__in=users).order_by("-updated_at")
            case 'username':
                users = User.objects.filter(username__istartswith=query).values_list('username', flat=True)
                logs = LogRating.objects.filter(user_id__username__in=users).order_by("-updated_at")
            case 'email':
                users = User.objects.filter(email__istartswith=query).values_list('email', flat=True)
                logs = LogRating.objects.filter(user_id__email__in=users).order_by("-updated_at")
            case 'fone':
                users = Users.objects.filter(username__istartswith=query).values_list('fone', flat=True)                
                logs = LogRating.objects.filter(user_id__in=users).order_by("-updated_at")
    else:
        logs = LogRating.objects.all().order_by("-updated_at")
    return render(request, 'log_rating.html', {'logs': logs})

@login_required(login_url='login')
def user_log_rating(request):
    data_inicial = request.GET.get("data_inicial")
    data_final = request.GET.get("data_final")
    profile = Profile.get_or_create_profile(request.user)
    nivel = Nivel.objects.get(nivel=profile.nivel.lower())
    if profile.nivel.lower() == "diretor":
        pts_prx_nivel = 0
    else:
        pts_prx_nivel = nivel.proximo_nivel().pontuacao_base - profile.pontuacao
    proximo_nivel = (nivel.proximo_nivel().nivel,  pts_prx_nivel if pts_prx_nivel >= 0 else 0)

    logs = LogRating.objects.filter(user_id=request.user).order_by("-updated_at")

    if data_inicial:
        logs = logs.filter(updated_at__gte=data_inicial)
    if data_final:
        logs = logs.filter(updated_at__lte=data_final)

    return render(
        request,
        'user_log_rating.html', 
        {
            'logs': logs,
            'profile': profile,
            'proximo_nivel': proximo_nivel, 
        }
    )

@login_required(login_url='login')
def user_pending(request):
    profile = Profile.get_or_create_profile(request.user)
    nivel = Nivel.objects.get(nivel=profile.nivel.lower())
    nivel = nivel.proximo_nivel()
    pendencias = Pendencia.objects.filter(nivel=nivel)
    profile_pendencias = ProfilePendencia.objects.filter(profile=profile)
    return render(request, 'pendencias/user_pending.html', {'pendencias': pendencias, 'profile_pendencias': profile_pendencias})


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
    return render(request, 'pendencias/add_pendencia.html', {'niveis': niveis, 'pendencias': pendencias})

@user_passes_test(lambda u: u.is_superuser)
def add_rating_point(request):
    if request.method == 'POST':
        id = request.POST.get('select-user')
        atividade_id = request.POST.get('select-atividade')
        pontuacao = request.POST.get('pontuacao')
                
        profile = Profile.objects.get(user_id=id)
        atividade = Atividade.objects.get(id=atividade_id)  
        
        if pontuacao == None:
            pontuacao = str(atividade.pontuacao)

        if str.isdigit(pontuacao) and pontuacao != '0':            
            LogRating.add_log_rating(profile, int(pontuacao), request.user.id, atividade)
            if len(ProfilePendencia.get_pendencias(profile)) == 0 and profile.is_next_level():
                profile.change_level()
            profile.pontuacao += int(pontuacao)
            profile.save() 
        else:
            messages.warning(request, 'Adicione uma pontuação válida!')
        return redirect('logs')
    users = User.objects.all()
    atividades = Atividade.objects.all()
    return render(
        request,
        'add_rating.html',
        {
            'users': users,
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
        nivel_id = request.POST.get('select_nivel', 1)
        pendencia_nome = request.POST.get('pendencia', '')
        pendencia = Pendencia.objects.get(id=id)
        nivel = Nivel.objects.get(id=nivel_id)
        pendencia.pendencia = pendencia_nome
        pendencia.nivel = nivel
        pendencia.save()
        return redirect('add_pendencia')
