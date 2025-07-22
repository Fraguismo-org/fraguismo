from django.db import models
from django.contrib.auth.models import User

class Proposta(models.Model):
    titulo = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    arquivo = models.FileField(upload_to='propostas/')
    hash_arquivo = models.CharField(max_length=64, blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo
    
class Voto(models.Model):
    proposta = models.ForeignKey('Proposta', on_delete=models.CASCADE, related_name='votos')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    votos = models.BooleanField()  # True = a favor, False = contra
    data = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('proposta', 'usuario')