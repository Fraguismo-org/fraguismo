from django.db import models
from members.models.profile import Profile
from datetime import date
from members.models.users import User


class Loja(models.Model):
    id = models.AutoField(primary_key=True)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    nome = models.CharField(max_length=100, null=False)
    created_at = models.DateField(default=date.today)
    localidade = models.CharField(max_length=100, null=False)
    email = models.EmailField(max_length=200, unique=True, null=False)
    telefone = models.CharField(max_length=16, null=True, unique=True)
    instagram = models.CharField(max_length=100, null=True, unique=True)
    facebook = models.CharField(max_length=100, null=True, unique=True)
    x_twitter = models.CharField(max_length=100, null=True, unique=True)
    web_site = models.CharField(max_length=100, null=True, unique=True)
    whatsapp = models.CharField(max_length=17, null=True, unique=True)
    telegram = models.CharField(max_length=17, null=True, unique=True)