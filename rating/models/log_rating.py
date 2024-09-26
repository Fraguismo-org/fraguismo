from django.db import models
from django.utils import timezone
from members.models.users import User
from rating.models.atividade import Atividade


class LogRating(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    pontuacao_ganha = models.IntegerField(default=0)
    pontuacao = models.IntegerField(default=0)
    atividade = models.ForeignKey(Atividade, on_delete=models.CASCADE, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.IntegerField(default=0)
    
    def __str__(self) -> str:
        return self.user_id