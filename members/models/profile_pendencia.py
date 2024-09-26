from rating.models.pendencia import Pendencia
from members.models.profile import Profile
from rating.models.nivel import Nivel
from django.db import models
from datetime import datetime


STATUS_PENDENCIA = (
    (0, 'PENDENTE'),
    (1, 'ANDAMENTO'),
    (2, 'CONCLUIDA'),
)

class ProfilePendencia(models.Model):
    id = models.IntegerField(primary_key=True)
    profile = models.ForeignKey(Profile, on_delete=models.DO_NOTHING)
    pendencia = models.ForeignKey(Pendencia, on_delete=models.DO_NOTHING)
    nivel = models.ForeignKey(Nivel, default=1, on_delete=models.DO_NOTHING)
    pendencia_status = models.IntegerField(choices=STATUS_PENDENCIA, default=0)
    updated_at = models.DateTimeField(default=datetime.now)

    def get_pendencias(profile: Profile):
        if profile.nivel_id is None:
            profile.nivel_id = Nivel.objects.get(nivel=profile.nivel)
        prx_nivel = profile.nivel_id.proximo_nivel()
        pendencias = Pendencia.objects.filter(nivel=prx_nivel)
        pendencias_done = ProfilePendencia.objects.filter(profile=profile)
        pendencias_faltantes = []
        if pendencias is None:
            return []
        for pendencia in pendencias:
            if not pendencia in pendencias_done:
                pendencias_faltantes.append(pendencia)
        return pendencias_faltantes