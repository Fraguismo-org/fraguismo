from django.db import models


class ComentarioAnuncio(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Users, null=False)
    titulo = models.CharField(null=False, blank=False, max_length=100)
    comentario = models.TextField(max_length=500, blank=True, null=False)
    anuncio = models.ForeignKey(Anuncio, null=False)
    qualidade = models.PositiveSmallIntegerField()
    preco = models.PositiveSmallIntegerField()