from django.urls import path
from cursos import views
from cursos.models.curso import Curso

urlpatterns = [
    path('meus_cursos/', views.meus_cursos, name='meus_cursos'),
    path('add_certificados/', views.add_certificado, name='add_certificados'),
]
