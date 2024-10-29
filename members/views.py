import os
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from members.models.profile import Profile
from members.models.users import Users
from members.models.profile_pendencia import ProfilePendencia
from rating.models.log_rating import LogRating
from django.contrib.auth.decorators import login_required
from PIL import Image, ImageOps
from datetime import date


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

        user.save()
        profile = Profile.get_or_create_profile(user_request=user)
        profile.save()
        if user.quem_indicou:
            indicacao(request, user)
        auth_user = authenticate(request, username=user.username, password=password)
        login(request, auth_user)
        messages.success(request, ("Conta criada com sucesso!"))       
        return redirect('https://fraguismo.org')        
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

@login_required(login_url='login')
def comunidade(request):
    return render(request, 'members/comunidade.html')


@login_required(login_url='login')
def user_page(request): 
    profile = Profile.get_or_create_profile(user_request=request.user)
    member = Users.get_or_create_member(user_request=request.user)
    if request.method == 'POST':
        member.email = request.POST.get('email', None)
        member.is_fraguista = request.POST.get('fraguista', None) == 'on'
        if (member.is_fraguista):
            member.first_name = request.POST.get('first_name', None)
            member.last_name = request.POST.get('last_name', None)        
            member.birth = request.POST.get('birth', None)
            member.city = request.POST.get('city', None)
            member.fone = request.POST.get('fone', None)
            member.instagram = request.POST.get('instagram', None)
            member.job_title = request.POST.get('job_title', None)
            member.bsc_wallet = request.POST.get('bsc_wallet', None)
            member.lightning_wallet = request.POST.get('lightning_wallet', None)
            member.codigo_conduta = request.POST.get('codigo_conduta', None) == 'on'
        
        if 'pic_profile' in request.FILES:
            old_img = profile.pic_profile.path
            if os.path.isfile(old_img):
                os.remove(old_img)
            profile.pic_profile = request.FILES['pic_profile']
        
        member.save()
        profile.save()
        
        if profile.pic_profile.path.find('default.jpg') == -1:
            img = Image.open(profile.pic_profile.path)
            img = ImageOps.exif_transpose(img)
            rate = img.height/300 if img.height > img.width else img.width/300
            if img.height > 300 or img.width > 300:
                output_size = (img.width/rate, img.height/rate)
                img.thumbnail(output_size)
                img.save(profile.pic_profile.path)
    
        return redirect('user_page')
    else:
        return render(
            request,
            'members/user_page.html',
            {
                'profile': profile,
                'member': member
            }
        )


def profile(request, username: str):
    member = Users.objects.get(user_ptr_id__username=username)
    profile = Profile.objects.get(user_id__username=username)
    if request.method == 'GET':
        if member.birth is None:
            idade = 'Não informado'
        else:
            idade  = date.today().year - member.birth.year
        return render(request, 'members/profile.html', {'member': member, 'profile': profile, 'idade': idade})
    else:
        return redirect('user_page')