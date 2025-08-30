from django.urls import path

from graca.views import consultas, graca_admin, tranca_distribuicao, votacao

urlpatterns = [
    path('consultas/', consultas, name='consultas'),
    path('votacao/', votacao, name='votacao'),
    path('tranca_distribuicao/', tranca_distribuicao, name='tranca_distribuicao'),
    path('graca_admin/', graca_admin, name='graca_admin'),
]