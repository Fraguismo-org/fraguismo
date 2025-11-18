from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.template import loader
from log.models.log import Log
from site_fraguismo.models import Mensagem
# import requests
# from django.shortcuts import render


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

"""
Futura integração com Notion + HTML. Automatizando assim as alterações das paginas.

NOTION_TOKEN = 'secret_abc...'
PAGE_ID = '22d0f2b3d35c80c18c01cb47146f1617' # id roadmap fraguismo

def notion_roadmap(request):
    url = f"https://api.notion.com/v1/blocks/{PAGE_ID}/children"
    headers = {
        "Authorization": f"Bearer {NOTION_TOKEN}",
        "Notion-Version": "2022-06-28",
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    
    # Exemplo simples: pegar texto do primeiro bloco de parágrafo
    text = ""
    for block in data.get("results", []):
        if block["type"] == "paragraph":
            texts = block["paragraph"]["text"]
            if texts:
                text = texts[0]["plain_text"]
                break
    
    return render(request, 'nossoobjetivo.html', {"notion_text": text})

   """
