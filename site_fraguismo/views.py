from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.template import loader
from site_fraguismo.models import Mensagem


def index(request):    
    return render(request, 'index.html')

def codigo_conduta(request):
    return render(request, 'Regras/codigo_conduta.html')

def termos_condicoes(request):
    return render(request, 'Regras/termos_condicoes.html')

def sobre_nos(request):
    return render(request, 'sobre_nos.html')

def contato(request):
    if request.method  == 'POST':
        mensagem = Mensagem()
        mensagem.nome = request.POST.get('nome')
        mensagem.email = request.POST.get('email')
        mensagem.assunto = request.POST.get('assunto')
        mensagem.mensagem = request.POST.get('mensagem')
        mensagem.save()
        return redirect('index')
    return render(request, 'contato.html')

def administrativo(request):
    return redirect('index')

def agenda(request):
    return redirect('index')