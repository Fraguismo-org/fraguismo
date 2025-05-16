from django.urls import path, include


urlpatterns = [
    path('', include('cursos.routes.curso_urls')),
    path('', include('cursos.routes.certificado_urls')),
]
