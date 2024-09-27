from django.urls import path
from members import views
from django.contrib.auth.views import (
    LogoutView, 
    PasswordResetView, 
    PasswordResetDoneView, 
    PasswordResetConfirmView,
    PasswordResetCompleteView
)

urlpatterns = [
    path('login_user/', views.login_user, name='login'),
    path('logout_user/', views.logout_user, name='logout'),
    path('register_user/', views.register_user, name='register'),
    path('user_page/', views.user_page, name='user_page'),
    path('comunidade/', views.comunidade, name='comunidade'),
    
    # URLs para redefinição de senha
    path('password-reset/', PasswordResetView.as_view(template_name='authenticate/password-reset.html'), name='password-reset'),
    path('password-reset-done/', PasswordResetDoneView.as_view(template_name='authenticate/password-reset-done.html'), name='password_reset_done'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(template_name='authenticate/password_reset_confirm.html'), name='password_reset_confirm'),
    path('password-reset-complete/', PasswordResetCompleteView.as_view(template_name='authenticate/password-reset-complete.html'), name='password_reset_complete'),
]
