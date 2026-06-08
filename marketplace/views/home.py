from django.shortcuts import render
from marketplace.models.anuncio import Anuncio


def home(request):
    anuncios =  Anuncio.objects.all().prefetch_related()

    return render(request, 'home.html', {
        'anuncios': anuncios,
        'linhas': [i for i in range(6)],
        'colunas': [i for i in range(3)],
    })