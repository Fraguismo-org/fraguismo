from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from marketplace.models.anuncio import Anuncio
from marketplace.forms.anuncio_form import AnuncioForm
from marketplace.models.image import Images
from members.models.profile import Profile
from members.models.users import Users
from datetime import datetime


@login_required
def listar_anuncios(request):
    anuncios = Anuncio.objects.filter(user=request.user)
    return render(request, "anuncio/listar.html", {'anuncios': anuncios})

@login_required
def cadastrar_anuncio(request):
    if request.method == 'POST':
        form = AnuncioForm(request.POST)
        if form.is_valid():
            anuncio = form.save(commit=False)
            anuncio.user = request.user
            anuncio.save()
            messages.success(request, "Anúncio cadastrado com sucesso!")
            return redirect('listar_anuncios')
    else:
        form = AnuncioForm()
    return render(request, "anuncio/cadastrar.html", {'form': form})


@login_required
def editar_anuncio(request, id: int):
    if request.method == 'POST':
        form = AnuncioForm(request.POST)
        if form.is_valid() and id:
            anuncio = Anuncio.objects.get(id=id)
            anuncio.titulo = form.cleaned_data['titulo']
            anuncio.descricao = form.cleaned_data['descricao']
            anuncio.preco = form.cleaned_data['preco']
            anuncio.status_anuncio = form.cleaned_data['status_anuncio']
            anuncio.updated_at = datetime.now()
            try:
                anuncio.save()
                messages.success(request, "Anúncio editado com sucesso!")
            except:
                messages.error(request, "Erro ao editar o anuncio.")
            finally:
                return redirect('listar_anuncios')            
        else:
            messages.error(request, "Anúncio não encontrado.")
            return redirect('listar_anuncios')
    if request.method == 'GET':        
        if id:
            anuncio = Anuncio.objects.get(id=id)
            form = AnuncioForm(instance=anuncio)
            images = Images.objects.filter(anuncio=anuncio)
            return render(
                request, 
                "anuncio/editar.html",
                {
                    'form': form,
                    'anuncio': anuncio,
                    'images': images,
                }
            )
        else:
            messages.error(request, "Anúncio não encontrado.")
            return redirect('listar_anuncios')
    return redirect('listar_anuncios')


@login_required
def deletar_anuncio(request, id: int):
    if request.method == 'POST':
        if id is None:
            messages(request, "Anúncio não encontrado.")
            return redirect('listar_anuncios')        
        anuncio = Anuncio.objects.get(id=id)
        cod = anuncio.cod_anuncio
        anuncio.delete()
        messages.success(request, f"Anúncio {cod} apagado com sucesso!")
        return redirect('listar_anuncios')
    if request.method == 'GET':
        try:
            anuncio = Anuncio.objects.get(id=id)
            return render(request, 'anuncio/deletar.html', {'anuncio': anuncio})
        except Anuncio.DoesNotExist:
            messages.error(request, "Anúncio não encontrado.")
            return redirect('listar_anuncios')
    return redirect('listar_anuncios')

def page_anuncio(request, cod_anuncio):
    anuncio = Anuncio.objects.get(cod_anuncio=cod_anuncio)
    profile = Profile.get_or_create_profile(anuncio.user)
    member = Users.objects.get(user_ptr_id=anuncio.user)
    imagens = Images.objects.filter(anuncio=anuncio)
    return render(request, 'anuncio/page.html', {
        'anuncio': anuncio, 
        'imagens': imagens,
        'profile': profile,
        'member': member,
    })
