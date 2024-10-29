from django.urls import path
from administrador import views


urlpatterns = [
    path('adm/', view=views.administrador, name='adm'),
    path('lista_usuarios/', view=views.lista_usuarios, name='lista_usuarios'),
    path('pendencia_usuarios/<str:username>', view=views.pendencia_usuario, name='pendencia_usuarios'),
]