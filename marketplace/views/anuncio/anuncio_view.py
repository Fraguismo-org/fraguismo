from datetime import datetime

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect, render
from PIL import Image

from marketplace.forms.anuncio_form import AnuncioForm
from marketplace.forms.image_form import ImagesForm
from marketplace.models.anuncio import Anuncio
from marketplace.models.image import Images
from members.models.profile import Profile
from members.models.users import Users

DEPARTAMENTOS = [
    (0, "Outros"),
    (1, "Agro e industria"),
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


@login_required(login_url='login')
def listar_anuncios(request):
    busca = request.GET.get("busca", "").strip()
    status = request.GET.get("status", "")

    anuncios_qs = (
        Anuncio.objects.filter(user=request.user)
        .order_by("-updated_at", "-created_at")
    )

    if status and str(status).isdigit():
        anuncios_qs = anuncios_qs.filter(status_anuncio=int(status))

    if busca:
        anuncios_qs = anuncios_qs.filter(
            Q(titulo__icontains=busca)
            | Q(descricao__icontains=busca)
            | Q(cod_anuncio__icontains=busca)
            | Q(localidade__icontains=busca)
        )

    paginator = Paginator(anuncios_qs, 10)
    anuncios = paginator.get_page(request.GET.get("page", 1))

    return render(
        request,
        "anuncio/listar.html",
        {
            "anuncios": anuncios,
            "busca": busca,
            "status": status,
            "status_choices": Anuncio._meta.get_field("status_anuncio").choices,
        },
    )


@login_required(login_url='login')
def cadastrar_anuncio(request):
    anuncio_form = None
    imagem_form = None
    if request.method == 'POST':
        anuncio_form = AnuncioForm(request.POST)
        imagem_form = ImagesForm(request.POST, request.FILES)
        if anuncio_form.is_valid():
            anuncio = anuncio_form.save(commit=False)
            anuncio.user = request.user
            anuncio.updated_at = datetime.now()
            anuncio.save()
            if request.FILES:
                idx = 1
                for imagem in request.FILES.getlist('images'):
                    imagem.name = f"{anuncio.cod_anuncio}{idx}.jpg"
                    idx += 1
                    img = Images(image=imagem, anuncio=anuncio)
                    img.save()
                    img_obj = Image.open(img.image.path)
                    if img_obj.mode in ("RGBA", "P"):
                        img_obj = img_obj.convert("RGB")
                    rate = (
                        img_obj.height / 1000
                        if img_obj.height > img_obj.width
                        else img_obj.width / 1000
                    )
                    if img_obj.height > 1000 or img_obj.width > 1000:
                        output_size = (
                            img_obj.width / rate,
                            img_obj.height / rate
                        )
                        img_obj.thumbnail(output_size)
                    img_obj.save(
                        img.image.path,
                        format="JPEG",
                        quality=90
                    )
            messages.success(request, "Anuncio cadastrado com sucesso!")
            return redirect('listar_anuncios')

    else:
        anuncio_form = AnuncioForm()
        imagem_form = ImagesForm()

    return render(request, "anuncio/cadastrar.html", {
        'anuncio_form': anuncio_form,
        'images_form': imagem_form
    })


@login_required(login_url='login')
def editar_anuncio(request, id: int):
    anuncio = get_object_or_404(Anuncio, id=id, user=request.user)
    images = Images.objects.filter(anuncio=anuncio)

    if request.method == 'POST':
        form = AnuncioForm(request.POST, instance=anuncio)
        if form.is_valid():
            anuncio = form.save(commit=False)
            anuncio.updated_at = datetime.now()
            anuncio.save()

            for img in images:
                if request.POST.get(f"delete_image_{img.id}") == "on":
                    img.image.delete(save=False)
                    img.delete()

            new_files = request.FILES.getlist('images')
            if new_files:
                start_idx = anuncio.imagens.count() + 1
                for offset, imagem in enumerate(new_files, start=start_idx):
                    imagem.name = f"{anuncio.cod_anuncio}{offset}.jpg"
                    img = Images(image=imagem, anuncio=anuncio)
                    img.save()
                    img_obj = Image.open(img.image.path)
                    if img_obj.mode in ("RGBA", "P"):
                        img_obj = img_obj.convert("RGB")
                    rate = img_obj.height / 1000 if img_obj.height > img_obj.width else img_obj.width / 1000
                    if img_obj.height > 1000 or img_obj.width > 1000:
                        output_size = (img_obj.width / rate, img_obj.height / rate)
                        img_obj.thumbnail(output_size)
                    img_obj.save(img.image.path, format="JPEG", quality=90)

            messages.success(request, "Anuncio editado com sucesso!")
            return redirect('listar_anuncios')
        messages.error(request, "Erro ao editar o anuncio. Verifique os dados.")
        return redirect('editar_anuncio', id=id)

    form = AnuncioForm(instance=anuncio)
    return render(
        request,
        "anuncio/editar.html",
        {
            'form': form,
            'anuncio': anuncio,
            'images': images,
        }
    )


@login_required(login_url='login')
def deletar_anuncio(request, id: int):
    anuncio = get_object_or_404(Anuncio, id=id, user=request.user)

    if request.method == 'POST':
        cod = anuncio.cod_anuncio
        anuncio.delete()
        messages.success(request, f"Anuncio {cod} apagado com sucesso!")
        return redirect('listar_anuncios')

    if request.method == 'GET':
        return render(request, 'anuncio/deletar.html', {'anuncio': anuncio})

    return redirect('listar_anuncios')

def page_anuncio(request, cod_anuncio):
    anuncio = Anuncio.objects.get(cod_anuncio=cod_anuncio)

    member = Users.objects.get(user_ptr=anuncio.user)
    profile = Profile.get_or_create_profile(member)

    imagens = Images.objects.filter(anuncio=anuncio)

    return render(request, 'anuncio/page.html', {
        'anuncio': anuncio,
        'imagens': imagens,
        'profile': profile,
        'member': member,
    })
