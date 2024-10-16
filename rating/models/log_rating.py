from django.db import models
from django.utils import timezone
from members.models.users import User
from rating.models.atividade import Atividade
from members.models.profile import Profile


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
    
    def add_log_rating(profile: Profile, pontuacao: int, user_id: int, atividade: Atividade=None):
        rating = LogRating()
        rating.user_id = profile.user
        rating.pontuacao_ganha = int(pontuacao) if pontuacao is not None else atividade.pontuacao
        rating.pontuacao = profile.pontuacao
        rating.atividade = atividade
        rating.updated_by = user_id
        rating.save()