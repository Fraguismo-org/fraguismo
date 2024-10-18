from django.urls import path
from administrador import views


urlpatterns = [
    path('adm/', view=views.administrador, name='adm'),
]