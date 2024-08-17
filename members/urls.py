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
    path('user_page/', views.user_page, name='user'),
    
    # URLs para redefinição de senha
    path('password-reset/', PasswordResetView.as_view(template_name='authenticate/password-reset.html'), name='password-reset'),
    path('password-reset-done/', PasswordResetDoneView.as_view(template_name='authenticate/password-reset-done.html'), name='password-reset-done'),
    path('reset/<uidb64>/<token>/', PasswordResetConfirmView.as_view(template_name='authenticate/password-reset-confirm.html'), name='password-reset-confirm'),
    path('reset/done/', PasswordResetCompleteView.as_view(template_name='authenticate/password-reset-complete.html'), name='password-reset-complete'),
]
