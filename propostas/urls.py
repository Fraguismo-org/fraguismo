from django.urls import include, path
from . import views

urlpatterns = [
    path('', views.propostas, name='propostas'),
    path('propostas/', views.criar_proposta, name='criar_proposta'),
]