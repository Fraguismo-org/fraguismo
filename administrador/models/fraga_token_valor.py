from django.db import models


class ValorToken(models.Model):
    id = models.AutoField(primary_key=True)
    valor_brl = models.BigIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)