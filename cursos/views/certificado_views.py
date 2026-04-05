from django.contrib import messages
from django.shortcuts import get_object_or_404, render
from django.contrib.auth.decorators import user_passes_test
from django.db.models import Q

from members.models.profile import Profile
from members.models.users import Users
from cursos.models.certificado import Certificado
from log.models.log import Log
from members.query.profiles_query import ProfilesQuery
from rating.services.pontos_service import PontosService
from utils.paginator import pagina_lista


@user_passes_test(lambda u: u.is_superuser)
def add_certificado(request):
    if request.method == 'POST':
        try:
            ids = request.POST.getlist('usuarios[]')            
            for id in ids:
                cert_nome = request.POST.get('certificado', None)
                cert_status = request.POST.get('select-status', None)
                cert_pontuacao = request.POST.get('pontuacao', None)
                
                cert = Certificado.objects.filter(
                    Q(user_id=id),
                    Q(certificado_nome=cert_nome)
                ).first()

                if not cert:
                    cert = Certificado()
                    cert.certificado_nome = cert_nome
                    user = Users.objects.get(user_ptr_id=id)
                    cert.user = user
                
                profile = get_object_or_404(Profile, user=id)

                cert.certificado_status = cert_status
                cert.save()
                if cert_status == '1':
                    _= PontosService.editar(profile, cert_pontuacao)
            
            messages.success(request,'Certificado adicionado com sucesso!')
        except Exception as e:
            Log.salva_log(e)
            messages.warning(request, 'Erro ao adicionar certificado')
    query = request.GET.get("busca")
    profile_list = ProfilesQuery.get_profiles_by_query(query)
    profiles = pagina_lista(request, profile_list, 25)    
    return render(request, 'add_certificados.html', {'profiles': profiles})