from rating.models.pendencia import Pendencia
from members.models.profile import Profile
from rating.models.nivel import Nivel
from rating.models.nivel_choices import NivelChoices

from django.db import models
from django.db.models import Q
from datetime import datetime


STATUS_PENDENCIA = (
    (0, 'PENDENTE'),
    (1, 'ANDAMENTO'),
    (2, 'CONCLUIDA'),
    (3, 'REMOVIDA'),
)

class ProfilePendencia(models.Model):
    id = models.AutoField(primary_key=True)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    pendencia = models.ForeignKey(Pendencia, on_delete=models.CASCADE)
    nivel = models.ForeignKey(Nivel, default=1, on_delete=models.CASCADE)
    pendencia_status = models.IntegerField(choices=STATUS_PENDENCIA, default=0)
    updated_at = models.DateTimeField(default=datetime.now)
    
    def add_pendencia(profile, pendencia):                            
        prof_pendencia = ProfilePendencia()
        prof_pendencia.profile = profile
        prof_pendencia.pendencia = pendencia
        prof_pendencia.nivel = pendencia.nivel
        prof_pendencia.pendencia_status = 0
        prof_pendencia.save()

    def add_pendencias(profile, pendencias):
        user_pendencias = ProfilePendencia.objects.filter(profile=profile)
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
            if not p:
                ProfilePendencia.add_pendencia(profile, pendencia)
        return ProfilePendencia.objects.filter(
            ~Q(pendencia_status=3),
            ~Q(pendencia=None),
            profile=profile
        )
    
    def get_all_pendencias(profile: Profile):
        return ProfilePendencia.objects.filter(profile=profile)