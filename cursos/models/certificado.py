from django.db import models
from members.models.users import User


class Certificado(models.Model):
    CERTIFICADO_STATUS = (
        (1, 'COMPLETADO'),
        (2, 'EM_ANDAMENTO'),
        (3, 'FALHOU'),
    )
    id = models.AutoField(primary_key=True)
    certificado_nome = models.CharField(max_length=50)
    certificado_status = models.IntegerField(choices=CERTIFICADO_STATUS)
    user = models.ForeignKey(User, on_delete=models.CASCADE)