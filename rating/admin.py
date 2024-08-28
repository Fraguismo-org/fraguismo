from django.contrib import admin
from .models import LogRating
from members.models import Profile  # Certifique-se de importar o modelo Profile

class LogRatingAdmin(admin.ModelAdmin):
    list_display = ('user_id','pontuacao','pontuacao_ganha', 'nome_atividade', 'updated_at')
    search_fields = ('user_id__username', 'nome_atividade')
    readonly_fields = ('profile_pontuacao',)

    def profile_pontuacao(self, obj):
        profile = Profile.objects.get(user=obj.user_id)
        return profile.pontuacao

    profile_pontuacao.short_description = 'Pontuação do Profile' 

admin.site.register(LogRating, LogRatingAdmin)
