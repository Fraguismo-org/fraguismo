from django.urls import include, path
from . import views

urlpatterns = [
    path('', views.propostas, name='propostas'),
    path('propostas/', views.create_proposal, name='create_proposal'),
    path('listar_propostas/', views.show_proposal, name='show_proposal'),
    path('detalhes_proposta/', views.details_proposal, name='details_propostas'),
]