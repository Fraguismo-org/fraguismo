from django.urls import include, path
from . import views

urlpatterns = [
    path('', views.propostas, name='propostas'),
    path('propostas/', views.create_proposal, name='create_proposal'),
    path('listar_propostas/', views.show_proposal, name='show_proposal'),
    path('details_proposal/<int:proposta_id>/', views.details_proposal, name='details_proposal'),
    path('votar/<int:proposta_id>/', views.vote_proposal, name='vote_proposal'),
]