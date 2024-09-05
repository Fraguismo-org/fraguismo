import os
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from members.forms import RegisterUserForm
from members.models.profile import Profile
from members.models.users import Users
from django.contrib.auth.decorators import login_required
from PIL import Image, ImageOps


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
        form = RegisterUserForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            user = authenticate(username=username, password=password)
            login(request, user)
            messages.success(request, ("Conta criada com sucesso!"))
            return redirect('https://fraguismo.org')
        else:
            messages.success(request, ("Erro ao cadastrar usuário!"))
    else:
        form = RegisterUserForm()

    return render(request, 'authenticate/register_user.html', {
        'form': form,
    })

@login_required
def user_page(request):
    profile = Profile.objects.get(user=request.user)
    try:
        member = Users.objects.get(user_ptr_id=request.user)
    except:
        member = Users()
    if request.method == 'POST':       
        member.clone(request.user)
        member.first_name = request.POST.get('first_name', None)
        member.last_name = request.POST.get('last_name', None)
        member.email = request.POST.get('email', None)
        member.birth = request.POST.get('birth', None)
        member.city = request.POST.get('city', None)
        member.fone = request.POST.get('fone', None)
        member.instagram = request.POST.get('instagram', None)
        member.job_title = request.POST.get('job_title', None)
        member.bsc_wallet = request.POST.get('bsc_wallet', None)
        member.lightning_wallet = request.POST.get('lightning_wallet', None)
        
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