from django.db import models
from rating.models.nivel import Nivel


class Pendencia(models.Model):
    id = models.IntegerField(primary_key=True)
    nivel = models.ForeignKey(Nivel, on_delete=models.CASCADE)
    pedencia = models.CharField(max_length=50)
    