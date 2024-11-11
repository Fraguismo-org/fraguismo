from django.db import models
from datetime import date
from uuid import uuid4
from django.contrib.auth.models import User

class Loja(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Relaciona a loja ao usuário
    cod_loja = models.UUIDField(unique=True, default=uuid4, editable=False)  # Código único da loja
    nome = models.CharField(max_length=100, null=False)
    descricao = models.TextField(max_length=4096, null=True)  # Descrição da loja
    localidade = models.CharField(max_length=100, null=False)
    email = models.EmailField(max_length=200, unique=True, null=False)
    telefone = models.CharField(max_length=16, null=True, unique=True)
    instagram = models.CharField(max_length=100, null=True, unique=True)
    facebook = models.CharField(max_length=100, null=True, unique=True)
    twitter = models.CharField(max_length=100, null=True, unique=True)
    web_site = models.CharField(max_length=100, null=True, unique=True)
    whatsapp = models.CharField(max_length=17, null=True, unique=True)
    telegram = models.CharField(max_length=17, null=True, unique=True)
    created_at = models.DateField(default=date.today)
    updated_at = models.DateTimeField(auto_now=True)  # Atualiza automaticamente

    def __str__(self):
        return f"{self.nome} - {self.cod_loja}"
