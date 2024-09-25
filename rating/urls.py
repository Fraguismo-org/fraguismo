from django.urls import path
from . import views

urlpatterns = [
    path('log_rating/', view=views.log_rating, name='logs'),
    path('add_rating/', view=views.add_rating_point, name='add'),
    path('register_activity/', view=views.register_activity, name='register_activity'),
    path('user_log_rating/', view=views.user_log_rating, name='user_log_rating'),
    path('user_pending/', view=views.user_pending, name='user_pending'),
    path('add_pending/', view=views.add_pending, name='add_pending'),
]