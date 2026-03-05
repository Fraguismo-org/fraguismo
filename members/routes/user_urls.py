from django.urls import path
from members.views import user_view


urlpatterns = [
    path('user_page/', user_view.user_page, name='user_page'),
    path('users/', user_view.lista_usuarios, name='lista_usuarios'),
    path('users_adm/', user_view.lista_usuarios_adm, name='lista_usuarios_adm'),
    path("marcar_contato/<int:questionario_id>/", user_view.marcar_contato, name="marcar_contato"),
    path("desmarcar-contato/<int:questionario_id>/", user_view.desmarcar_contato, name="desmarcar_contato"),
]