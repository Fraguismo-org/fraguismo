from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.template import loader


def index(request):    
    return redirect('https://fraguismo.org')

def codigo_conduta(request):
    return render(request, 'Regras/codigo_conduta.html')

def termos_condicoes(request):
    return render(request, 'Regras/termos_condicoes.html')