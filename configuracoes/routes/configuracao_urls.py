from django.urls import path
from configuracoes.views import configuracao_views, visibilidade_views


urlpatterns = [
    path('preferencias/', configuracao_views.configuracoes, name='preferencias'),
    path('visibilidade/<int:user_id>', visibilidade_views.salva_configuracoes, name='visibilidade'),
]