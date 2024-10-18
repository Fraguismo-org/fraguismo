from django.shortcuts import render
from .models.acesso import Acesso
from django.contrib.auth.decorators import user_passes_test

@user_passes_test(lambda u: u.is_superuser)
def administrador(request):
    links = Acesso.objects.all()
    print(links[0].nome)
    return render(request, 'adm.html', {'links': links})