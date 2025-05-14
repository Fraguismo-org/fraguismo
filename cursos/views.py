from django.db.models import Q
from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test
from members.models.profile import Profile
from members.models.users import User, Users
from cursos.models.certificado import Certificado
from members.query.users_query import UsersQuery
from services.query_filter_service import QueryFilterService
from services.query_type import QueryType
from django.core.paginator import Paginator, InvalidPage, EmptyPage


@login_required(login_url='login')
def lista_cursos(request, username):
    profile = Profile.objects.get_or_create(user__username=username).first()
    certificados = Certificado.objects.filter(Q(user__username=username) | Q(user__profile__nivel=profile.nivel_id))
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
    return render(request, 'add_certificados.html', {'usuarios': usuarios})