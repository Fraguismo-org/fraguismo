from django.contrib import messages
from django.shortcuts import  render
from django.contrib.auth.decorators import login_required, user_passes_test

@login_required(login_url='login')
def operacoes_token(request):
    return render(request, 'operacoes_token.html')

@login_required(login_url='login')
def proposer(request):
    
    return render(request, 'proposer.html')

@user_passes_test(lambda u: u.is_superuser)
def config_owner(request):
    return render(request, 'config_owner.html')
