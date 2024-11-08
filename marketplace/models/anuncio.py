from django.db import models
from datetime import datetime
from uuid import uuid4

STATUS_ANUNCIO = (
    (1, 'ABERTO'),
    (2, 'ENCERRADO'),
    (3, 'PAUSADO'),
)

class Anuncio(models.Model):
    id = models.AutoField(primary_key=True)
    cod_anuncio = models.UUIDField(unique=True, null=False, default=uuid4, editable=False)
    descricao = models.TextField(max_length=4096, null=False)
    status_anuncio = models.IntegerField(choices=STATUS_ANUNCIO, default=1)
    created_at = models.DateTimeField(default=datetime.now, null=False)
    updated_at = models.DateTimeField(default=datetime.now, null=True)