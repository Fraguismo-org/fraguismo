from django.db.models import Q
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from cursos.models.certificado import Certificado
from members.models.profile import Profile
from members.models.users import Users


@login_required(login_url='login')
def lista_cursos(request, username):
    user = Users.objects.get(username=username)
    profile = Profile.get_or_create_profile(user_request=user)
    certificados = Certificado.objects.filter(Q(user__username=username) | Q(user__profile__nivel=profile.nivel_id))
    return render(request, 'meus_cursos.html', {'certificados': certificados})

