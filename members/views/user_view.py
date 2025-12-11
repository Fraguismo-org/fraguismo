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
from members.models.users import Users
from members.query.profiles_query import ProfilesQuery
from rating.models.nivel import Nivel
from utils.paginator import pagina_lista


@login_required(login_url='login')
def comunidade(request):
    return render(request, 'members/comunidade.html')


@login_required(login_url='login')
def user_page(request):
    member = Users.get_or_create_member(user_request=request.user)
    profile = Profile.get_or_create_profile(user_request=member)
    niveis = Nivel.objects.all()
    if request.method == 'POST':
        email = request.POST.get('email', None)
        if member.email != email and Users.objects.filter(email=email):
            messages.warning(request, f'E-mail já em uso!')
            return render(
            request,
            'members/user_page.html',
            {
                'profile': profile,
                'member': member,
                'niveis': niveis
            }
        )
        member.email = email
        if not member.is_fraguista:
            member.is_fraguista = request.POST.get('fraguista', None) == 'on'
        if member.is_fraguista:
            member.first_name = request.POST.get('first_name', None)
            member.last_name = request.POST.get('last_name', None)        
            member.birth = request.POST.get('birth', None)
            member.city = request.POST.get('city', None)
            member.fone = request.POST.get('fone', None)
            member.instagram = request.POST.get('instagram', None)
            member.job_title = request.POST.get('job_title', None)
            member.bsc_wallet = request.POST.get('bsc_wallet', None)
            member.lightning_wallet = request.POST.get('lightning_wallet', None)
            if not member.codigo_conduta:
                member.codigo_conduta = request.POST.get('codigo_conduta', None) == 'on'
        
        if 'pic_profile' in request.FILES:
            old_img = profile.pic_profile.path
            if os.path.isfile(old_img):
                os.remove(old_img)
            profile.pic_profile = request.FILES['pic_profile']
        
        member.save()
        profile.save()
        
        if profile.pic_profile.path.find('default.jpg') == -1:
            img = Image.open(profile.pic_profile.path)
            img = ImageOps.exif_transpose(img)
            rate = img.height/300 if img.height > img.width else img.width/300
            if img.height > 300 or img.width > 300:
                output_size = (img.width/rate, img.height/rate)
                img.thumbnail(output_size)
                img.save(profile.pic_profile.path)
    
        return redirect('user_page')
    else:
        return render(
            request,
            'members/user_page.html',
            {
                'profile': profile,
                'member': member,
                'niveis': niveis
            }
        )
        

@login_required(login_url='login')
def lista_usuarios(request):
    try:
        # Coletar parâmetros
        params = {k: request.GET.get(k, "").strip() 
                 for k in ["fraguista", "questionario", "contato", "ordenar", "busca"]}
        
        # Query inicial
        qs = Profile.objects.all()
        if params["busca"]:
            try:
                qs = ProfilesQuery.get_profiles_by_query(params["busca"])
            except Exception as e:
                Log.salva_log(f"Busca falhou: {e}")
                qs = Profile.objects.all()
        
        # Mapeamento de filtros
        filtros = {
            'fraguista': {
                'sim': {'user__is_fraguista': True},
                'nao': {'user__is_fraguista': False},
            },
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
        
        # Aplicar filtros com segurança
        for filtro_nome, valor in params.items():
            if filtro_nome in filtros and valor in filtros[filtro_nome]:
                try:
                    qs = qs.filter(**filtros[filtro_nome][valor])
                except (FieldError, ValueError) as e:
                    Log.salva_log(f"Filtro {filtro_nome}={valor} falhou: {e}")
                    # Continua sem o filtro problemático
        
        # Ordenação
        if params["ordenar"] == "novo":
            qs = qs.order_by("-user__date_joined")
        elif params["ordenar"] == "antigo":
            qs = qs.order_by("user__date_joined")
        
        # Paginação
        perfis = pagina_lista(request=request, lista=qs, paginas=25)
        
        return render(
            request,
            "members/lista_usuarios.html",
            {"profiles": perfis, **params}
        )
    
    except (DatabaseError, OperationalError) as e:
        Log.salva_log(f"Erro de banco: {e}")
        return render(
            request,
            "members/lista_usuarios.html",
            {
                "profiles": pagina_lista(request=request, lista=Profile.objects.none(), paginas=25),
                "erro": "Erro no banco de dados"
            }
        )
    
    except Exception as e:
        Log.salva_log(f"Erro inesperado: {e}")
        return render(
            request,
            "members/lista_usuarios.html",
            {
                "profiles": pagina_lista(request=request, lista=Profile.objects.none(), paginas=25),
                "erro": "Erro interno do servidor"
            }
        )

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
