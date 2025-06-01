from django.shortcuts import redirect, render
from django.contrib.auth.decorators import user_passes_test

from log.models.log import Log
from rating.models.atividade import Atividade



@user_passes_test(lambda u: u.is_superuser)
def register_activity(request):
    if request.method == 'POST':
        try:
            activity = Atividade()
            activity.nome_atividade = request.POST.get('atividade', None)
            activity.pontuacao = int(request.POST.get('pontuacao', None))
            activity.updated_by = request.user
            activity.save()
            redirect('register_activity')
        except Exception as e:
            Log.salva_log(e)
            return render(request, 'register_activity.html')

    return render(request, 'register_activity.html')
