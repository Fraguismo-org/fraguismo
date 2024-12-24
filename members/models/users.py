from django.contrib.auth.models import User
from django.db import models


class Users(User):
    User._meta.get_field('email')._unique = True
    is_fraguista = models.BooleanField(default=False)
    city = models.CharField(max_length=100, blank=True)
    fone = models.CharField(max_length=30, blank=True)
    instagram = models.CharField(max_length=100, blank=True)
    birth = models.DateField(null=True)
    job_title = models.CharField(max_length=255, blank=True)
    bsc_wallet = models.CharField(max_length=100, blank=True)
    lightning_wallet = models.CharField(max_length=400, blank=True)
    como_conheceu = models.CharField(max_length=20, blank=True)
    quem_indicou = models.CharField(max_length=100, blank=True)
    aonde = models.CharField(max_length=100)
    codigo_conduta = models.BooleanField(null=True)

    def clone(self, user: User):
        self.user_ptr = user
        self.username = user.username
        self.password = user.password
        self.email = user.email
        self.date_joined = user.date_joined
        self.is_active = user.is_active
        self.is_staff = user.is_staff

    def get_or_create_member(user_request):
        try:
            member = Users.objects.get(user_ptr=user_request)
            return member
        except:
            member = Users(user_ptr=user_request)
            member.clone(user_request)
            return member

    def __str__(self) -> str:
        return super().__str__()