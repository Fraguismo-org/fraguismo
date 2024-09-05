from django.shortcuts import render, redirect
from django.contrib.auth.decorators import user_passes_test
from .models.log_rating import LogRating
from .models.atividade import Atividade
from members.models.profile import Profile
from members.models.users import Users, User


@user_passes_test(lambda u: u.is_superuser)
def log_rating(request):
    query = request.GET.get("busca")
    if query:
        opcao = request.GET.get("filter_field")
        match opcao:
            case 'first_name':
                users = User.objects.filter(first_name__istartswith=query).values_list('first_name', flat=True)
                logs = LogRating.objects.filter(user_id__first_name__in=users)
            case 'username':
                users = User.objects.filter(username__istartswith=query).values_list('username', flat=True)
                logs = LogRating.objects.filter(user_id__username__in=users)
            case 'email':
                users = User.objects.filter(email__istartswith=query).values_list('email', flat=True)
                logs = LogRating.objects.filter(user_id__email__in=users)
            case 'fone':
                users = Users.objects.filter(username__istartswith=query).values_list('fone', flat=True)                
                logs = LogRating.objects.filter(user_id__in=users)    
    else:
        logs = LogRating.objects.all()
    return render(request, 'log_rating.html', {'logs': logs})

@user_passes_test(lambda u: u.is_superuser)
def add_rating_point(request):
    if request.method == 'POST':
        id = request.POST.get('select-user')
        atividade_id = request.POST.get('select-atividade')
        pontuacao = request.POST.get('pontuacao')
        
        rating = LogRating()        
        profile = Profile.objects.get(user_id=id)
        atividade = Atividade.objects.get(id=atividade_id)
        
        rating.user_id = profile.user
        rating.pontuacao_ganha = int(pontuacao) if pontuacao is not None else atividade.pontuacao
        rating.pontuacao = profile.pontuacao
        rating.atividade = atividade
        rating.updated_by = request.user.id
        rating.save()

        profile.pontuacao += rating.pontuacao_ganha
        profile.save()        
        
        return redirect('logs')
    users = User.objects.all()
    atividades = Atividade.objects.all()
    return render(
        request,
        'add_rating.html',
        {
            'users': users,
            'atividades': atividades,
        }
    )

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
