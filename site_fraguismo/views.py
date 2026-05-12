from django.core.paginator import Paginator
from django.db.models import Max, Subquery
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.template import loader
from log.models.log import Log
from rating.models.fotos_pro_liberdade import FotosProLiberdade
from site_fraguismo.models import Mensagem


GALERIA_FOTOS_POR_PAGINA = 12


def _fotos_publicas_aprovadas():
    """QuerySet base: fotos públicas de reivindicações aprovadas."""
    return (
        FotosProLiberdade.objects
        .filter(is_public=True, pro_liberdade__is_approved=True)
        .select_related('pro_liberdade__user')
        .order_by('-created_at')
    )


def index(request):    
    return render(request, 'index.html')

def contato(request):
    if request.method  == 'POST':
        try:
            mensagem = Mensagem()
            mensagem.nome = request.POST.get('nome')
            mensagem.email = request.POST.get('email')
            mensagem.assunto = request.POST.get('assunto')
            mensagem.mensagem = request.POST.get('mensagem')
            mensagem.save()
        except Exception as e:
            Log.salva_log(e)
        return redirect('index')
    return render(request, 'contato.html')

def administrativo(request):
    return redirect('index')

def agenda(request):
    return redirect('index')

def leinatural(request):
    return render(request, 'leinatural.html')

def dao(request):
    return render(request, 'dao.html')

def daoregras(request):
    return render(request, 'daoregras.html')

def hierarquia(request):
    return render(request, 'hierarquia.html')

def cursofraguista(request):
    return render(request, 'cursofraguista.html')

def anarcopolis(request):
    return render(request, 'anarcopolis.html')

def anarcopolisinfo(request):
    return render(request, 'anarcopolisinfo.html')

def nossoobjetivo(request):
    return render(request, 'nossoobjetivo.html')


def galeria(request):
    # Carrossel: foto mais recente de cada usuário distinto (máx. 10)
    latest_per_user = (
        FotosProLiberdade.objects
        .filter(is_public=True, pro_liberdade__is_approved=True)
        .values('pro_liberdade__user')
        .annotate(latest_id=Max('id'))
        .values('latest_id')
    )
    carrossel = (
        FotosProLiberdade.objects
        .filter(id__in=Subquery(latest_per_user))
        .select_related('pro_liberdade__user')
        .order_by('-created_at')[:10]
    )

    # Galeria: primeira página
    fotos_qs = _fotos_publicas_aprovadas()
    paginator = Paginator(fotos_qs, GALERIA_FOTOS_POR_PAGINA)
    primeira_pagina = paginator.get_page(1)

    return render(request, 'galeria.html', {
        'carrossel': carrossel,
        'fotos': primeira_pagina,
        'has_next': primeira_pagina.has_next(),
    })


def galeria_api(request):
    """Endpoint JSON para infinite scroll da galeria."""
    page_number = request.GET.get('page', 1)
    fotos_qs = _fotos_publicas_aprovadas()
    paginator = Paginator(fotos_qs, GALERIA_FOTOS_POR_PAGINA)
    page = paginator.get_page(page_number)

    fotos_data = [
        {
            'foto_url': foto.foto.url,
            'evento': foto.pro_liberdade.evento,
            'local': foto.pro_liberdade.local_evento,
            'username': foto.pro_liberdade.user.username,
        }
        for foto in page
    ]

    return JsonResponse({
        'fotos': fotos_data,
        'has_next': page.has_next(),
        'page': page.number,
    })
