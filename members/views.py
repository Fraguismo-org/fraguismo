from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from members.forms import RegisterUserForm
from members.models import Profile, Users


def login_user(request):
    if request.method == "POST":
        username = request.POST.get('username', None)
        password = request.POST.get('password', None)
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('user')
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


def user_page(request):
    try:

        profile = Profile.objects.get(user=request.user)
        member = Users.objects.get(user_ptr_id=request.user)
        if request.method == 'POST':
            member.first_name = request.POST.get('first_name', None)
            member.last_name = request.POST.get('last_name', None)
            member.city = request.POST.get('city', None)
            member.fone = request.POST.get('fone', None)
            member.instagram = request.POST.get('instagram', None)
            member.job_title = request.POST.get('job_title', None)
            member.bsc_wallet = request.POST.get('bsc_wallet', None)
            member.lightning_wallet = request.POST.get('lightning_wallet', None)
            member.save()
        return render(
            request, 
            'members/user_page.html', 
            {
                'profile': profile, 
                'member': member
            }
        )
    except Profile.DoesNotExist:
        profile = Profile.objects.create(user=request.user)
        return render(request, 'members/user_page.html', {'profile': profile})
    except TypeError as e:
        return redirect('login')
