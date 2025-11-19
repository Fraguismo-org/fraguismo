from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from log.views import errors_views



urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('site_fraguismo.urls')),
    path('members/', include('django.contrib.auth.urls')),
    path('members/', include('members.urls')),
    path('rating/', include('rating.urls')),
    path('administrador/', include('administrador.urls')),
    path('cursos/', include('cursos.urls')),
    path('marketplace/', include('marketplace.urls')),
    path('config/', include('configuracoes.urls')),
    path('propostas/', include('propostas.urls')),
    path('dao/', include('fraguismo_dao.urls')),
]

handler404 = errors_views.custom_page_not_found_view
handler500 = errors_views.custom_server_error_view
handler403 = errors_views.custom_permission_denied_view
handler400 = errors_views.custom_bad_request_view


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)