from django.db import models
from django.utils import timezone
from members.models import User


class Atividade(models.Model):
    id = models.AutoField(primary_key=True)
    nome_atividade = models.CharField(max_length=50)
    pontuacao = models.IntegerField()
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)

class LogRating(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    pontuacao_ganha = models.IntegerField(default=0)
    pontuacao = models.IntegerField(default=0)
    atividade = models.ForeignKey(Atividade, on_delete=models.CASCADE, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.IntegerField(default=0)
    
    def __str__(self) -> str:
        local_time = timezone.localtime(self.updated_at)
        return f'{self.user_id} | pontuacao total: {self.pontuacao + self.pontuacao_ganha} | {self.atividade.nome_atividade} | {local_time}'
