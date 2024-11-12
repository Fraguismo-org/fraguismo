from django.shortcuts import render
from marketplace.models.anuncio import Anuncio
from members.models.users import Users


def home(request):
    anuncios =  Anuncio.objects.all().prefetch_related()
    
    member = None
    if request.user.is_authenticated:
        member = Users.objects.get(user_ptr_id=request.user)
    return render(request, 'home.html', {
        'anuncios': anuncios,
        'linhas': [i for i in range(6)],
        'colunas': [i for i in range(3)],
        'member': member
    })