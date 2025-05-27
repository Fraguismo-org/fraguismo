from django.urls import path
from django.urls import include, path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('codigo_conduta/', views.codigo_conduta, name='codigo_conduta'),
    path('termos_condicoes/', views.termos_condicoes, name='termos_condicoes'),
    path('marketplace/', include('marketplace.urls')),

    path('sobre_nos/', views.sobre_nos, name='sobre_nos'),
    path('contato/', views.contato, name='contato'),
    path('administrativo/', views.administrativo, name='administrativo'),
    path('agenda/', views.agenda, name='agenda'),
    path('leinatural/', views.leinatural, name='leinatural'),
    path('dao/', views.dao, name='dao'),
    path('daoregras/', views.daoregras, name='daoregras'),
    path('hierarquia/', views.hierarquia, name='hierarquia'),
    path('cursofraguista/', views.cursofraguista, name='cursofraguista'),    
]
