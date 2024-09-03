from django.contrib import admin
from .models import Profile
from rating.models import LogRating

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'nivel', 'pontuacao', 'observacao', 'pendencias', 'squad', 'pontuacao_proximo_nivel')  # Adicione 'squad' aqui
    search_fields = ('user__username', 'nivel', 'squad')  # Adicione 'squad' nas opções de pesquisa
    
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
    
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
    
    pontuacao_proximo_nivel.short_description = 'PRÓXIMO NÍVEL'

admin.site.register(Profile, ProfileAdmin)
