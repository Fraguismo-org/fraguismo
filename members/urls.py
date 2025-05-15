from django.urls import path, include
from django.contrib.auth.views import (
    LogoutView, 
    PasswordResetView, 
    PasswordResetDoneView, 
    PasswordResetConfirmView,
    PasswordResetCompleteView
)

urlpatterns = [
    path('', include('members.uris.auth_urls')),
    path('', include('members.uris.user_urls')),
    path('', include('members.uris.profile_urls')),
    path('', include('members.uris.comunidade_urls')),
    path('', include('members.uris.preferencias_urls')),
    
    # URLs para redefinição de senha
    path('password-reset/', PasswordResetView.as_view(template_name='authenticate/password-reset.html'), name='password-reset'),
    path('password-reset-done/', PasswordResetDoneView.as_view(template_name='authenticate/password-reset-done.html'), name='password_reset_done'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(template_name='authenticate/password_reset_confirm.html'), name='password_reset_confirm'),
    path('password-reset-complete/', PasswordResetCompleteView.as_view(template_name='authenticate/password-reset-complete.html'), name='password_reset_complete'),
]
