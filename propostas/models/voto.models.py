from django.db import models
from django.contrib.auth.models import User


class Voto(models.Model):
    proposta = models.ForeignKey('Proposta', on_delete=models.CASCADE, related_name='votos')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    votos = models.BooleanField()  # True = a favor, False = contra
    data = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('proposta', 'usuario')