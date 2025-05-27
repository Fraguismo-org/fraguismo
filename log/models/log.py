from django.db import models
from members.models.users import Users


class Log(models.Model):    
    id = models.AutoField(primary_key=True)    
    mensagem = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def salva_log(mensagem):
        log = Log(mensagem=mensagem)
        log.save()

    def __str__(self):
        return f"[{self.level}] {self.timestamp}: {self.message}]"