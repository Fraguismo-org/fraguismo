from django.db import models


class Nivel(models.Model):
    id = models.IntegerField(primary_key=True)
    nivel = models.CharField(max_length=20)
    pontuacao_base = models.IntegerField()

    def __str__(self):
        return f"{self.nivel} - {self.pontuacao_base}"