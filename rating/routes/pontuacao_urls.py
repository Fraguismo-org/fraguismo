from django.urls import path
from rating.views import pontuacao_views


urlpatterns = [
    path('editar_pontuacao/<int:user_id>', view=pontuacao_views.editar_pontuacao, name='editar_pontuacao'),
]