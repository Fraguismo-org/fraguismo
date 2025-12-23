from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import render

from administrador.models.acesso import Acesso
from log.models.log import Log


@user_passes_test(lambda u: u.is_superuser)
def administrador(request):
    try:
        links = Acesso.objects.all()
        return render(request, 'adm.html', {'link': links})
    except Exception as e:
        Log.salva_log(e)

@user_passes_test(lambda u: u.is_superuser)
def navigation(request):
    try:
        return render(request, 'navigation.html', {})
    except Exception as e:
        Log.salva_log(e)