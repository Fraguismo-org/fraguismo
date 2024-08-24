from django.http import HttpResponse
from django.shortcuts import redirect
from django.template import loader


def index(request):    
    return redirect('https://fraguismo.org')
