from django.urls import path
from members.views import preferencias_views


urlpatterns = [
    path('configuracao/', preferencias_views.preferencias, name='configuracao'),
]