from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test


@user_passes_test(lambda u: u.is_superuser)
def funcao_arbitro(request):
    return render(request, 'funcao_arbitro.html')

@login_required(login_url='login')
def funcao_comprador(request):
    return render(request, 'funcao_comprador.html')

@login_required(login_url='login')
def funcao_vendedor(request):
    return render(request, 'funcao_vendedor.html')

@login_required(login_url='login')
def funcao_disputa(request):
    return render(request, 'funcao_disputa.html')