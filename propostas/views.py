"""

referente a função de retornar URLs e criar proposta(criar_proposta) para ser salva no banco de dados

"""


# import requests
from django.shortcuts import redirect, render
from django.contrib import messages
import hashlib
from .models import Proposta

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

def criar_proposta(request):
    if request.method == 'POST':
        titulo = request.POST.get('titulo')
        valor = request.POST.get('valor')
        arquivo = request.FILES.get('arquivo')

        # Validação básica
        if not titulo or not valor or not arquivo:
            messages.error(request, 'Preencha todos os campos obrigatórios.')
            return redirect('criar_proposta')

        # Verificação de tamanho (máx 5MB)
        if arquivo.size > 5 * 1024 * 1024:
            messages.error(request, 'O arquivo excede o limite de 5MB.')
            return redirect('criar_proposta')

        # Gerar hash SHA256 do arquivo
        hash_sha256 = hashlib.sha256(arquivo.read()).hexdigest()
        arquivo.seek(0)  # Reposiciona ponteiro do arquivo após ler

        # Salvar no banco
        proposta = Proposta(
            titulo=titulo,
            valor=valor,
            arquivo=arquivo
        )
        proposta.save()

        messages.success(request, f'Proposta enviada com sucesso! Hash do arquivo: {hash_sha256}')
        return redirect('listar_propostas')  # redireciona pra view de listagem

def listar_propostas(request):
    propostas = Proposta.objects.all().order_by('-data_criacao')
    return render(request, 'listar_propostas.html', {'propostas': propostas})
# Create your views here.
