from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import render

from administrador.models.acesso import Acesso


@user_passes_test(lambda u: u.is_superuser)
def administrador(request):
    links = Acesso.objects.all()
    print(links[0].nome)
    return render(request, 'adm.html', {'links': links})