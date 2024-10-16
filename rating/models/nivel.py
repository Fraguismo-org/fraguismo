from django.db import models
from django.db.models import Subquery


class Nivel(models.Model):
    id = models.IntegerField(primary_key=True)
    nivel = models.CharField(max_length=20)
    pontuacao_base = models.IntegerField()

    def __str__(self):
        return f"{self.nivel} - {self.pontuacao_base}"
    
    def proximo_nivel(self):
        prx_nivel = Nivel.objects.filter(
                pontuacao_base__gt=self.pontuacao_base
            ).order_by('id').first()
        
        if prx_nivel is None:
            return self
        return prx_nivel
