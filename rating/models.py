from datetime import datetime
from django.db import models
from django.utils import timezone
from members.models import Profile, User



class LogRating(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    pontuacao_ganha = models.IntegerField(default=0)
    pontuacao = models.IntegerField(default=0)
    nome_atividade = models.CharField(max_length=50, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def pontuacao(self):
        profile = Profile.objects.get(user=self.user_id)
        return profile.pontuacao
    def save(self, *args, **kwargs):
        # Obtenha o perfil do usuário
        profile = Profile.objects.get(user=self.user_id)

        # Armazene a pontuação atual antes de atualizar
        self.pontuacao_antes = profile.pontuacao
        
        # Salva o log normalmente, incluindo a pontuação antes da atualização
        super().save(*args, **kwargs)
        
        # Atualiza a pontuação do perfil
        profile.pontuacao += self.pontuacao_ganha
        profile.save()
    
    


def __str__(self) -> str:
        local_time = timezone.localtime(self.updated_at)
        return f'{self.user_id} | pontuacao total: {self.pontuacao + self.pontuacao_ganha} | {self.nome_atividade} | {local_time}'


