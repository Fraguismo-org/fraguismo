from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test


@user_passes_test(lambda u: u.is_superuser)
def funcao_arbitro(request, ordem_id: int=None):
    return render(request, 'funcao_arbitro.html', {"ordem_id": ordem_id})

@login_required(login_url='login')
def funcao_comprador(request):
    return render(request, 'funcao_comprador.html')

@login_required(login_url='login')
def funcao_vendedor(request):
    return render(request, 'funcao_vendedor.html')

@login_required(login_url='login')
def funcao_disputa(request, ordem_id: int=None):
    return render(request, 
                  'funcao_disputa.html', 
                  {"ordem_id": ordem_id})
    

@login_required(login_url='login')
def comprar_token(request):
    return render(request, 'comprar_token.html')