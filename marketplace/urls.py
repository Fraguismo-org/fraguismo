from django.urls import path
from marketplace.views.home import *
from marketplace.views.anuncio.anuncio_view import *
from marketplace.views.loja.loja_view import *

urlpatterns = [
    path('home/', view=home, name='home'),

    path('anuncio/listar/', view=listar_anuncios, name='listar_anuncios'),
    path('anuncio/cadastrar/', view=cadastrar_anuncio, name='cadastrar_anuncio'),
    path('anuncio/editar/<int:id>', view=editar_anuncio, name='editar_anuncio'),
    path('anuncio/deletar/<int:id>', view=deletar_anuncio, name='deletar_anuncio'),
    path('anuncio/page/<str:cod_anuncio>', view=page_anuncio, name='page_anuncio'),

    path('loja/listar/', view=listar_loja, name='listar_loja'),
    path('loja/cadastrar/', view=cadastrar_loja, name='cadastrar_loja'),
    path('loja/editar/<int:loja_id>/', editar_loja, name='editar_loja'),
    path('loja/deletar/<int:loja_id>/', deletar_loja, name='deletar_loja'),
    path('loja/page/<uuid:cod_loja>/', page_loja, name='page_loja'),
]