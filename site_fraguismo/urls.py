from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('codigo_conduta/', views.codigo_conduta, name='codigo_conduta'),
    path('termos_condicoes/', views.termos_condicoes, name='termos_condicoes'),
]
