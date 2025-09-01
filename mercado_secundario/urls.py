from django.urls import path

from mercado_secundario.views import funcao_arbitro, funcao_comprador, funcao_disputa, funcao_vendedor


urlpatterns = [
    path('funcao_arbitro/', funcao_arbitro, name='funcao_arbitro'),
    path('funcao_comprador/', funcao_comprador, name='funcao_comprador'),
    path('funcao_vendedor/', funcao_vendedor, name='funcao_vendedor'),
    path('funcao_disputa/', funcao_disputa, name='funcao_disputa'),
]