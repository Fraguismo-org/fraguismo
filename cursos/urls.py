from django.urls import path, include


urlpatterns = [
    path('', include('cursos.uris.curso_urls')),
    path('', include('cursos.uris.certificado_urls')),
]
