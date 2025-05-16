from django.db.models import Q
from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import HttpResponse
import json

from cursos.models.certificado import Certificado
from members.models.profile import Profile
from members.models.users import Users


@login_required(login_url='login')
def lista_cursos(request, username):
    user = Users.objects.get(username=username)
    profile = Profile.get_or_create_profile(user_request=user)
    certificados = Certificado.objects.filter(user__username=username)
    return render(request, 'meus_cursos.html', {'certificados': certificados, 'profile': profile})

@user_passes_test(lambda u: u.is_superuser)
def remove_curso(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            certificado_id = body['certificado_id']
            certificado = Certificado.objects.get(id=certificado_id)
            certificado.delete()
            return HttpResponse('Certificado removido com sucesso.', status=204)
        except Exception as e:
            return HttpResponse('Erro ao remover certificado.', status=500)
    else:
        return HttpResponse('Método não suportado.', status=404)
        