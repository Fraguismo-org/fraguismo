from django.contrib import messages
from django.shortcuts import render
from django.contrib.auth.decorators import user_passes_test
from django.core.paginator import Paginator, InvalidPage, EmptyPage

from cursos.models.certificado import Certificado
from members.models.users import Users
from members.query.profiles_query import ProfilesQuery
from members.query.users_query import UsersQuery



@user_passes_test(lambda u: u.is_superuser)
def add_certificado(request):
    if request.method == 'POST':
        ids = request.POST.getlist('usuarios[]')
        for id in ids:
            cert = Certificado()
            cert.user = Users.objects.get(id=id)
            cert.certificado_nome = request.POST.get('certificado', None)
            cert.certificado_status = request.POST.get('select-status', None)
            cert.save()
        messages.success(request,'Certificado adicionado com sucesso!')
    query = request.GET.get("busca")
    profile_list = ProfilesQuery.get_profiles_by_query(query)
    paginas = Paginator(profile_list, 25)
    try:
        page = int(request.GET.get('page', '1'))
    except ValueError:
        page = 1
    try:
        profiles = paginas.page(page)
    except (EmptyPage, InvalidPage):
        profiles = paginas.page(paginas.num_pages)
    return render(request, 'add_certificados.html', {'profiles': profiles})