from django.urls import path

from cursos.views import cursos_views


urlpatterns = [
    path('lista_cursos/<str:username>', cursos_views.lista_cursos, name='lista_cursos'),
]