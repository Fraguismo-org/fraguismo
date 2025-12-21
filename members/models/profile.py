from django.db import models
from log.models.log import Log
from rating.models.nivel import Nivel
from rating.models.nivel_choices import NIVEL_CHOICES
from members.models.squad_choices import SQUAD_CHOICES
from members.models.squad import Squad
from members.models.users import Users


class Profile(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE)
    nivel = models.CharField(max_length=20, choices=NIVEL_CHOICES, default='aprendiz')
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
            profile, created = Profile.objects.get_or_create(user=user_request)
            if created:
                profile.user = user_request
                profile.nivel_id = Nivel.objects.get(id=1)                
            if profile.nivel_id is None:
                profile.nivel_id = Nivel.objects.get(nivel=profile.nivel)            
            return profile
        except Exception as e:            
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
        
