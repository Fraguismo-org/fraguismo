from django.urls import path
from cursos import views
from cursos.models.curso import Curso

urlpatterns = [
    path('lista_cursos/<str:username>', views.lista_cursos, name='lista_cursos'),
    path('add_certificados/', views.add_certificado, name='add_certificados'),
]
