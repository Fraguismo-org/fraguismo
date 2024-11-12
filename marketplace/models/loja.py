from django.db import models
from datetime import date
from uuid import uuid4
from django.contrib.auth.models import User

class Loja(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cod_loja = models.UUIDField(unique=True, default=uuid4, editable=False)
    nome = models.CharField(max_length=100, null=False)
    descricao = models.TextField(max_length=4096, null=True)
    localidade = models.CharField(max_length=100, null=False)
    email = models.EmailField(max_length=200, unique=True, null=False)
    telefone = models.CharField(max_length=16, null=True, unique=True)
    instagram = models.CharField(max_length=100, null=True, unique=True, blank=True)
    facebook = models.CharField(max_length=100, null=True, unique=True, blank=True)
    twitter = models.CharField(max_length=100, null=True, unique=True, blank=True)
    web_site = models.CharField(max_length=100, null=True, unique=True, blank=True)
    whatsapp = models.CharField(max_length=17, null=True, unique=True, blank=True)
    telegram = models.CharField(max_length=17, null=True, unique=True, blank=True)
    logo = models.ImageField(upload_to='lojas', blank=True)
    created_at = models.DateField(default=date.today)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nome} - {self.cod_loja}"
