from django.db import models
from django.contrib.auth.models import User

class PreferenciaUsuario(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    mostra_email = models.BooleanField(default=True)
    mostra_nome = models.BooleanField(default=True)
    mostra_localidade = models.BooleanField(default=True)
    mostra_telefone = models.BooleanField(default=True)
    mostra_instagram = models.BooleanField(default=True)
    mostra_aniversario = models.BooleanField(default=True)
    mostra_profissao = models.BooleanField(default=True)
    mostra_carteira_polygon = models.BooleanField(default=True)
    mostra_carteira_lightining = models.BooleanField(default=True)

    def __str__(self):
        return f'Preferências de {self.usuario.username}'
