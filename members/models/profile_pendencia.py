from rating.models.pendencia import Pendencia
from members.models.profile import Profile
from django.db import models
from datetime import datetime


class ProfilePendencia(models.Model):
    id = models.IntegerField(primary_key=True)
    profile = models.ForeignKey(Profile, on_delete=models.DO_NOTHING)
    pendencia = models.ForeignKey(Pendencia, on_delete=models.DO_NOTHING)
    updated_at = models.DateTimeField(default=datetime.now)

    def get_pendencias(self, profile):
        prx_nivel = profile.nivel.proximo_nivel()
        pendencias = Pendencia.objects.filter(nivel=prx_nivel)
        pendencias_done = ProfilePendencia.objects.filter(profile=profile)
        pendencias_faltantes = []
        for pendencia in pendencias:
            if not pendencia in pendencias_done:
                pendencias_faltantes.append(pendencia)
        return pendencias_faltantes