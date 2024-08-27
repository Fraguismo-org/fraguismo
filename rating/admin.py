from django.contrib import admin
from .models import LogRating

class LogRatingAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'pontuacao', 'pontuacao_ganha', 'nome_atividade', 'updated_at')
    search_fields = ('user_id__username', 'nome_atividade')

admin.site.register(LogRating, LogRatingAdmin)






