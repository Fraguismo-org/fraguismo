from django.urls import path
from members.views import (
    auth_view,
    profile_view,
    user_view
)
from django.contrib.auth.views import (
    LogoutView, 
    PasswordResetView, 
    PasswordResetDoneView, 
    PasswordResetConfirmView,
    PasswordResetCompleteView
)

urlpatterns = [
    path('login_user/', auth_view.login_user, name='login'),
    path('logout_user/', auth_view.logout_user, name='logout'),
    path('register_user/', auth_view.register_user, name='register'),
    path('user_page/', user_view.user_page, name='user_page'),
    path('profile/<str:username>', profile_view.profile, name='profile'),
    path('comunidade/', user_view.comunidade, name='comunidade'),
    
    # URLs para redefinição de senha
    path('password-reset/', PasswordResetView.as_view(template_name='authenticate/password-reset.html'), name='password-reset'),
    path('password-reset-done/', PasswordResetDoneView.as_view(template_name='authenticate/password-reset-done.html'), name='password_reset_done'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(template_name='authenticate/password_reset_confirm.html'), name='password_reset_confirm'),
    path('password-reset-complete/', PasswordResetCompleteView.as_view(template_name='authenticate/password-reset-complete.html'), name='password_reset_complete'),
]
