from django.urls import path

from rating.views.reinvindicar_pro_liberdade import ReinvindicarProLiberdadeView
from rating.views.aprovar_reinvindicacao import aprovar_reinvindicacao, remover_foto_pro_liberdade


urlpatterns = [
    path('reinvindicar/', view=ReinvindicarProLiberdadeView.as_view(), name='reinvindicar_pro_liberdade'),
    path('reinvindicar/<int:id>/', view=ReinvindicarProLiberdadeView.as_view(), name='editar_reinvindicacao'),
    path('aprovar-reinvindicacoes/', view=aprovar_reinvindicacao, name='aprovar_reinvindicacao'),
    path('aprovar-reinvindicacoes/<int:id>/', view=aprovar_reinvindicacao, name='aprovar_reinvindicacao_adm'),
    path('foto/<int:foto_id>/remover/', view=remover_foto_pro_liberdade, name='remover_foto_pro_liberdade'),
]
