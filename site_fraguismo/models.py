from django.db import models


class Member():
    nome = models.CharField(max_length=255)
    nivel = models.CharField(max_length=50)
    equipe = models.CharField(max_length=50, blank=True)
    telefone = models.CharField(max_length=30, unique=True)
    email = models.EmailField(max_length=200, unique=True)
    instagram = models.CharField(max_length=100, blank=True)
    data_nascimento = models.DateField()
    local = models.CharField(max_length=100, blank=True)
    profissao = models.CharField(max_length=100, blank=True)
    pontos = models.IntegerField()
    senha = models.CharField(max_length=50)
