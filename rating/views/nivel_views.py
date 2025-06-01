from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import redirect
from django.contrib import messages
from django.http import HttpResponse

from members.models.profile import Profile
from members.models.users import Users
from rating.models.nivel import Nivel
from log.models.log import Log



@user_passes_test(lambda u: u.is_superuser)
def alterar_nivel(request):
    if request.method == 'POST':
        try:
            user_id = request.POST.get('user_id')
            nivel_id = request.POST.get('nivel_id')
            user = Users.objects.get(user_ptr_id=user_id)        
            nivel = Nivel.objects.get(id=nivel_id)
            profile = Profile.get_or_create_profile(user)
            profile.nivel = nivel.nivel
            profile.nivel_id = nivel
            profile.save()
            messages.success(request,'Nível alterado com sucesso!')
            return HttpResponse("Nivel alterado com sucesso!", status=200)
        except Exception as e:
            Log.salva_log(e)
        