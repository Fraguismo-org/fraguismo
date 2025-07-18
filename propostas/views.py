from django.shortcuts import redirect, render

def propostas(request):
    return render(request, 'propostas.html')

# Create your views here.
