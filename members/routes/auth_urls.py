from django.urls import path
from members.views import auth_view

urlpatterns = [
    path('login_user/', auth_view.login_user, name='login'),
    path('logout_user/', auth_view.logout_user, name='logout'),
    path('register_user/', auth_view.register_user, name='register'),
]