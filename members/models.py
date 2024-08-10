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
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nivel = models.CharField(max_length=10, choices=NIVEL_CHOICES, default='membro')
    pontuacao = models.IntegerField(default=0)  # Novo campo de pontuação
    observacao = models.TextField(blank=True)   # Novo campo de observação
    pendencias = models.TextField(blank=True)   # Novo campo de pendências

    def __str__(self):
        return self.user.username