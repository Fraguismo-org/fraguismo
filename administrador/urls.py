from django.urls import path

from administrador.views import (
    administrador_views,
    pendencias_administrador_views,
    valor_token_views,
)
from members.views import user_view



urlpatterns = [
    path('adm/', view=administrador_views.administrador, name='adm'),    
    path('pendencia_usuarios/<str:username>', view=pendencias_administrador_views.pendencia_usuario, name='pendencia_usuarios'),
    path('user_page/', user_view.user_page, name='user_page'),
    path('users/', user_view.lista_usuarios, name='lista_usuarios'),
    path('navigation/', view=administrador_views.navigation, name='navigation'),
]
