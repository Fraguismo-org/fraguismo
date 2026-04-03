# CLAUDE.md — Fraguismo

## Visão Geral

Plataforma Django de DAO libertária brasileira ("Anarcópolis"). Combina gamificação, marketplace, governança blockchain e economia de tokens.

- **Framework**: Django 4.2.14
- **Banco de dados**: MySQL/MariaDB
- **Linguagem do código**: Português (pt-br) — manter esta convenção em todo código voltado ao usuário

## Comandos Essenciais

```bash
source .venv/bin/activate
python manage.py runserver
python manage.py makemigrations && python manage.py migrate
```

## Arquitetura de URLs

URLs principais em `fraguismo/urls.py`. Prefixos:

| Prefixo | App |
|---------|-----|
| `/` | `site_fraguismo` |
| `rating/` | `rating` |
| `members/` | `members` |
| `administrador/` | `administrador` |
| `cursos/` | `cursos` |
| `marketplace/` | `marketplace` |
| `config/` | `configuracoes` |
| `propostas/` | `propostas` |
| `dao/` | `fraguismo_dao` |
| `ranking/` | `ranking` |

Apps maiores organizam rotas em subpastas `routes/` (ex: `rating/routes/log_rating_urls.py`).

## Modelo de Usuário

O modelo customizado é `members.models.users.Users` (extends `django.contrib.auth.models.User`).

- **Usar `Users`** na maioria dos apps
- **Exceção**: `Loja`, `Proposta`, `Voto` e `ConfiguracaoVisibilidade` ainda referenciam `User` diretamente — atenção ao criar FKs novas

## Sistema de Gamificação

Níveis em ordem crescente: `aprendiz` → `escudeiro` → `cavaleiro` → `conselheiro` → `guardiao`

- `Nivel` define `pontuacao_base` para progressão
- `Profile.pontuacao` acumula pontos; `LogRating` registra cada transação
- `Pendencia` define tarefas obrigatórias por nível; `ProfilePendencia` rastreia o status por usuário

## Ranking Periódico

Management command para fechar snapshots de ranking automaticamente:

```bash
python manage.py fechar_ranking semanal   # toda semana
python manage.py fechar_ranking mensal    # todo mês
python manage.py fechar_ranking anual     # todo ano
```

**Lógica:**
- `semanal`: soma `LogRating.pontuacao_ganha` de segunda a sábado; salva em `RankingPeriodico(tipo='semanal')`
- `mensal`: verifica se hoje é o último dia do mês (lida com 28/29/30/31 dias); soma o mês inteiro
- `anual`: soma os registros `tipo='mensal'` do ano corrente

**Configuração do crontab** (`crontab -e` no servidor):

```cron
# Ranking semanal — todo sábado às 23:59
59 23 * * 6 /caminho/para/.venv/bin/python /caminho/para/manage.py fechar_ranking semanal

# Ranking mensal — dias 28-31 às 23:59 (o comando verifica se é o último dia)
59 23 28-31 * * /caminho/para/.venv/bin/python /caminho/para/manage.py fechar_ranking mensal

# Ranking anual — 31 de dezembro às 23:59
59 23 31 12 * /caminho/para/.venv/bin/python /caminho/para/manage.py fechar_ranking anual
```

## Diagrama ER

Ver [ER.md](ER.md) para o diagrama completo de entidades e relacionamentos.

## Pontos de Atenção

- `ComentarioAnuncio` (`marketplace/models/comentario_anuncio.py`) tem imports faltando — não está funcional
- `Curso` não tem relacionamentos com outras entidades ainda
- Integração blockchain usa Graphene Smart Chain Testnet (Chain ID: 17027) — testar sempre na testnet antes de produção
- CI/CD via GitHub Actions para branch `develop` → VPS de homologação
