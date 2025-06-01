from configuracoes.models.configuracao import Configuracao
from configuracoes.models.configuracao_visibilidade import ConfiguracaoVisibilidade
from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required(login_url='login')
def configuracoes(request):
    if request.method == 'GET':
        configuracoes = Configuracao.carrega_configuracoes(request.user)
        return render(request, 'configuracoes.html', {'configuracoes' : configuracoes})
    if request.method == 'POST':
        configuracoes = Configuracao.carrega_configuracoes(request.user)
        return render(request, 'configuracoes.html', {'configuracoes' : configuracoes})

@login_required(login_url='login')
def salva_configuracoes(request):
    if request.method == 'POST':
        configuracoes = Configuracao.carrega_configuracoes(request.user)
        configuracoes.visibilidade