from django.urls import path
from . import views

urlpatterns = [
    path('log_rating/', view=views.log_rating, name='logs'),
    path('add_rating/', view=views.add_rating_point, name='add'),
    path('register_activity/', view=views.register_activity, name='register'),
]