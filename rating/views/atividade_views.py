from django.shortcuts import redirect, render
from django.contrib.auth.decorators import user_passes_test

from rating.models.atividade import Atividade



@user_passes_test(lambda u: u.is_superuser)
def register_activity(request):
    if request.method == 'POST':
        activity = Atividade()
        activity.nome_atividade = request.POST.get('atividade', None)
        activity.pontuacao = int(request.POST.get('pontuacao', None))
        activity.updated_by = request.user
        activity.save()
        redirect('register_activity')

    return render(request, 'register_activity.html')
