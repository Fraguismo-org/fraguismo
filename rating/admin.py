from django.contrib import admin
from .models import LogRating
from members.models import Profile
from django.utils.translation import gettext_lazy as _

class LogRatingAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'pontuacao', 'pontuacao_ganha', 'nome_atividade', 'updated_at', 'pontuacao_proximo_nivel')
    search_fields = ('user_id__username', 'nome_atividade')
    readonly_fields = ('profile_pontuacao',)
    list_filter = (('updated_at', admin.DateFieldListFilter),)  # Adiciona o filtro de data
    
    def profile_pontuacao(self, obj):
        profile = Profile.objects.get(user=obj.user_id)
        return profile.pontuacao

    profile_pontuacao.short_description = 'Pontuação do Profile'

    def pontuacao_proximo_nivel(self, obj):
        profile = Profile.objects.get(user=obj.user_id)
        pontos_atual = profile.pontuacao
        nivel_atual = profile.nivel
        
        niveis = {
            'membro': 5,
            'assessor': 15,
            'lider': 30,
            'executivo': 40,
            'diretor': 40
        }
        
        pontos_proximo_nivel = niveis.get(nivel_atual)  # 40 é o máximo para diretor
        if pontos_atual is None or pontos_proximo_nivel is None:
            return 0
        
        return max(pontos_proximo_nivel - pontos_atual, 0)
    
    pontuacao_proximo_nivel.short_description = 'Pontuação para o próximo nível'

    def has_add_permission(self, request):
        return False  # Desativa o botão "Adicionar" na página de listagem

    def has_change_permission(self, request, obj=None):
        return False  # Desativa o botão "Modificar"

admin.site.register(LogRating, LogRatingAdmin)
