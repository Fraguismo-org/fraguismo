from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from marketplace.models.loja import Loja
from marketplace.forms.loja_form import LojaForm
from datetime import datetime


def listar_lojas(request):
    lojas = Loja.objects.filter(user=request.user)
    return render(request, "loja/listar.html", {'lojas': lojas})

@login_required
def cadastrar_loja(request):
    if request.method == 'POST':
        form = LojaForm(request.POST)
        if form.is_valid():
            loja = form.save(commit=False)
            loja.user = request.user
            if request.FILES:
                loja.logo = request.FILES['logo']
            loja.save()
            messages.success(request, "Loja cadastrada com sucesso!")
            return redirect('listar_lojas')
    else:
        form = LojaForm()
    return render(request, "loja/cadastrar.html", {'form': form})

@login_required
def editar_loja(request, loja_id: int):
    loja = get_object_or_404(Loja, id=loja_id, user=request.user)
    if request.method == 'POST':
        form = LojaForm(request.POST, instance=loja)
        if form.is_valid():
            form.save()
            messages.success(request, "Loja editada com sucesso!")
            return redirect('listar_lojas')
    else:
        form = LojaForm(instance=loja)
    return render(request, "loja/editar.html", {'form': form, 'loja': loja})

@login_required
def deletar_loja(request, loja_id: int):
    loja = get_object_or_404(Loja, id=loja_id, user=request.user)
    if request.method == 'POST':
        loja.delete()
        messages.success(request, "Loja deletada com sucesso!")
        return redirect('listar_lojas')
    return render(request, 'loja/deletar.html', {'loja': loja})


def page_loja(request, cod_loja):
    loja = get_object_or_404(Loja, cod_loja=cod_loja)
    return render(request, 'loja/page.html', {'loja': loja})
