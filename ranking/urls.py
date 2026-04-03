from django.urls import path

from ranking.views import ranking_views


urlpatterns = [
    path('ranking_liberdade/', view=ranking_views.ranking_liberdade, name='ranking_liberdade'),
]