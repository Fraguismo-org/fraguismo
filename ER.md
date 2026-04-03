# Diagrama ER — Fraguismo

```mermaid
erDiagram
    User {
        int id PK
        string username
        string email
        string password
    }

    Users {
        int user_ptr_id PK
        bool is_fraguista
        string city
        string fone
        string instagram
        date birth
        string job_title
        string bsc_wallet
        string lightning_wallet
        string como_conheceu
        string quem_indicou
        string aonde
        bool codigo_conduta
    }

    Profile {
        int id PK
        string nivel
        int pontuacao
        string squad
        string observacao
        image pic_profile
    }

    Nivel {
        int id PK
        string nivel
        int pontuacao_base
    }

    Squad {
        int id PK
        string squad_nome
        string grupo_url
    }

    Questionario {
        int id PK
        text help_project
        text reason_to_participate
        text political_belief
        text state_opinion
        text economic_values
        bool contato_realizado
        datetime contato_data
    }

    ProfilePendencia {
        int id PK
        int pendencia_status
        datetime updated_at
    }

    Pendencia {
        int id PK
        string pendencia
    }

    LogRating {
        int id PK
        int pontuacao_ganha
        int pontuacao
        datetime updated_at
        int updated_by
    }

    Atividade {
        int id PK
        string nome_atividade
        int pontuacao
        datetime updated_at
    }

    RankingPeriodico {
        int id PK
        int pontuacao
        date data
    }

    Anuncio {
        int id PK
        uuid cod_anuncio
        string titulo
        text descricao
        int status_anuncio
        int departamento
        decimal preco
        string localidade
        datetime created_at
    }

    Images {
        int id PK
        image image
    }

    Loja {
        int id PK
        uuid cod_loja
        string nome
        text descricao
        string localidade
        string email
        string telefone
        string instagram
        image logo
        date created_at
    }

    Curso {
        int id PK
        string curso_nome
        string curso_area
        int curso_nivel
    }

    Certificado {
        int id PK
        string certificado_nome
        int certificado_status
    }

    Proposta {
        int id PK
        string titulo
        decimal valor
        file arquivo
        string hash_arquivo
        datetime data_criacao
    }

    Voto {
        int id PK
        bool votos
        datetime data
    }

    ConfiguracaoVisibilidade {
        int id PK
        bool email
        bool nome
        bool sobrenome
        bool localidade
        bool telefone
        bool instagram
        bool aniversario
        bool profissao
        bool polygon
        bool lightining
        bool idade
    }

    Acesso {
        int id PK
        string nome
        string link
    }

    ValorToken {
        int id PK
        bigint valor_brl
        datetime created_at
    }

    Mensagem {
        int id PK
        string email
        string assunto
        text mensagem
        datetime created_at
    }

    %% Herança
    User ||--|| Users : "extends (user_ptr)"

    %% members
    Users ||--|| Profile : "user"
    Profile }o--|| Nivel : "nivel_id"
    Profile }o--|| Squad : "squad_id"
    Profile ||--|| Questionario : "profile"

    %% pendencias
    Pendencia }o--|| Nivel : "nivel"
    ProfilePendencia }o--|| Profile : "profile"
    ProfilePendencia }o--|| Pendencia : "pendencia"
    ProfilePendencia }o--|| Nivel : "nivel"

    %% rating
    LogRating }o--|| Users : "user_id"
    LogRating }o--|| Atividade : "atividade"
    Atividade }o--|| Users : "updated_by"

    %% ranking
    RankingPeriodico }o--|| Users : "user"

    %% marketplace
    Anuncio }o--|| Users : "user"
    Images }o--|| Anuncio : "anuncio"
    Loja }o--|| User : "user"

    %% cursos
    Certificado }o--|| Users : "user"

    %% propostas
    Proposta }o--|| User : "user"
    Voto }o--|| Proposta : "proposta"
    Voto }o--|| User : "usuario"

    %% configuracoes
    ConfiguracaoVisibilidade ||--|| User : "usuario"
```

## Entidades por app

| App | Modelos |
|-----|---------|
| `members` | `Users` (extends User), `Profile`, `Squad`, `Questionario`, `ProfilePendencia` |
| `rating` | `Nivel`, `Pendencia`, `Atividade`, `LogRating` |
| `ranking` | `RankingPeriodico` |
| `marketplace` | `Anuncio`, `Images`, `Loja` |
| `cursos` | `Curso`, `Certificado` |
| `propostas` | `Proposta`, `Voto` |
| `configuracoes` | `ConfiguracaoVisibilidade` |
| `administrador` | `Acesso`, `ValorToken` |
| `site_fraguismo` | `Mensagem` |

## Observações

- `Loja`, `Proposta` e `Voto` referenciam `django.contrib.auth.models.User` diretamente; os demais usam o modelo customizado `Users`
- `ComentarioAnuncio` (`marketplace/models/comentario_anuncio.py`) tem imports faltando e não está funcional
- `Curso` não possui relacionamento com nenhuma outra entidade
