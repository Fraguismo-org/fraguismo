from django.urls import path, include


urlpatterns = [
    path('', include('rating.routes.log_rating_urls')),
    path('', include('rating.routes.atividade_urls')),
    path('', include('rating.routes.pending_urls')),
    path('', include('rating.routes.pontuacao_urls')),
    path('', include('rating.routes.nivel_urls')),
]
