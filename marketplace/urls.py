from django.urls import path
from marketplace.views.home import *
from marketplace.views.anuncio.anuncio_view import *

urlpatterns = [
    path('home/', view=home, name='home'),

    path('anuncio/listar/', view=listar_anuncios, name='listar_anuncios'),
    path('anuncio/cadastrar/', view=cadastrar_anuncio, name='cadastrar_anuncio'),
    path('anuncio/editar/<int:id>', view=editar_anuncio, name='editar_anuncio'),
    path('anuncio/deletar/<int:id>', view=deletar_anuncio, name='deletar_anuncio'),
]