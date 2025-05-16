from django.urls import path
from members.views import profile_view


urlpatterns = [
    path('profile/<str:username>', profile_view.profile, name='profile'),
]