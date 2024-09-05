from django.db import models


class Squad(models.Model):
    id = models.IntegerField(primary_key=True)
    squad_nome = models.CharField(max_length=50)
    grupo_url = models.CharField(max_length=256)

    def __str__(self) -> str:
        return f"{self.squad_nome} - {self.grupo_url}"