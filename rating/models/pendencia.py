from django.db import models
from rating.models.nivel import Nivel


class Pendencia(models.Model):
    id = models.AutoField(primary_key=True)
    nivel = models.ForeignKey(Nivel, on_delete=models.CASCADE)
    pendencia = models.CharField(max_length=50)
    