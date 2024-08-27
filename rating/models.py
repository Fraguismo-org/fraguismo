from datetime import datetime
from django.db import models
from django.contrib.auth.models import User


class LogRating(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    pontuacao = models.IntegerField(default=0)
    pontuacao_ganha = models.IntegerField(default=0)
    nome_atividade = models.CharField(max_length=50, blank=True)
    updated_at = models.DateTimeField(default=datetime.now)

    def __str__(self) -> str:
        return f'{self.user_id} | pontuacao total: {self.pontuacao + self.pontuacao_ganha} | {self.nome_atividade} | {self.updated_at}'


