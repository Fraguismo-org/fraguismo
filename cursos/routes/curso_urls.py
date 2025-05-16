from django.urls import path

from cursos.views import cursos_views


urlpatterns = [
    path('lista_cursos/<str:username>', cursos_views.lista_cursos, name='lista_cursos'),
    path('remove_curso', cursos_views.remove_curso, name='remove_curso'),
]