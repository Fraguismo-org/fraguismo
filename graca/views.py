from django.shortcuts import render
from django.contrib.auth.decorators import user_passes_test, login_required

@login_required(login_url='login')
def consultas(request):
    return render(request, 'consultas.html')

@login_required(login_url='login')
def sacar_pol(request):
    return render(request, 'sacar_tokens.html')

@login_required(login_url='login')
def votacao(request):
    return render(request, 'votacao.html')

@login_required(login_url='login')
def tranca_distribuicao(request):
    return render(request, 'tranca_distribuicao.html')

@user_passes_test(lambda u: u.is_superuser)
def graca_admin(request):
    return render(request, 'graca_admin.html')