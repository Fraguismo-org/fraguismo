from django.db import models

class Proposta(models.Model):
    titulo = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    arquivo = models.FileField(upload_to='propostas/')
    hash_arquivo = models.CharField(max_length=64, blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo