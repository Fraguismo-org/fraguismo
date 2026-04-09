# CLAUDE.md — Fraguismo

## Visão Geral

Plataforma Django de DAO libertária brasileira ("Anarcópolis"). Combina gamificação, marketplace, governança blockchain e economia de tokens.

- **Framework**: Django 4.2.14
- **Python**: 3.12
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

- `Nivel` define `pontuacao_base` para progressão (Aprendiz: 5, Escudeiro: 15, Cavaleiro: 30, Conselheiro: 40, Guardião: 40)
- `Profile.pontuacao` acumula pontos; `LogRating` registra cada transação
- `Pendencia` define tarefas obrigatórias por nível; `ProfilePendencia` rastreia o status por usuário

### PontosService

Serviço centralizado de gerenciamento de pontos em `rating/services/pontos_service.py`:

- `PontosService.adicionar_pontos(users, atividade, updated_by)` — adiciona pontos em lote e promove de nível automaticamente se não houver pendências
- `PontosService.editar(user, pontuacao, updated_by)` — edita pontos de um usuário individual
- Integrado com `Certificado` (cursos) — conclusão de certificado concede pontos via PontosService

## Camada de Serviços

- `rating/services/pontos_service.py` — `PontosService` (gestão centralizada de pontos e progressão de nível)
- `services/query_filter_service.py` — `QueryFilterService`, `QueryType` (utilitário de filtragem de queries)

## Ranking Periódico

Management commands para ranking:

```bash
python manage.py fechar_ranking semanal   # toda semana
python manage.py fechar_ranking mensal    # todo mês
python manage.py fechar_ranking anual     # todo ano
python manage.py popular_ranking_teste    # popula dados de teste (--limpar para remover)
```

**Lógica:**
- `semanal`: soma `LogRating.pontuacao_ganha` de segunda a sábado; salva em `RankingPeriodico(tipo='semanal')`
- `mensal`: verifica se hoje é o último dia do mês (lida com 28/29/30/31 dias); soma o mês inteiro
- `anual`: soma os registros `tipo='mensal'` do ano corrente
- `RankingPeriodico` possui constraint `unique_together = (user, tipo, data)`

**Configuração do crontab** (`crontab -e` no servidor):

```cron
# Ranking semanal — todo sábado às 23:59
59 23 * * 6 /caminho/para/.venv/bin/python /caminho/para/manage.py fechar_ranking semanal

# Ranking mensal — dias 28-31 às 23:59 (o comando verifica se é o último dia)
59 23 28-31 * * /caminho/para/.venv/bin/python /caminho/para/manage.py fechar_ranking mensal

# Ranking anual — 31 de dezembro às 23:59
59 23 31 12 * /caminho/para/.venv/bin/python /caminho/para/manage.py fechar_ranking anual
```

## CI/CD

Deploy automatizado via GitHub Actions (`.github/workflows/`):

- **`deploy-develop.yml`**: push em `develop` → deploy via SSH para VPS de homologação (`deploy_teste.sh`)
- **`deploy-main.yml`**: push em `main` → deploy via SSH para VPS de produção (`deploy_main.sh`)
- Sem containerização (Docker) — deploy direto via shell scripts na VPS

## Dependências Principais

```
Django==4.2.14, mysqlclient==2.2.4, django-bootstrap5==24.2
pillow==10.4.0, python-decouple==3.8, python-dotenv==1.0.1
beautifulsoup4==4.12.3
```

Arquivo completo: `requirements.txt`

## Diagrama ER

Ver [ER.md](ER.md) para o diagrama completo de entidades e relacionamentos.

## Pontos de Atenção

- `ComentarioAnuncio` (`marketplace/models/comentario_anuncio.py`) tem imports faltando — não está funcional
- `Curso` não tem relacionamentos com outras entidades ainda
- Integração blockchain usa Graphene Smart Chain Testnet (Chain ID: 17027) — testar sempre na testnet antes de produção
- Smart contracts em `contratos/` (arquivos `.sol`)
