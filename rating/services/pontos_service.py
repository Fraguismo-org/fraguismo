from members.models.profile import Profile
from members.models.profile_pendencia import ProfilePendencia
from rating.models.log_rating import LogRating
from rating.models.nivel_choices import NivelChoices


class PontosService:
    """
    Serviço responsável por gerenciar a pontuação dos membros.

    Centraliza as operações de adição e edição de pontos, registrando
    cada transação em LogRating e verificando progressão de nível automaticamente.
    """

    def adicionar_pontos(ids: list, atividade_id: int, pontuacao: int, updater_id: int) -> dict:
        """
        Adiciona pontos a uma lista de membros por uma atividade.

        Se `pontuacao` for None, busca o valor diretamente da atividade.
        Registra um LogRating para cada membro e tenta aplicar a pontuação.
        Membros que falharem são listados na mensagem de retorno.

        Args:
            ids (list): Lista de IDs de usuário (`user_id`) que receberão os pontos.
            atividade_id (int): ID da Atividade relacionada à pontuação.
            pontuacao (int | None): Valor dos pontos a adicionar. Se None, usa o valor da atividade.

        Returns:
            dict: `{"result": bool, "message": str}`
        """
        if pontuacao == None and atividade_id != 0:
            atividade = Atividade.objects.get(id=atividade_id)
            pontuacao = str(atividade.pontuacao)
        
        if pontuacao <= 0:
            return {
                "result": False, 
                "message": "Adicione uma pontuação válida!"
                }
        
        nao_salvos = []
        
        for id in ids:     
            profile = Profile.objects.get(user_id=id)            
            LogRating.add_log_rating(profile, int(pontuacao), updater_id, atividade)
            result = PontosService._aplicar(profile, pontuacao)
            if not result["result"]:
                nao_salvos.append(profile.user.username)
        
        if nao_salvos > 0:
            return {result: True, "message": f"Falha ao atualizar: {', '.join(nao_salvos)}"}
        
        return {"result": True, "message": "Pontuações adicionadas com sucesso!"}
        
    def editar(profile: Profile, pontuacao: int, updater_id: int):
        """
        Edita/ajusta a pontuação de um membro individualmente.

        Registra o ajuste em LogRating e aplica a pontuação ao perfil,
        verificando progressão de nível quando aplicável.

        Args:
            profile (Profile): Perfil do membro a ser atualizado.
            pontuacao (int): Valor dos pontos a adicionar (pode ser negativo para dedução).

        Returns:
            dict: `{"result": bool, "message": str}`
        """
        LogRating.add_log_rating(profile, int(pontuacao), updater_id)
        return PontosService._aplicar(profile, pontuacao)

    def _aplicar(profile: Profile, pontuacao: int) -> dict:
        """
        Aplica a pontuação ao perfil e verifica progressão de nível.

        Método interno. Verifica se o membro não é guardião, não tem pendências
        abertas e atingiu a pontuação do próximo nível — se sim, promove o nível.
        Em seguida, incrementa `profile.pontuacao` e salva.

        Args:
            profile (Profile): Perfil do membro.
            pontuacao (int): Valor dos pontos a adicionar.

        Returns:
            dict: `{"result": bool, "message": str}` — retorna falha apenas em caso de exceção.
        """
        try:
            num_pendencias = len(ProfilePendencia.get_pendencias(profile))
            eh_guardiao = profile.nivel.lower() == NivelChoices.GUARDIAN

            if not eh_guardiao and num_pendencias == 0 and profile.is_next_level():
                profile.change_level()

            profile.pontuacao += int(pontuacao)            
            profile.save()
            return {"result": True, "message": "Pontuação editada com sucesso"}
        except:
            return {"result": False, "message": "Erro ao aplicar pontuação"}