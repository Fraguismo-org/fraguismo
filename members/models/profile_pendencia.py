from rating.models.pendencia import Pendencia
from members.models.profile import Profile
from rating.models.nivel import Nivel
from django.db import models
from datetime import datetime
from rating.models.nivel_choices import NivelChoices


STATUS_PENDENCIA = (
    (0, 'PENDENTE'),
    (1, 'ANDAMENTO'),
    (2, 'CONCLUIDA'),
)

class ProfilePendencia(models.Model):
    id = models.AutoField(primary_key=True)
    profile = models.ForeignKey(Profile, on_delete=models.DO_NOTHING)
    pendencia = models.ForeignKey(Pendencia, on_delete=models.DO_NOTHING)
    nivel = models.ForeignKey(Nivel, default=1, on_delete=models.DO_NOTHING)
    pendencia_status = models.IntegerField(choices=STATUS_PENDENCIA, default=0)
    updated_at = models.DateTimeField(default=datetime.now)

    def add_pendencias(profile, pendencias):
        user_pendencias = ProfilePendencia.objects.filter(profile=profile) #.filter(nivel=pendencia.nivel)
        for pendencia in pendencias:
            if pendencia in user_pendencias:
                continue
            prof_pendencia = ProfilePendencia()
            prof_pendencia.profile = profile
            prof_pendencia.pendencia = pendencia
            prof_pendencia.nivel = pendencia.nivel
            prof_pendencia.save()

    def update_pendencia_status(status, profile_pendencia):
        profile_pendencia.pendencia_status = status
        profile_pendencia.save()        

    def get_pendencias(profile: Profile):
        if profile.nivel_id is None:
            profile.nivel_id = Nivel.objects.get(nivel=profile.nivel)
        if profile.nivel.lower() == NivelChoices.GUARDIAN:
            return []        
        pendencias = Pendencia.objects.filter(nivel=profile.nivel_id)
        p_pendencias = ProfilePendencia.objects.filter(profile=profile)
        for pendencia in pendencias:
            p = p_pendencias.filter(pendencia=pendencia)            
        
        pendencias_faltantes = []
        if pendencias is None:
            return []
        return pendencias_faltantes
    
    def get_all_pendencias(profile: Profile):
        return ProfilePendencia.objects.filter(profile=profile)