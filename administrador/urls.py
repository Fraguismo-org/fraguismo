from django.urls import path
from administrador.views import (
    administrador_views,
    pendencias_administrador_views,
)


urlpatterns = [
    path('adm/', view=administrador_views.administrador, name='adm'),    
    path('pendencia_usuarios/<str:username>', view=pendencias_administrador_views.pendencia_usuario, name='pendencia_usuarios'),
]