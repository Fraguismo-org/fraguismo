from django.shortcuts import render
from django.contrib.auth.decorators import user_passes_test

from members.models.profile import Profile
from members.models.profile_pendencia import ProfilePendencia
from members.models.users import Users
from rating.models.nivel import Nivel
from rating.models.pendencia import Pendencia


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