from django.urls import path
from fraguismo_dao.views import fraguismo_dao

urlpatterns = [
    path('app/', fraguismo_dao, name='dao'),
]
