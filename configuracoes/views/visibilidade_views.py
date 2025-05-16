from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
import json

from configuracoes.models.configuracao_visibilidade import ConfiguracaoVisibilidade
from members.models.users import Users


@login_required(login_url='login')
def salva_configuracoes(request, user_id):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            usuario = Users.objects.get(user_ptr_id=user_id)
            config_visibilidade, _ = ConfiguracaoVisibilidade.objects.get_or_create(usuario=usuario)                           
            config_visibilidade.email = body['email']
            config_visibilidade.nome = body['nome']
            config_visibilidade.sobrenome = body['sobrenome']
            config_visibilidade.telefone = body['telefone']
            config_visibilidade.localidade = body['localidade']
            config_visibilidade.instagram = body['instagram']
            config_visibilidade.idade = body['idade']
            config_visibilidade.profissao = body['profissao']
            config_visibilidade.polygon = body['polygon']
            config_visibilidade.lightining = body['lightining']
            config_visibilidade.save()
            return HttpResponse("Configuracao salva com sucesso!", status=200)
        except Exception as e:
            return HttpResponse("Falha ao salvar as configurações de visibilidade!", status=400)
        