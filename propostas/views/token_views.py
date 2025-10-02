from django.contrib import messages
from django.shortcuts import  render
from django.contrib.auth.decorators import login_required, user_passes_test
from administrador.models.fraga_token_valor import ValorToken
from propostas.models import Proposta

@login_required(login_url='login')
def operacoes_token(request):
    return render(request, 'operacoes_token.html')

@login_required(login_url='login')
def proposer(request):
    quantidade_token = 0
    valor_token_brl = 0
    hash = ''
    if request.method == 'POST':
        try:
            hash = request.POST.get('proposeHash')
            proposta = Proposta.objects.filter(hash_arquivo=hash).first()
            if not proposta:
                Exception('Proposta não encontrada')
            valor_token = ValorToken.objects.last()
            if not valor_token or valor_token.valor_brl <= 0:
                valor_token = ValorToken.objects.create(valor_brl=15)
            valor_token_brl = valor_token.valor_brl
            quantidade_token = int(proposta.valor / valor_token_brl)
                        
        except Exception as e:
            messages.error(request, f'Erro ao buscar proposta: {hash}.')    
    return render(request, 'proposer.html', {
        'valor_total_brl': quantidade_token * valor_token_brl,
        'quantidade_token': quantidade_token,
        'hash': hash,})

@user_passes_test(lambda u: u.is_superuser)
def config_owner(request):
    return render(request, 'config_owner.html')
