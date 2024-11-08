from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from marketplace.models.anuncio import Anuncio


@login_required
def listar_anuncios(request):
    anuncios = Anuncio.objects.filter(user=request.user)
    return render(request, "anuncio/listar.html", {'anuncios': anuncios})

@login_required
def cadastrar_anuncio(request):
    if request.method == 'POST':
        Anuncio.cadastrar_novo()
        messages.success(request, "Anúncio cadastrado com sucesso!")
        return redirect('anuncio/listar.html')
    else:
        return render(request, "anuncio/cadastrar.html")


@login_required
def editar_anuncio(request, id: int):
    if request.method == 'POST':
        anuncio_id = request.POST.get('anuncio_id', None)
        if anuncio_id:
            anuncio = Anuncio.objects.get(id=anuncio_id)
            # TODO: edita anuncio
            messages.success(request, "Anúncio editado com sucesso!")
            return redirect('anuncio/listar.html')
        else:
            messages.error(request, "Anúncio não encontrado.")
            return redirect('anuncio/listar.html')
    if request.method == 'GET':        
        if id:
            anuncio = Anuncio.objects.get(id=id)
            return render(request, "anuncio/editar.html", anuncio)
        else:
            messages.error(request, "Anúncio não encontrado.")
            return redirect('anuncio/listar.html')
    return redirect('anuncio/listar.html')


@login_required
def deletar_anuncio(request, id: int):
    if request.method == 'POST':
        id = request.POST.get('anuncio_id', None)
        if id is None:
            messages(request, "Anúncio não encontrado.")
            return redirect('anuncio/listar.html')
        cod = request.POST.get('cod_anuncio', None)
        anuncio = Anuncio.objects.get(id=id)
        anuncio.remove()
        messages.success(request, f"Anúncio {cod} apagado com sucesso!")
        return redirect('anuncio/listar.html')
    if request.method == 'GET':
        try:
            anuncio = Anuncio.objects.get(id=id)
            return render(request, 'anuncio/deletar', {'anuncio': anuncio})
        except Anuncio.DoesNotExist:
            messages.error(request, "Anúncio não encontrado.")
            return redirect('anuncio/listar.html')
    return redirect('anuncio/listar.html')
