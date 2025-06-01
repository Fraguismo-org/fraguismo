from django.urls import include, path


urlpatterns = [
    path('', include('configuracoes.routes.configuracao_urls')),
]