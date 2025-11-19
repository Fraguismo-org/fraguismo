from django.urls import include, path

from propostas.views.proposta_views import create_proposal, details_proposal, propostas, show_proposal, vote_proposal

urlpatterns = [
    path('', propostas, name='propostas'),
    path('propostas/', create_proposal, name='create_proposal'),
    path('listar_propostas/', show_proposal, name='show_proposal'),
    path('details_proposal/<int:proposta_id>/', details_proposal, name='details_proposal'),
    path('votar/<int:proposta_id>/', vote_proposal, name='vote_proposal'),
]