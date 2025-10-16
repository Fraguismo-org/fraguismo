from django.urls import path

from graca.views import consultas, graca_admin, sacar_pol, tranca_distribuicao, votacao

urlpatterns = [
    path('consultas/', consultas, name='consultas'),
    path('sacar_pol/', sacar_pol, name='sacar_pol'),
    path('votacao/', votacao, name='votacao'),
    path('tranca_distribuicao/', tranca_distribuicao, name='tranca_distribuicao'),
    path('graca_admin/', graca_admin, name='graca_admin'),
]