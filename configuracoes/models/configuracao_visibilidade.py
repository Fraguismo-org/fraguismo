from django.db import models
from django.contrib.auth.models import User


class ConfiguracaoVisibilidade(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.BooleanField(default=True)
    nome = models.BooleanField(default=True)
    sobrenome = models.BooleanField(default=True)
    localidade = models.BooleanField(default=True)
    telefone = models.BooleanField(default=True)
    instagram = models.BooleanField(default=True)
    aniversario = models.BooleanField(default=True)
    profissao = models.BooleanField(default=True)
    polygon = models.BooleanField(default=True)
    lightining = models.BooleanField(default=True)
    idade = models.BooleanField(default=True)

    def __str__(self):
        return f'Configurações de visibilidade de {self.usuario.username}'
    
    class Meta:
        verbose_name = 'Configuracao de Visibilidade'
        verbose_name_plural = 'Configurações de Visibilidade'