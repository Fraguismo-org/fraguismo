from django.urls import include, path

from propostas.views.token_views import config_owner, operacoes_token, proposer
from .views.proposta_views import propostas, create_proposal, show_proposal, details_proposal, vote_proposal

urlpatterns = [
    path('', propostas, name='propostas'),
    path('propostas/', create_proposal, name='create_proposal'),
    path('listar_propostas/', show_proposal, name='show_proposal'),
    path('details_proposal/<int:proposta_id>/', details_proposal, name='details_proposal'),
    path('votar/<int:proposta_id>/', vote_proposal, name='vote_proposal'),
    path('operacoes_token/', operacoes_token, name='operacoes_token'),
    path('proposer/', proposer, name='proposer'),
    path('config_owner/', config_owner, name='config_owner'),
]