from django.db import models
from rating.models.nivel import Nivel
from members.models.squad import Squad
from django.contrib.auth.models import User


class Profile(models.Model):
    NIVEL_CHOICES = [
        ('membro', 'Membro'),
        ('assessor', 'Assessor'),
        ('executivo', 'Executivo'),
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
    nivel_id = models.ForeignKey(Nivel, null=True, on_delete=models.DO_NOTHING)
    squad_id = models.ForeignKey(Squad, null=True, on_delete=models.DO_NOTHING)
    pontuacao = models.IntegerField(default=0)
    observacao = models.TextField(blank=True)
    squad = models.CharField(max_length=20, choices=SQUAD_CHOICES, default='squad_021')
    pic_profile = models.ImageField(default='default.jpg', upload_to='profile_pics')

    def __str__(self):
        return self.user.username
    
    def get_or_create_profile(user_request):
        try:
            profile = Profile.objects.get(user=user_request)
            if profile.nivel_id is None:
                profile.nivel_id = Nivel.objects.get(nivel=profile.nivel)
            return profile
        except:
            profile = Profile()
            profile.user = user_request
            profile.nivel_id = Nivel.objects.get(id=1)
            return profile

    def is_next_level(self):
        return (self.nivel_id.proximo_nivel().pontuacao_base - self.pontuacao) <= 0
    
    def change_level(self):
        self.pontuacao -= self.nivel_id.proximo_nivel().pontuacao_base
        self.nivel_id = self.nivel_id.proximo_nivel()
        self.nivel = self.nivel_id.nivel
