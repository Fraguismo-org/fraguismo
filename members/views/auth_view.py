from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect

from members.models.profile import Profile
from members.models.profile_pendencia import ProfilePendencia
from members.models.users import Users
from rating.models.log_rating import LogRating


def login_user(request):
    if request.method == "POST":
        username = request.POST.get('username', None)
        password = request.POST.get('password', None)
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('user_page')
        else:
            messages.success(request, ("E-mail ou senha não encontrado!"))
            return redirect('login')
    return render(request, 'authenticate/login.html', {})

def logout_user(request):
    logout(request)
    messages.success(request, ("Deslogado com sucesso. Volte sempre!"))
    return redirect('login')


def register_user(request):
    if request.method == "POST":
        user  = Users()
        user.is_fraguista = request.POST.get('fraguista', None) == 'on'
        user.codigo_conduta = request.POST.get('codigo_conduta', None) == 'on'
        user.username = request.POST.get('username', None)
        user.email = request.POST.get('email', None)
        if Users.objects.filter(username=user.username).exists():
            messages.warning(request, f'Usuário {user.username} já está em uso!')
            return render(request, 'authenticate/register_user.html')
        if Users.objects.filter(email=user.email).exists():
            messages.error(request, f'E-mail {user.email} já está em uso!')
            return render(request, 'authenticate/register_user.html')
        password = request.POST.get('password', None)
        password2 = request.POST.get('password2', None)
        if password == password2:
            user.set_password(password)
        else:
            messages.error(request, 'Os campos de senha devem coincidir.')
            return render(request, 'authenticate/register_user.html')
        if user.is_fraguista:
            user.first_name = request.POST.get('first_name', None)
            user.last_name = request.POST.get('last_name', None)
            user.city = request.POST.get('city', None)
            user.fone = request.POST.get('fone', None)
            user.instagram = request.POST.get('instagram', None)
            user.birth = request.POST.get('birth', None)
            user.job_title = request.POST.get('job_title', None)
            user.lightning_wallet = request.POST.get('lightning_wallet', None)
            user.bsc_wallet = request.POST.get('bsc_wallet', None)
            user.como_conheceu = request.POST.get('como_conheceu', None)
            user.quem_indicou = request.POST.get('quem_indicou', None)
            user.aonde = request.POST.get('aonde', None)
            user.codigo_conduta = request.POST.get('termos_adesao', True)

        user.save()
        profile = Profile.get_or_create_profile(user_request=user)
        profile.save()
        if user.quem_indicou:
            indicacao(request, user)
        auth_user = authenticate(request, username=user.username, password=password)
        login(request, auth_user)
        messages.success(request, ("Conta criada com sucesso!"))       
        return redirect('user_page')
    return render(request, 'authenticate/register_user.html')

def indicacao(request, user):
    try:
        referrer_profile = Profile.objects.get(user__username=user.quem_indicou)
        LogRating.add_log_rating(referrer_profile, 2, user.id)        
        if len(ProfilePendencia.get_pendencias(referrer_profile)) == 0 and referrer_profile.is_next_level():
            referrer_profile.change_level()
        referrer_profile.pontuacao += 2
        referrer_profile.save()
        messages.success(request, f"{user.quem_indicou} ganhou 2 pontos por te indicar!")
    except Profile.DoesNotExist:
        messages.warning(request, f"Usuário que gerou o link ({user.quem_indicou}) não encontrado.")