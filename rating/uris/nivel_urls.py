from django.urls import path
from rating.views import nivel_views


urlpatterns = [
    path('/alterar_nivel', view=nivel_views.alterar_nivel, name='alterar_nivel'),
]