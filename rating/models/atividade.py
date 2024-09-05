from django.db import models
from members.models.users import User


class Atividade(models.Model):
    id = models.AutoField(primary_key=True)
    nome_atividade = models.CharField(max_length=50)
    pontuacao = models.IntegerField()
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)