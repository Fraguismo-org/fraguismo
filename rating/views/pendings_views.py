from pyexpat.errors import messages
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import user_passes_test, login_required

from members.models.profile import Profile
from members.models.profile_pendencia import ProfilePendencia
from members.models.users import Users
from rating.models.nivel import Nivel
from rating.models.nivel_choices import NivelChoices
from rating.models.pendencia import Pendencia



@login_required(login_url='login')
def my_pendings(request):
    if request.method == 'POST':
        p_pendencia_id = request.POST.get('profile_pendencia_id')
        p_pendencia = ProfilePendencia.objects.get(id=p_pendencia_id)
        p_pendencia.pendencia_status = 1
        p_pendencia.save()
    profile = Profile.get_or_create_profile(request.user)
    if profile.nivel.lower() == '':
        nivel = Nivel.objects.get(nivel=NivelChoices.APPRENTICE)
    else:
        nivel = Nivel.objects.get(nivel=profile.nivel.lower())
    nivel = nivel.proximo_nivel()
    pendencias = Pendencia.objects.filter(nivel=nivel)
    profile_pendencias = ProfilePendencia.objects.filter(profile=profile).filter(nivel=nivel)
    if len(profile_pendencias) < len(pendencias):
        ProfilePendencia.add_pendencias(profile, pendencias)
        profile_pendencias = ProfilePendencia.objects.filter(profile=profile).filter(nivel=nivel)    
    return render(
        request, 
        'pendencias/my_pendings.html', 
        {
            'pendencias': pendencias, 
            'profile_pendencias': profile_pendencias
        }
    )
    
@login_required(login_url='login')
def user_pending(request, username):
    user = Users.objects.get(username=username)
    profile = Profile.get_or_create_profile(user)        
    profile_pendencias = ProfilePendencia.get_pendencias(profile)
    
    return render(
        request,
        'pendencias/user_pending.html', 
        {            
            'profile_pendencias': profile_pendencias,
            'usuario': user,
            'profile': profile,
        }
    )


@user_passes_test(lambda u: u.is_superuser)
def add_pendencia(request):
    if request.method == "POST":
        nivel = Nivel.objects.get(nivel=request.POST.get('select-nivel', None))
        pendencia = Pendencia()
        pendencia.nivel = nivel
        pendencia.pendencia = request.POST.get('pendencia', None)
        pendencia.save()
    pendencias = Pendencia.objects.all()
    niveis = Nivel.objects.all()
    return render(
        request, 
        'pendencias/add_pendencia.html', 
        {
            'niveis': niveis, 
            'pendencias': pendencias
        }
    )

@user_passes_test(lambda u: u.is_superuser)
def remove_pendencia(request, id: int):
    if request.method == 'GET':
        pendencia = Pendencia.objects.get(id=id)
        return render(request, 'pendencias/remove_pendencia.html', {'pendencia': pendencia})
    if request.method == 'POST':
        pendencia = Pendencia.objects.get(id=id)
        pendencia.delete()
        return redirect('add_pendencia')


@user_passes_test(lambda u: u.is_superuser)
def edita_pendencia(request, id: int):
    if request.method == 'GET':
        niveis = Nivel.objects.all()
        pendencia = Pendencia.objects.get(id=id)
        return render(request, 'pendencias/edita_pendencia.html', {
            'niveis': niveis,
            'pendencia': pendencia,
        })
    if request.method == 'POST':
        nivel_id = request.POST.get('select-nivel', '1')
        pendencia_nome = request.POST.get('pendencia', '')
        pendencia = Pendencia.objects.get(id=id)
        nivel = Nivel.objects.get(id=nivel_id)
        pendencia.pendencia = pendencia_nome
        pendencia.nivel = nivel
        pendencia.save()
        return redirect('add_pendencia')
    
    
@user_passes_test(lambda u: u.is_superuser)
def add_pendencia_usuario(request, id: int):
    if request.method == 'GET':
        pendencias = Pendencia.objects.all()
        usuario = Users.objects.get(id=id)
        return render(request, 'pendencias/usuarios/add_pendencia_usuario.html', {
            'pendencias': pendencias,
            'usuario': usuario,
        })
    if request.method == 'POST':
        usuario = request.POST.get('usuario', None)
        pendencia_id = request.POST.get('select-pendencia', None)
        usuario = Users.objects.get(username=usuario)
        pendencia = Pendencia.objects.get(id=pendencia_id)
        profile = Profile.get_or_create_profile(usuario)
        ProfilePendencia.add_pendencias(profile, [pendencia])
        return redirect('user_pending', username=usuario.username)
    

@user_passes_test(lambda u: u.is_superuser)
def finaliza_pendencia_usuario(request, profile_pendencia_id: int):
    if request.method == 'POST':
        profile_pendencia = ProfilePendencia.objects.get(id=profile_pendencia_id)
        ProfilePendencia.update_pendencia_status(2, profile_pendencia)
        return redirect('user_pending', username=profile_pendencia.profile.user.username)
    
    
@user_passes_test(lambda u: u.is_superuser)
def remove_pendencia_usuario(request, profile_pendencia_id: int):
    if request.method == 'POST':
        profile_pendencia = ProfilePendencia.objects.get(id=profile_pendencia_id)
        profile_pendencia.delete()
        messages.success(request, 'Pendência removida com sucesso!')
        return redirect('user_pending', username=profile_pendencia.profile.user.username)
    