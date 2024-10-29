from django.urls import path
from . import views

urlpatterns = [
    path('log_rating/', view=views.log_rating, name='logs'),
    path('add_rating/', view=views.add_rating_point, name='add'),
    path('register_activity/', view=views.register_activity, name='register_activity'),
    path('user_log_rating/', view=views.user_log_rating, name='user_log_rating'),
    # pendencias
    path('pendencias/user_pending/', view=views.user_pending, name='user_pending'),
    path('pendencias/add_pendencia/', view=views.add_pendencia, name='add_pendencia'),
    path('pendencias/remove_pendencia/<int:id>', view=views.remove_pendencia, name='remove_pendencia'),
    path('pendencias/edita_pendencia/<int:id>', view=views.edita_pendencia, name='edita_pendencia'),
]