import hashlib
from members.models.profile import Profile
from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render

from propostas.models import Proposta, Voto
from propostas.utils import can_create_proposal, can_create_proposal, can_vote_proposal


def propostas(request):
    return render(request, 'propostas.html')

def create_proposal(request):
    if not can_create_proposal(request.user):
        messages.error(request, 'Você não tem permissão para criar propostas.')
        return redirect('show_proposal')
    
    if request.method == 'POST':
        title = request.POST.get('titulo')
        value = request.POST.get('valor')
        file = request.FILES.get('arquivo')
        user = request.user
        value = str.replace(value, '.', '').replace(',', '.')

        # Validação básica
        if not title or not value or not file:
            messages.error(request, 'Preencha todos os campos obrigatórios.')
            return redirect('create_proposal')

        if file.content_type not in ['text/plain', 'application/pdf', 'application/msword',
                             'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                             'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                             'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']:
            messages.error(request, 'Formato de arquivo inválido. Use txt, pdf, doc, docx, xls, xlsx, ppt ou pptx.')
            return redirect('create_proposal')

        # Verificação de tamanho (máx 5MB)
        if file.size > 5 * 1024 * 1024:
            messages.error(request, 'O arquivo excede o limite de 5MB.')
            return redirect('create_proposal')

        # Gerar hash SHA256 do arquivo
        hash_sha256 = hashlib.sha256(file.read()).hexdigest()
        file.seek(0) 

        # Salvar no banco
        proposal = Proposta(
            user=user,
            titulo=title,
            valor=value,
            arquivo=file,
            hash_arquivo=hash_sha256
        )
        proposal.save()

        messages.success(request, f'Proposta enviada com sucesso! Hash do arquivo: {hash_sha256}')
        return redirect('show_proposal')

def show_proposal(request):
    proposal = Proposta.objects.all().order_by('-data_criacao')
    return render(request, 'listar_propostas.html', {'propostas': proposal})

def details_proposal(request, proposta_id):
    proposta = get_object_or_404(Proposta, id=proposta_id)
    pode_votar = can_vote_proposal(request.user, proposta)
    votos_favor = Voto.objects.filter(proposta=proposta, votos=True).count()
    votos_contra = Voto.objects.filter(proposta=proposta, votos=False).count()
    votos = Voto.objects.filter(proposta=proposta).select_related('usuario')

    conteudo_txt = None
    if proposta.arquivo.name.endswith('.txt'):
        with proposta.arquivo.open('r') as f:
            conteudo_txt = f.read()

    return render(request, 'details_propostas.html', {
        'proposta': proposta,
        'conteudo_txt': conteudo_txt,
        'pode_votar': pode_votar,
        'votos_favor': votos_favor,
        'votos_contra': votos_contra,
        'votos': votos,
    })

def vote_proposal(request, proposta_id):
    proposta = get_object_or_404(Proposta, id=proposta_id)
    voto_existente = Voto.objects.filter(proposta=proposta, usuario=request.user).first()

    if not request.user.is_authenticated:
        messages.error(request, "Você precisa estar logado para votar.")
        return redirect('login')

    if voto_existente:
        messages.error(request, "Você já votou nesta proposta e não pode trocar seu voto.")
        return redirect('details_proposal', proposta_id=proposta.id)

    # Verifica pontuação do usuário
    profile = Profile.get_or_create_profile(request.user)
    nivel_user = profile.nivel_id
    if nivel_user.id < 5:
        messages.error(request, "Você não tem pontuação suficiente para votar.")
        return redirect('propostas')

    if request.method == 'POST':
        voto_valor = request.POST.get('voto') == 'favor'

        # Evita votos duplicados
        Voto.objects.update_or_create(
            proposta=proposta,
            usuario=request.user,
            defaults={'votos': voto_valor}
        )
        messages.success(request, "Voto registrado com sucesso.")
        return redirect('details_proposal', proposta_id=proposta.id)

    return render(request, 'vote.html', {'proposta': proposta})