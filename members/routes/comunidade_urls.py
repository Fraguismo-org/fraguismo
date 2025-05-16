from django.urls import path
from members.views import user_view

urlpatterns = [
    path('comunidade/', user_view.comunidade, name='comunidade'),
]