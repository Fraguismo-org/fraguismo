from django.urls import include, path
from . import views

urlpatterns = [
    path('', views.propostas, name='propostas'),
    path('propostas/', views.criar_proposta, name='criar_proposta'),
    path('listar_propostas/', views.listar_propostas, name='listar_propostas'),
]