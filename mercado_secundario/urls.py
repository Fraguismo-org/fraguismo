from django.urls import path

from mercado_secundario.views import comprar_token, funcao_arbitro, funcao_comprador, funcao_disputa, funcao_vendedor


urlpatterns = [
    path('funcao_arbitro/', funcao_arbitro, name='funcao_arbitro'),
    path('funcao_arbitro/<int:ordem_id>', funcao_arbitro, name='funcao_arbitro'),
    path('funcao_comprador/', funcao_comprador, name='funcao_comprador'),
    path('funcao_vendedor/', funcao_vendedor, name='funcao_vendedor'),
    path('funcao_disputa/', funcao_disputa, name='funcao_disputa'),
    path('funcao_disputa/<int:ordem_id>', funcao_disputa, name='funcao_disputa'),
    path('comprar_token/', comprar_token, name='comprar_token'),
]