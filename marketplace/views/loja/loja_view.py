from django.shortcuts import render, redirect
from marketplace.forms.loja_form import LojaForm
from marketplace.models.loja import Loja
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404

@login_required
def cadastrar_loja(request):
    if request.method == 'POST':
        form = LojaForm(request.POST)
        if form.is_valid():
            loja = form.save(commit=False)
            loja.profile = request.user.profile  # Atribui o perfil do usuário logado
            loja.save()
            messages.success(request, "Loja cadastrada com sucesso!")
            return redirect('listar_lojas')
    else:
        form = LojaForm()
    return render(request, 'Loja/cadastrar.html', {'form': form})


def listar_loja(request):
    anuncios = Loja.objects.filter(user=request.user)
    return render(request, "loja/listar.html", {'anuncios': anuncios})


@login_required
def editar_loja(request, loja_id):
    loja = get_object_or_404(Loja, id=loja_id)
    
    if request.method == 'POST':
        form = LojaForm(request.POST, instance=loja)
        if form.is_valid():
            form.save()
            messages.success(request, "Loja editada com sucesso!")
            return redirect('listar_lojas')
    else:
        form = LojaForm(instance=loja)
        
    return render(request, 'Loja/editar.html', {'form': form, 'loja': loja})


@login_required
def deletar_loja(request, loja_id):
    loja = get_object_or_404(Loja, id=loja_id)
    
    if request.method == 'POST':
        loja.delete()
        messages.success(request, "Loja deletada com sucesso!")
        return redirect('listar_lojas')
    
    return render(request, 'Loja/deletar.html', {'loja': loja})