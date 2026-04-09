from django.db import models

from rating.models.pro_liberadade import ProLiberdade


class FotosProLiberdade(models.Model):
    id = models.AutoField(primary_key=True)
    pro_liberdade = models.ForeignKey(ProLiberdade, on_delete=models.CASCADE, related_name='fotos')
    foto = models.ImageField(upload_to='pro_liberdade/')
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Foto {self.id} - {self.pro_liberdade}"

    class Meta:
        db_table = 'fotos_pro_liberdade'
        verbose_name = 'Foto Pro Liberdade'
        verbose_name_plural = 'Fotos Pro Liberdade'
