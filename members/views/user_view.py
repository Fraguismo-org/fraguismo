import os
from django.contrib.auth.decorators import login_required
from PIL import Image, ImageOps
from django.shortcuts import render, redirect
from django.core.paginator import Paginator, InvalidPage, EmptyPage

from members.models.profile import Profile
from members.models.users import Users
from members.query.users_query import UsersQuery


@login_required(login_url='login')
def comunidade(request):
    return render(request, 'members/comunidade.html')


@login_required(login_url='login')
def user_page(request): 
    profile = Profile.get_or_create_profile(user_request=request.user)
    member = Users.get_or_create_member(user_request=request.user)
    if request.method == 'POST':
        member.email = request.POST.get('email', None)
        member.is_fraguista = request.POST.get('fraguista', None) == 'on'
        if (member.is_fraguista):
            member.first_name = request.POST.get('first_name', None)
            member.last_name = request.POST.get('last_name', None)        
            member.birth = request.POST.get('birth', None)
            member.city = request.POST.get('city', None)
            member.fone = request.POST.get('fone', None)
            member.instagram = request.POST.get('instagram', None)
            member.job_title = request.POST.get('job_title', None)
            member.bsc_wallet = request.POST.get('bsc_wallet', None)
            member.lightning_wallet = request.POST.get('lightning_wallet', None)
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
                'member': member
            }
        )
        

@login_required(login_url='login')
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
