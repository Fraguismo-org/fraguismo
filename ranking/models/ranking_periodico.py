from django.db import models
from datetime import date
from members.models.users import Users


TIPO_PERIODO = (
    ('semanal', 'Semanal'),
    ('mensal', 'Mensal'),
    ('anual', 'Anual'),
)


class RankingPeriodico(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Users, on_delete=models.DO_NOTHING)
    pontuacao = models.IntegerField(default=0)
    tipo = models.CharField(max_length=10, choices=TIPO_PERIODO)
    data = models.DateField(default=date.today)

    class Meta:
        unique_together = ('user', 'tipo', 'data')