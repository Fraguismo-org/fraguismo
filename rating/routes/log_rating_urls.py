from django.urls import path

from rating.views import log_rating_views


urlpatterns = [
    path('log_rating/', view=log_rating_views.log_rating, name='logs'),
    path('add_rating/', view=log_rating_views.add_rating_point, name='add'),
    path('user_log_rating/<str:username>', view=log_rating_views.user_log_rating, name='user_log_rating'),
    path('user_log_rating/', view=log_rating_views.user_log_rating, name='user_log_rating'),
]