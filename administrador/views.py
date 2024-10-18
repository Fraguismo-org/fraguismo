from django.shortcuts import render
from .models.acesso import Acesso

# Create your views here.
def administrador(request):
    links = Acesso.objects.all()
    print(links[0].nome)
    return render(request, 'adm.html', {'links': links})