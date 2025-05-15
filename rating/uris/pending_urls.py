from django.urls import path

from rating.views import pendings_views


urlpatterns = [
    path('pendencias/my_pendings', view=pendings_views.user_pending, name='my_pendings'),
    path('pendencias/user_pending/<str:username>', view=pendings_views.user_pending, name='user_pending'),
    path('pendencias/add_pendencia/', view=pendings_views.add_pendencia, name='add_pendencia'),
    path('pendencias/remove_pendencia/<int:id>', view=pendings_views.remove_pendencia, name='remove_pendencia'),
    path('pendencias/edita_pendencia/<int:id>', view=pendings_views.edita_pendencia, name='edita_pendencia'),
    path('pendencias/add_pendencia_usuario/<int:id>', view=pendings_views.add_pendencia_usuario, name='add_pendencia_usuario'),
    path('pendencias/finaliza_pendencia_usuario/<int:profile_pendencia_id>', view=pendings_views.finaliza_pendencia_usuario, name='finaliza_pendencia_usuario'),
    path('pendencias/remove_pendencia_usuario/<int:profile_pendencia_id>', view=pendings_views.remove_pendencia_usuario, name='remove_pendencia_usuario'),
]