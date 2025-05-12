from django.shortcuts import render
from django.core.paginator import Paginator, InvalidPage, EmptyPage

from members.query.users_query import UsersQuery
from .models.acesso import Acesso
from members.models.users import Users
from members.models.profile import Profile
from members.models.profile_pendencia import ProfilePendencia
from rating.models.pendencia import Pendencia
from rating.models.nivel import Nivel
from django.contrib.auth.decorators import user_passes_test
from services.query_filter_service import QueryFilterService
from services.query_type import QueryType

@user_passes_test(lambda u: u.is_superuser)
def administrador(request):
    links = Acesso.objects.all()
    print(links[0].nome)
    return render(request, 'adm.html', {'links': links})

@user_passes_test(lambda u: u.is_superuser)
def lista_usuarios(request):
    query = request.GET.get("busca")
    usuarios_list = UsersQuery.get_users_by_query(query)
    paginas = Paginator(usuarios_list, 25)
    try:
        page = int(request.GET.get('page', '1'))
    except ValueError:
        page = 1
    try:
        usuarios = paginas.page(page)
    except (EmptyPage, InvalidPage):
        usuarios = paginas.page(paginas.num_pages)
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