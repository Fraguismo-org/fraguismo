"""

referente a função de retornar URLs e criar proposta(criar_proposta) para ser salva no banco de dados

"""


# import requests
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib import messages
import hashlib
from .models import Proposta
from propostas.utils import can_create_proposal


def propostas(request):
    return render(request, 'propostas.html')

"""
def enviar_proposta(request):
    if request.method == 'POST':
        titulo = request.POST.get('titulo')
        valor = request.POST.get('valor')
        arquivo = request.FILES.get('arquivo')

        url_api = 'https://guepardprotocol.com/fraguismovotos/public/submit_proposal.php'

        files = {
            'proposal_file': (arquivo.name, arquivo.read(), arquivo.content_type)
        }

        data = {
            'title': titulo,
            'amount': valor
        }

        try:
            response = requests.post(url_api, data=data, files=files) # tentando envia dado
            if response.status_code == 200:
                messages.success(request, 'Proposta enviada com sucesso!')
            else:
                messages.error(request, 'Erro ao enviar proposta: código {}'.format(response.status_code))
        except Exception as e:
            messages.error(request, f'Erro ao conectar com a API: {str(e)}')

        return redirect('enviar_proposta')

    return render(request, 'propostas.html')
"""

def create_proposal(request):
    if not can_create_proposal(request.user):
        messages.error(request, 'Você não tem permissão para criar propostas.')
        return redirect('show_proposal')
    
    if request.method == 'POST':
        title = request.POST.get('titulo')
        value = request.POST.get('valor')
        file = request.FILES.get('arquivo')

        # Validação básica
        if not title or not value or not file:
            messages.error(request, 'Preencha todos os campos obrigatórios.')
            return redirect('create_proposal')

        # Verificação de tamanho (máx 5MB)
        if file.size > 5 * 1024 * 1024:
            messages.error(request, 'O arquivo excede o limite de 5MB.')
            return redirect('create_proposal')

        # Gerar hash SHA256 do arquivo
        hash_sha256 = hashlib.sha256(file.read()).hexdigest()
        file.seek(0)  # Reposiciona ponteiro do arquivo após ler

        # Salvar no banco
        proposal = Proposta(
            titulo=title,
            valor=value,
            arquivo=file,
            hash_arquivo=hash_sha256
        )
        proposal.save()

        messages.success(request, f'Proposta enviada com sucesso! Hash do arquivo: {hash_sha256}')
        return redirect('show_proposal')  # redireciona pra view de listagem

def show_proposal(request):
    proposal = Proposta.objects.all().order_by('-data_criacao')
    return render(request, 'listar_propostas.html', {'propostas': proposal})

def details_proposal(request, proposta_id):
    proposta = get_object_or_404(Proposta, id=proposta_id)

    conteudo_txt = None
    if proposta.arquivo.name.endswith('.txt'):
        with proposta.arquivo.open('r') as f:
            conteudo_txt = f.read()

    return render(request, 'details_propostas.html', {
        'proposta': proposta,
        'conteudo_txt': conteudo_txt,
    })
# Create your views here.
