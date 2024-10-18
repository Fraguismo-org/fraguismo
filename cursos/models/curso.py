from django.db import models


class Curso(models.Model):
    
    id = models.AutoField(primary_key=True)
    curso_nome = models.CharField(max_length=100)
    curso_area = models.CharField(max_length=50, blank=True)
    curso_nivel = models.IntegerField(blank=True)
    