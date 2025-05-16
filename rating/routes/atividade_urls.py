from django.urls import path

from rating.views import atividade_views

urlpatterns = [
    path('register_activity/', view=atividade_views.register_activity, name='register_activity'),
]