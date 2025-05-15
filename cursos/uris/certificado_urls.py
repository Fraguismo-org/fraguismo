from django.urls import path
from cursos.views import certificado_views


urlpatterns = [
    path('add_certificados/', certificado_views.add_certificado, name='add_certificados'),
]