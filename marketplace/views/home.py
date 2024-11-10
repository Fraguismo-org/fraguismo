from django.shortcuts import render
from marketplace.models.anuncio import Anuncio


def home(request):
    anuncios =  Anuncio.objects.all()
    return render(request, 'home.html', {
        'anuncios': anuncios
    })