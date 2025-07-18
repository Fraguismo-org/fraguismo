from django.urls import include, path
from . import views

urlpatterns = [
    path('', views.propostas, name='propostas'),
]