from django.contrib import admin
from .models import Profile

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'nivel', 'pontuacao', 'observacao', 'pendencias')
    search_fields = ('user__username', 'nivel')

admin.site.register(Profile, ProfileAdmin)
