from django.db import models
from datetime import datetime
from uuid import uuid4
from members.models.users import User

STATUS_ANUNCIO = (
    (1, 'Ativo'),
    (2, 'Encerrado'),
    (3, 'Pausado'),
)

class Anuncio(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cod_anuncio = models.UUIDField(unique=True, null=False, default=uuid4, editable=False)
    titulo = models.CharField(max_length=255, null=False)
    descricao = models.TextField(max_length=4096, null=False)    
    status_anuncio = models.IntegerField(choices=STATUS_ANUNCIO, default=1)
    preco = models.DecimalField(decimal_places=2, null=False, default=0.00, max_digits=15)
    created_at = models.DateTimeField(default=datetime.now, null=False)
    updated_at = models.DateTimeField(default=datetime.now, null=True)