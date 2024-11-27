from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.paginator import Paginator
from marketplace.models.anuncio import Anuncio
from marketplace.forms.anuncio_form import AnuncioForm
from marketplace.models.image import Images
from marketplace.forms.image_form import ImagesForm
from members.models.profile import Profile
from members.models.users import Users
from datetime import datetime

DEPARTAMENTOS = [
    (0, "Outros"),
    (1, "Agro e indústria"),
    (2, "Alimentação"),
    (3, "Autos e peças"),
    (4, "Eletrônicos e celulares"),
    (5, "Esportes e lazer"),
    (6, "Imóveis"),
    (7, "Moda e beleza"),
    (8, "Músicas e hobbies"),
    (9, "Para a sua casa"),
    (10, "Prestação de Serviços"),
    (11, "Vagas de emprego"),
]

def home(request):
    departamento = request.GET.get('departamento')  # Obtém o departamento selecionado
    localidade = request.GET.get('localidade')  # Obtém a localidade selecionada
    ordernar = request.GET.get('ordernar')  # Obtém o critério de ordenação
    page = request.GET.get('page', 1)  # Obtém o número da página atual

    # Base queryset
    anuncios = Anuncio.objects.all()

    # Filtrar por departamento se válido
    if departamento and departamento.isdigit():
        anuncios = anuncios.filter(departamento=int(departamento))

    # Filtrar por localidade se válido
    if localidade and localidade != 'None':
        anuncios = anuncios.filter(localidade=localidade)

    # Ordenação
    if ordernar == 'data_asc':
        anuncios = anuncios.order_by('-created_at')
    elif ordernar == 'data_desc':
        anuncios = anuncios.order_by('created_at')
    elif ordernar == 'preco_asc':
        anuncios = anuncios.order_by('preco')
    elif ordernar == 'preco_desc':
        anuncios = anuncios.order_by('-preco')

    # Paginação
    paginator = Paginator(anuncios, 6)  # Mostra 6 anúncios por página
    anuncios_paginados = paginator.get_page(page)

    # Obter localidades únicas para o filtro
    localidades = Anuncio.objects.values_list('localidade', flat=True).distinct()

    return render(request, 'home.html', {
        'anuncios': anuncios_paginados,  # Use os anúncios paginados
        'DEPARTAMENTOS': DEPARTAMENTOS,
        'localidades': localidades,  # Passar as localidades para o template
        'selected_department': departamento,  # Passar o departamento selecionado
        'selected_localidade': localidade,  # Passar a localidade selecionada
        'selected_order': ordernar,  # Passar a ordenação selecionada
    })



@login_required
def listar_anuncios(request):
    anuncios = Anuncio.objects.filter(user=request.user)
    return render(request, "anuncio/listar.html", {'anuncios': anuncios})


@login_required
def cadastrar_anuncio(request):
    if request.method == 'POST':
        anuncio_form = AnuncioForm(request.POST)
        imagem_form = ImagesForm(request.POST)
        if anuncio_form.is_valid():
            anuncio = anuncio_form.save(commit=False)
            anuncio.user = request.user
            anuncio.save()
            if request.FILES:
                for image in request.FILES.getlist('images'):
                    img = Images(image=image, anuncio=anuncio)
                    img.save()
            messages.success(request, "Anúncio cadastrado com sucesso!")
            return redirect('listar_anuncios')
    else:
        anuncio_form = AnuncioForm()
        images_form = ImagesForm()
    return render(request, "anuncio/cadastrar.html", {
        'anuncio_form': anuncio_form, 
        'images_form': images_form
    })


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
