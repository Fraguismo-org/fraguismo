from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    NIVEL_CHOICES = [
        ('membro', 'Membro'),
        ('assessor', 'Assessor'),
        ('execultivo', 'Executivo'),
        ('lider', 'Líder'),
        ('diretor', 'Diretor'),
    ]

    SQUAD_CHOICES = [
        ('squad_021', 'Squad 021'),
        ('area_51', 'Area 51'),
        ('curitiba', 'Curitiba'),
        ('serra_gaucha', 'Serra Gaucha'),
        ('squad_011', 'Squad 011'),
        ('squad_pampa', 'Squad Pampa'),
        ('squad_061', 'Squad 061'),
        ('squad_063', 'Squad 063'),
        ('squad_064', 'Squad 064'),
        ('squad_065', 'Squad 065'),
        ('squad_066', 'Squad 066'),
        ('squad_067', 'Squad 067'),
        ('squad_069', 'Squad 069'),
        ('squad_serra', 'Squad Serra'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nivel = models.CharField(max_length=10, choices=NIVEL_CHOICES, default='membro')
    pontuacao = models.IntegerField(default=0)
    observacao = models.TextField(blank=True)
    pendencias = models.TextField(blank=True)
    squad = models.CharField(max_length=20, choices=SQUAD_CHOICES, default='squad_021')  # Novo campo Squad

    def __str__(self):
        return self.user.username


class User(User):
    city = models.CharField(max_length=100)
    fone = models.CharField(max_length=30)
    instagram = models.CharField(max_length=100, blank=True)
    birth = models.DateField()
    job_title = models.CharField(max_length=255)
    bsc_wallet = models.CharField(max_length=100, blank=True)    
    como_conheceu = models.CharField(max_length=20)
    quem_indicou = models.CharField(max_length=100, blank=True)
    aonde = models.CharField(max_length=100)

    def __str__(self) -> str:
        return super().__str__()

