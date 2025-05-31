import os
from django.contrib.auth.decorators import login_required
from PIL import Image, ImageOps
from django.shortcuts import render, redirect
from django.core.paginator import Paginator, InvalidPage, EmptyPage

from log.models.log import Log
from members.models.profile import Profile
from members.models.users import Users
from members.query.profiles_query import ProfilesQuery
from members.query.users_query import UsersQuery
from rating.models.nivel import Nivel
from utils.paginator import pagina_lista


@login_required(login_url='login')
def comunidade(request):
    return render(request, 'members/comunidade.html')


@login_required(login_url='login')
def user_page(request): 
    profile = Profile.get_or_create_profile(user_request=request.user)
    member = Users.get_or_create_member(user_request=request.user)
    niveis = Nivel.objects.all()
    if request.method == 'POST':
        member.email = request.POST.get('email', None)
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
    perfis = None
    try:
        query = request.GET.get("busca")
        lista_perfil = ProfilesQuery.get_profiles_by_query(query)
        perfis = pagina_lista(request=request, lista=lista_perfil, paginas=25)        
    except Exception as e:
        Log.salva_log(e)
        lista = Profile.objects.all()
        perfis = pagina_lista(request, lista, 25)        
    finally:
        return render(request, 'members/lista_usuarios.html', {'profiles': perfis,})
