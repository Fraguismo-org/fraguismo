from __future__ import annotations 
from typing import Optional
from configuracoes.models.configuracao_visibilidade import ConfiguracaoVisibilidade
from members.models.users import Users


class Configuracao:
       
    def __init__(self):
        self.visibilidade: Optional[ConfiguracaoVisibilidade] = None
    
    @staticmethod
    def carrega_configuracoes(usuario: Users) -> Configuracao:
        configuracoes = Configuracao()  
        configuracoes.visibilidade, _ = ConfiguracaoVisibilidade.objects.get_or_create(usuario=usuario)
        return configuracoes
    
    @staticmethod
    def salva_configuracoes(configuracoes: Configuracao) -> bool:
        try:
            configuracoes.visibilidade.save()
            return True
        except Exception as e:            
            return False