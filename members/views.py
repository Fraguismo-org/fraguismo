from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.views import (
    PasswordResetView, 
    PasswordResetDoneView, 
    PasswordResetConfirmView, 
    PasswordResetCompleteView
)
from django.urls import reverse_lazy
from members.forms import RegisterUserForm
from members.models import Profile, User

# View para login do usuário
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

# View para logout do usuário
def logout_user(request):
    logout(request)
    messages.success(request, ("Deslogado com sucesso. Volte sempre!"))
    return redirect("index")

# View para registro de usuário
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
            return redirect('index')
        else:
            messages.success(request, ("Erro ao cadastrar usuário!"))
    else:
        form = RegisterUserForm()

    return render(request, 'authenticate/register_user.html', {
        'form': form,
    })

# View para exibir página de perfil do usuário
def user_page(request):
    try:
        profile = Profile.objects.get(user=request.user)
        return render(request, 'authenticate/user_page.html', {'profile': profile})
    except Profile.DoesNotExist:
        profile = Profile.objects.create(user=request.user)
        return render(request, 'authenticate/user_page.html', {'profile': profile})
