from django.db import models
from marketplace.models.anuncio import Anuncio

class Images(models.Model):
    id = models.AutoField(primary_key=True)
    anuncio = models.ForeignKey(
        Anuncio, 
        related_name='images', 
        related_query_name='image',
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to='anuncio_fotos')