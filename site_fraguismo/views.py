from django.core.paginator import Paginator
from django.db.models import Max, Subquery
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.template import loader
from log.models.log import Log
from rating.models.fotos_pro_liberdade import FotosProLiberdade
from site_fraguismo.models import Mensagem
from django.conf import settings
from pathlib import Path


GALERIA_FOTOS_POR_PAGINA = 12

EXTENSOES_PERMITIDAS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
}

def ordenar_imagem(arquivo: Path):
    """
    Ordena numericamente arquivos como:
    1.png, 2.png, 3.png, 10.png.

    Sem isso, 10.png poderia aparecer antes de 2.png.
    """
    nome = arquivo.stem

    if nome.isdigit():
        return 0, int(nome)

    return 1, nome.casefold()


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
    diretorio = (
        settings.BASE_DIR
        / "site_fraguismo"
        / "static"
        / "images"
        / "anarcopolis"
        / "palestrantes"
    )

    imagens = []

    if diretorio.exists():
        arquivos = [
            arquivo
            for arquivo in diretorio.iterdir()
            if arquivo.is_file()
            and arquivo.suffix.lower() in EXTENSOES_PERMITIDAS
        ]
        print(len(arquivos))

        arquivos.sort(key=ordenar_imagem)

        print(len(arquivos))
        imagens = [
            f"images/anarcopolis/palestrantes/{arquivo.name}"
            for arquivo in arquivos
        ]    
    print(len(imagens))
    return render(
        request,
        "anarcopolis.html",
        {
            "imagens_carrossel": imagens,
        },
    )

def anarcopolisinfo(request):
    return render(request, 'anarcopolisinfo.html')

def nossoobjetivo(request):
    return render(request, 'nossoobjetivo.html')


def galeria(request):    
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
