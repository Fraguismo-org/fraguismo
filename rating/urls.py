from django.urls import path, include


urlpatterns = [
    path('', include('rating.uris.log_rating_urls')),
    path('', include('rating.uris.atividade_urls')),
    path('', include('rating.uris.pending_urls')),
    path('', include('rating.uris.pontuacao_urls')),
    path('', include('rating.uris.nivel_urls')),
]
