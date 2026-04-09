from django.db import models

from members.models.users import Users


class ProLiberdade(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    evento = models.CharField(max_length=255)
    data_evento = models.DateTimeField()
    local_evento = models.CharField(max_length=255)
    is_approved = models.BooleanField(default=False)
    is_denied = models.BooleanField(default=False)
    deny_reason = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.IntegerField(null=False)

    def __str__(self):
        return f"{self.user} - {self.evento}"

    class Meta:
        db_table = 'pro_liberdade'
        verbose_name = 'Pro Liberdade'
        verbose_name_plural = 'Pro Liberdade'
