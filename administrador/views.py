from django.shortcuts import render
from .models.acesso import Acesso
from members.models.users import Users
from members.models.profile import Profile
from members.models.profile_pendencia import ProfilePendencia
from rating.models.pendencia import Pendencia
from rating.models.nivel import Nivel
from django.contrib.auth.decorators import user_passes_test

@user_passes_test(lambda u: u.is_superuser)
def administrador(request):
    links = Acesso.objects.all()
    print(links[0].nome)
    return render(request, 'adm.html', {'links': links})

@user_passes_test(lambda u: u.is_superuser)
def lista_usuarios(request):
    usuarios = Users.objects.all()
    return render(request, 'lista_usuarios.html', {'usuarios': usuarios,})

@user_passes_test(lambda u: u.is_superuser)
def pendencia_usuario(request, username):
    if request.method == 'POST':
        p_pendencia_id = request.POST.get('profile_pendencia_id')
        p_pendencia = ProfilePendencia.objects.get(id=p_pendencia_id)
        p_pendencia.pendencia_status = 2
        p_pendencia.save()
    user = Users.objects.get(username=username)
    profile = Profile.get_or_create_profile(user)
    nivel = Nivel.objects.get(nivel=profile.nivel.lower())
    nivel = nivel.proximo_nivel()
    pendencias = Pendencia.objects.filter(nivel=nivel)
    profile_pendencias = ProfilePendencia.objects.filter(profile=profile).filter(nivel=nivel)
    if len(profile_pendencias) < len(pendencias):
        ProfilePendencia.add_pendencias(profile, pendencias)
        profile_pendencias = ProfilePendencia.objects.filter(profile=profile).filter(nivel=nivel) 
    return render(
        request, 
        'pendencias/pendencia_usuarios.html', 
        {
            'usuario': user,
            'pendencias': pendencias, 
            'profile_pendencias': profile_pendencias
        }
    )