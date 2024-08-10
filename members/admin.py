from django.contrib import admin
from .models import Profile

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'nivel', 'pontuacao', 'observacao', 'pendencias', 'squad')  # Adicione 'squad' aqui
    search_fields = ('user__username', 'nivel', 'squad')  # Adicione 'squad' nas opções de pesquisa

admin.site.register(Profile, ProfileAdmin)
