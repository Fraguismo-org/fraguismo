from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Q  
from marketplace.models.anuncio import Anuncio
from marketplace.forms.anuncio_form import AnuncioForm
from marketplace.models.image import Images
from marketplace.forms.image_form import ImagesForm
from members.models.profile import Profile
from members.models.users import Users
from datetime import datetime
from PIL import Image

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
    departamento = request.GET.get('departamento')  
    localidade = request.GET.get('localidade')  
    ordernar = request.GET.get('ordernar')  
    busca = request.GET.get('q')  
    page = request.GET.get('page', 1)  

    anuncios = Anuncio.objects.all()
    
    if departamento and departamento.isdigit():
        anuncios = anuncios.filter(departamento=int(departamento))
    
    if localidade and localidade != 'None':
        anuncios = anuncios.filter(localidade=localidade)
    
    if busca:
        anuncios = anuncios.filter(
            Q(titulo__icontains=busca) |
            Q(descricao__icontains=busca) |
            Q(localidade__icontains=busca)
        )

    if ordernar == 'data_asc':
        anuncios = anuncios.order_by('-created_at')
    elif ordernar == 'data_desc':
        anuncios = anuncios.order_by('created_at')
    elif ordernar == 'preco_asc':
        anuncios = anuncios.order_by('preco')
    elif ordernar == 'preco_desc':
        anuncios = anuncios.order_by('-preco')

    paginator = Paginator(anuncios, 6)  
    anuncios_paginados = paginator.get_page(page)
    
    localidades = Anuncio.objects.values_list('localidade', flat=True).distinct()

    return render(request, 'home.html', {
        'anuncios': anuncios_paginados,  
        'DEPARTAMENTOS': DEPARTAMENTOS,
        'localidades': localidades,  
        'selected_department': departamento,  
        'selected_localidade': localidade,  
        'selected_order': ordernar,  
        'search_query': busca,  
    })

@login_required
def listar_anuncios(request):
    anuncios = Anuncio.objects.filter(user=request.user)
    return render(request, "anuncio/listar.html", {'anuncios': anuncios})

@login_required(login_url='login')
def cadastrar_anuncio(request):
    anuncio_form = None
    imagem_form = None
    if request.method == 'POST':
        anuncio_form = AnuncioForm(request.POST)
        imagem_form = ImagesForm(request.POST)
        if anuncio_form.is_valid():
            anuncio = anuncio_form.save(commit=False)
            anuncio.user = request.user
            anuncio.save()
            if request.FILES:
                id = 1
                for imagem in request.FILES.getlist('images'):
                    imagem.name = str(anuncio.cod_anuncio) + str(id) + ".jpg"
                    id += 1
                    img = Images(image=imagem, anuncio=anuncio)
                    img.save()
                    img_obj = Image.open(img.image.path)
                    rate = img_obj.height/1000 if img_obj.height > img_obj.width else img_obj.width/1000
                    if img_obj.height > 1000 or img_obj.width > 1000:
                        output_size = (img_obj.width/rate, img_obj.height/rate)
                        img_obj.thumbnail(output_size)
                    img_obj.save(img.image.path)
            messages.success(request, "Anúncio cadastrado com sucesso!")
            return redirect('listar_anuncios')
    else:
        anuncio_form = AnuncioForm()
        imagem_form = ImagesForm()
    return render(request, "anuncio/cadastrar.html", {
        'anuncio_form': anuncio_form, 
        'images_form': imagem_form
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
