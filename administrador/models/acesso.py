from django.db import models


class Acesso(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=50)
    link = models.CharField(max_length=512)