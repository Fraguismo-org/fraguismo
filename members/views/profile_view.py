from datetime import date
from django.shortcuts import render, redirect

from configuracoes.models.configuracao_visibilidade import ConfiguracaoVisibilidade
from members.models.profile import Profile
from members.models.users import Users
from rating.models.nivel import Nivel


def profile(request, username: str):
    member = Users.objects.get(user_ptr_id__username=username)
    profile = Profile.get_or_create_profile(user_request=member)
    config_visibilidade, _ = ConfiguracaoVisibilidade.objects.get_or_create(usuario=member)
    niveis = Nivel.objects.all()
    if request.method == 'GET':
        if member.birth is None:
            idade = 'Não informado'
        else:
            idade  = date.today().year - member.birth.year
        return render(
            request, 
            'members/profile.html', 
            {
                'member': member, 
                'profile': profile, 
                'idade': idade , 
                'niveis': niveis,
                'configs': config_visibilidade,
            }
        )
    else:
        return redirect('user_page')
    
