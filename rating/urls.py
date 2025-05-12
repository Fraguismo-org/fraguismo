from django.urls import path
from . import views

urlpatterns = [
    path('log_rating/', view=views.log_rating, name='logs'),
    path('add_rating/', view=views.add_rating_point, name='add'),
    path('register_activity/', view=views.register_activity, name='register_activity'),
    path('user_log_rating/', view=views.user_log_rating, name='user_log_rating'),
    path('editar_pontuacao/<int:user_id>', view=views.editar_pontuacao, name='editar_pontuacao'),
    # pendencias
    path('pendencias/my_pendings', view=views.user_pending, name='my_pendings'),
    path('pendencias/user_pending/<str:username>', view=views.user_pending, name='user_pending'),
    path('pendencias/add_pendencia/', view=views.add_pendencia, name='add_pendencia'),
    path('pendencias/remove_pendencia/<int:id>', view=views.remove_pendencia, name='remove_pendencia'),
    path('pendencias/edita_pendencia/<int:id>', view=views.edita_pendencia, name='edita_pendencia'),
    path('pendencias/add_pendencia_usuario/<int:id>', view=views.add_pendencia_usuario, name='add_pendencia_usuario'),
    path('pendencias/finaliza_pendencia_usuario/<int:profile_pendencia_id>', view=views.finaliza_pendencia_usuario, name='finaliza_pendencia_usuario'),
    path('pendencias/remove_pendencia_usuario/<int:profile_pendencia_id>', view=views.remove_pendencia_usuario, name='remove_pendencia_usuario'),    
]