from django.db import models
from datetime import datetime


class Mensagem(models.Model):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=150)
    assunto = models.CharField(max_length=200)
    mensagem = models.TextField()
    created_at = models.DateTimeField(default=datetime.now)