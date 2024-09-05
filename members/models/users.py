from django.contrib.auth.models import User
from django.db import models


class Users(User):
    city = models.CharField(max_length=100)
    fone = models.CharField(max_length=30)
    instagram = models.CharField(max_length=100, blank=True)
    birth = models.DateField()
    job_title = models.CharField(max_length=255)
    bsc_wallet = models.CharField(max_length=100, blank=True)
    lightning_wallet = models.CharField(max_length=100, blank=True)
    como_conheceu = models.CharField(max_length=20)
    quem_indicou = models.CharField(max_length=100, blank=True)
    aonde = models.CharField(max_length=100)

    def clone(self, user: User):
        self.user_ptr = user
        self.username = user.username
        self.password = user.password
        self.email = user.email
        self.date_joined = user.date_joined
        self.is_active = user.is_active
        self.is_staff = user.is_staff

    def __str__(self) -> str:
        return super().__str__()