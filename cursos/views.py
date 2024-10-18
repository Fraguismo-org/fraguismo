from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test
from members.models.users import User
from cursos.models.certificado import Certificado

# Create your views here.
@login_required
def meus_cursos(request):
    certificados = Certificado.objects.filter(user=request.user)
    return render(request, 'meus_cursos.html', {'certificados': certificados})

@user_passes_test(lambda u: u.is_superuser)
def add_certificado(request):
    if request.method == 'POST':
        id = request.POST.get('select-user')
        cert = Certificado()
        cert.user = User.objects.get(id=id)
        cert.certificado_nome = request.POST.get('certificado', None)
        cert.certificado_status = request.POST.get('select-status', None)
        cert.save()
    users = User.objects.all()
    return render(request, 'add_certificados.html', {'users': users})