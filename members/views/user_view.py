import os
from time import timezone
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from PIL import Image, ImageOps
from django.http import HttpResponseForbidden
from django.shortcuts import render, redirect, get_object_or_404
# from django.contrib.admin.views.decorators import staff_member_required

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
    filtro_fraguista = request.GET.get("fraguista")       # '', 'sim', 'nao'
    filtro_questionario = request.GET.get("questionario") # '', 'pendente', 'preenchido'
    ordenar = request.GET.get("ordenar")                  # '', 'novo', 'antigo'

    try:
        query = request.GET.get("busca")
        qs = ProfilesQuery.get_profiles_by_query(query)
    except Exception as e:
        Log.salva_log(e)
        qs = Profile.objects.all()

    # filtro fraguista
    if filtro_fraguista == "sim":
        qs = qs.filter(user__is_fraguista=True)
    elif filtro_fraguista == "nao":
        qs = qs.filter(user__is_fraguista=False)

    # filtro questionário
    if filtro_questionario == "pendente":
        qs = qs.filter(user__is_fraguista=True, questionario__isnull=True)
    elif filtro_questionario == "preenchido":
        qs = qs.filter(user__is_fraguista=True, questionario__isnull=False)

    # ordenação
    if ordenar == "novo":
        qs = qs.order_by("-user__date_joined")
    elif ordenar == "antigo":
        qs = qs.order_by("user__date_joined")

    perfis = pagina_lista(request=request, lista=qs, paginas=25)

    return render(
        request,
        "members/lista_usuarios.html",
        {
            "profiles": perfis,
            "filtro_fraguista": filtro_fraguista,
            "filtro_questionario": filtro_questionario,
            "ordenar": ordenar,
        },
    )

@login_required(login_url="login")
def marcar_contato(request, questionario_id):
    if not request.user.is_staff:
        messages.warning(request, "Você não pode marcar contato, apenas administradores.")
        return redirect("user_page")

    questionario = get_object_or_404(Questionario, id=questionario_id)
    questionario.contato_realizado = True
    questionario.save()

    messages.success(request, "Contato marcado como realizado!")
    return redirect("lista_usuarios")
