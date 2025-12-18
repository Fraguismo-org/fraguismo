import os

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.exceptions import FieldError
from PIL import Image, ImageOps
from django.db import DatabaseError, OperationalError, transaction
from django.shortcuts import render, redirect, get_object_or_404

from members.models.questionario import Questionario
from members.models.users import Users
from log.models.log import Log
from members.models.profile import Profile
from members.models.questionario import Questionario
from members.models.users import Users
from members.query.profiles_query import ProfilesQuery
from rating.models.nivel import Nivel
from utils.paginator import pagina_lista


@login_required(login_url="login")
def comunidade(request):
    return render(request, "members/comunidade.html")


@login_required(login_url='login')
def user_page(request):
    member = Users.get_or_create_member(user_request=request.user)
    profile = Profile.get_or_create_profile(user_request=member)
    niveis = Nivel.objects.all()
    if request.method == "POST":
        email = request.POST.get("email", None)
        if member.email != email and Users.objects.filter(email=email):
            messages.warning(request, f"E-mail já em uso!")
            return render(
                request,
                "members/user_page.html",
                {"profile": profile, "member": member, "niveis": niveis},
            )
        member.email = email
        if not member.is_fraguista:
            member.is_fraguista = request.POST.get("fraguista", None) == "on"
        if member.is_fraguista:
            member.first_name = request.POST.get("first_name", None)
            member.last_name = request.POST.get("last_name", None)
            member.birth = request.POST.get("birth", None)
            member.city = request.POST.get("city", None)
            member.fone = request.POST.get("fone", None)
            member.instagram = request.POST.get("instagram", None)
            member.job_title = request.POST.get("job_title", None)
            member.bsc_wallet = request.POST.get("bsc_wallet", None)
            member.lightning_wallet = request.POST.get("lightning_wallet", None)
            if not member.codigo_conduta:
                member.codigo_conduta = request.POST.get("codigo_conduta", None) == "on"

        if "pic_profile" in request.FILES:
            old_img = profile.pic_profile.path
            if os.path.isfile(old_img):
                os.remove(old_img)
            profile.pic_profile = request.FILES["pic_profile"]

        member.save()
        profile.save()

        if profile.pic_profile.path.find("default.jpg") == -1:
            img = Image.open(profile.pic_profile.path)
            img = ImageOps.exif_transpose(img)
            rate = img.height / 300 if img.height > img.width else img.width / 300
            if img.height > 300 or img.width > 300:
                output_size = (img.width / rate, img.height / rate)
                img.thumbnail(output_size)
                img.save(profile.pic_profile.path)

        return redirect("user_page")
    else:
        return render(
            request,
            "members/user_page.html",
            {"profile": profile, "member": member, "niveis": niveis},
        )


@login_required(login_url="login")
def lista_usuarios(request):
    try:
        # Parâmetros
        param_keys = ["fraguista", "questionario", "contato", "ordenar", "busca"]
        params = {k: request.GET.get(k, "").strip() for k in param_keys}
        
        # Query inicial
        qs = Profile.objects.all()
        if params["busca"]:
            try:
                qs = ProfilesQuery.get_profiles_by_query(params["busca"])
            except Exception as e:
                Log.salva_log(f"Busca falhou: {e}")
                qs = Profile.objects.all()
        
        # Estrutura de filtros
        filtro_config = {
            'fraguista': {'sim': {'user__is_fraguista': True}, 'nao': {'user__is_fraguista': False}},
            'questionario': {
                'pendente': {'user__is_fraguista': True, 'questionario__isnull': True},
                'preenchido': {'user__is_fraguista': True, 'questionario__isnull': False},
            },
            'contato': {
                'pendente': {'user__is_fraguista': True, 'questionario__isnull': False, 
                            'questionario__contato_realizado': False},
                'feito': {'user__is_fraguista': True, 'questionario__isnull': False, 
                         'questionario__contato_realizado': True},
            }
        }
        
        # Aplicar filtros
        for filtro, valor in params.items():
            if valor and filtro in filtro_config and valor in filtro_config[filtro]:
                try:
                    qs = qs.filter(**filtro_config[filtro][valor])
                except Exception as e:
                    Log.salva_log(f"Filtro {filtro}={valor} falhou: {e}")
        
        # Ordenação
        ordenacao_map = {'novo': '-user__date_joined', 'antigo': 'user__date_joined'}
        ordenacao = ordenacao_map.get(params['ordenar'], '-user__date_joined')
        qs = qs.order_by(ordenacao)
        
        # Contexto
        context = {"profiles": pagina_lista(request, qs, 25), **params}
        
    except Exception as e:
        Log.salva_log(f"Erro em lista_usuarios: {e}")
        context = {
            "profiles": pagina_lista(request, Profile.objects.none(), 25),
            "erro": "Erro ao carregar usuários"
        }
    
    return render(request, "members/lista_usuarios.html", context)

@login_required(login_url="login")
def marcar_contato(request, questionario_id):
    if not request.user.is_staff:
        messages.warning(request, "Apenas administradores podem marcar contatos.")
        return redirect("user_page")
    
    try:
        # Buscar questionário
        questionario = Questionario.objects.get(id=questionario_id)
        
        # Verificar se já não está marcado
        if questionario.contato_realizado:
            messages.info(request, "Este contato já foi marcado como realizado.")
            return redirect("lista_usuarios")
        
        # Atualizar com transação
        with transaction.atomic():
            questionario.contato_realizado = True
            questionario.save()
            
            # Log opcional
            Log.salva_log(
                f"Contato marcado: questionário {questionario_id}",
                user=request.user
            )
        
        messages.success(request, "Contato marcado como realizado!")
        
    except Questionario.DoesNotExist:
        messages.error(request, "Questionário não encontrado.")
        Log.salva_log(f"Questionário {questionario_id} não existe")
        
    except (DatabaseError, OperationalError) as e:
        messages.error(request, "Erro no banco de dados.")
        Log.salva_log(f"Erro de BD ao marcar contato {questionario_id}: {e}")
        
    except Exception as e:
        messages.error(request, "Erro inesperado ao processar a solicitação.")
        Log.salva_log(f"Erro inesperado em marcar_contato: {e}")
    
    return redirect("lista_usuarios")
