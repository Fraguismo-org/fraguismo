## Visão Geral do Projeto

**Fraguismo** é uma plataforma brasileira de DAO (Organização Autônoma Descentralizada) para a construção da "Anarcópolis" - uma comunidade libertária. Combina rede social, gamificação, e-commerce, governança baseada em blockchain e economia de tokens.

**Idioma**: Português (pt-br)
**Framework**: Django 4.2.14
**Banco de Dados**: MySQL/MariaDB
**Blockchain**: Graphene Smart Chain Testnet (Chain ID: 17027)

## Comandos de Desenvolvimento

### Configuração
```bash
# Criar ambiente virtual
python -m venv .venv

# Ativar ambiente virtual
# Windows:
.venv/Scripts/Activate.ps1
# Linux:
source .venv/bin/activate

# Instalar dependências
pip install -r requirements/requirements.txt

# Executar migrações
python manage.py makemigrations
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser
```

### Executando a Aplicação
```bash
# Servidor de desenvolvimento (http://localhost:8000)
python manage.py runserver

# Executar em uma porta específica
python manage.py runserver 8080
```

### Operações de Banco de Dados
```bash
# Criar migrações para todos os aplicativos
python manage.py makemigrations

# Criar migrações para um aplicativo específico
python manage.py makemigrations members

# Aplicar migrações
python manage.py migrate

# Mostrar SQL para uma migração
python manage.py sqlmigrate members 0001

# Verificar problemas de migração
python manage.py makemigrations --check
```

### Shell e Depuração
```bash
# Shell do Django
python manage.py shell

# Shell do banco de dados
python manage.py dbshell
```

## Arquitetura

### Estrutura de Aplicativos Django

**Aplicações Principais:**

- **site_fraguismo** - Site principal, landing pages, conteúdo informativo sobre a DAO/Anarcópolis
- **members** - Gerenciamento de usuários com modelo de usuário estendido (carteiras de cripto, gamificação)
- **rating** - Sistema de gamificação (pontos, níveis, atividades, tarefas pendentes)
- **propostas** - Governança da DAO (criação de propostas, votação baseada em blockchain)
- **graca** - Distribuição de tokens e recompensas (sistema de token "graça")
- **marketplace** - Anúncios classificados e listagens de lojas de negócios
- **mercado_secundario** - Negociação de tokens P2P com escrow e resolução de disputas
- **administrador** - Painel de administração para gerenciamento de usuários e configuração do valor do token
- **cursos** - Gerenciamento de cursos e certificações
- **configuracoes** - Configurações de privacidade/visibilidade do usuário
- **log** - Registro de logs e tratamento de erros da aplicação
- **utils** - Utilitários compartilhados (paginação, filtragem de consultas)
- **services** - Camada de lógica de negócios

### Modelos e Relacionamentos Chave

**Sistema de Usuários** (app members):
- `Users` - Modelo de usuário estendido do Django com campos para carteiras de cripto (endereço BSC, Lightning Network)
- `Profile` - Dados de gamificação (nível, pontos, esquadrão, foto de perfil)
- `Squad` - Atribuições de equipes/grupos com URLs de chat
- `ProfilePendencia` - Rastreia tarefas pendentes que os usuários devem completar por nível

**Gamificação** (app rating):
- `Nivel` - Hierarquia de 5 níveis: Aprendiz (5pts) → Escudeiro (15pts) → Cavaleiro (30pts) → Conselheiro (40pts) → Guardião (40pts)
- `Atividade` - Tipos de atividades que concedem pontos
- `LogRating` - Trilha de auditoria de todas as transações de pontos
- `Pendencia` - Requisitos/tarefas associadas a cada nível

**Governança** (app propostas):
- `Proposta` - Propostas com anexos de arquivo e verificação de hash SHA256
- `Voto` - Registros de votação (booleano: a favor/contra)
- Sistema de votação integrado à blockchain

**Marketplace** (app marketplace):
- `Anuncio` - Anúncios classificados com departamentos (Agro, Alimentação, Auto, Eletrônicos, etc.)
- `Loja` - Lojas de negócios com integração de mídias sociais
- `Images` - Múltiplas imagens por anúncio
- `ComentarioAnuncio` - Comentários/avaliações de anúncios

**Valor do Token** (app administrador):
- `ValorToken` - Rastreia o valor do token em BRL para cálculos de câmbio

### Configuração do Banco de Dados

- **Motor**: MySQL/MariaDB com InnoDB
- **Conexão**: Configurada via variáveis de ambiente (arquivo .env)
- **Configurações**: Pooling de conexão ativado, modo de transação estrito
- **Caminhos de produção**: /var/www/fraguismo/media/, /var/www/fraguismo/static/

### Integração Web3/Blockchain

**Smart Chain**: Graphene Smart Chain Testnet (Chain ID: 17027)

**Recursos Web3**:
- Conexão com a carteira MetaMask (site_fraguismo/static/js/web3/wallet.js)
- Interações com contratos inteligentes para votação, operações de token, distribuição de graça
- Armazenamento de endereços de carteira BSC e Lightning Network
- Biblioteca ethers.js para interações com a blockchain

**Operações de Contrato Chave**:
- Votação de propostas on-chain
- Operações de compra/retirada de tokens
- Distribuição do token graça

### Padrões de Organização de Código

**Estrutura de URL**:
- URLs principais em `fraguismo/urls.py`
- Rotas específicas de aplicativos em pastas `routes/` dedicadas
- Exemplo: `members/routes/members.py`, `propostas/routes/propostas.py`

**Organização de Views**:
- Aplicativos maiores separam as views por função em diretórios `views/`
- Autenticação necessária para a maioria das views (decorador `@login_required`)
- Verificações de permissão com base no nível do usuário (`Profile.nivel`)
- Views exclusivas para superusuários usam `@user_passes_test(lambda u: u.is_superuser)`

**Camada de Serviço**:
- Lógica de negócios extraída para o diretório `services/`
- `QueryFilterService` - Detecta o tipo de consulta (telefone, e-mail, ID, Instagram, nome de usuário)
- Promove a reutilização de código entre as views

**Convenções de Nomenclatura**:
- Português em todo o código (modelos, views, URLs, templates)
- snake_case para código Python
- kebab-case para padrões de URL
- Inglês para termos técnicos (ex: nomes de campos de modelo como `created_at`)

### Autenticação e Permissões

**Modelo de Usuário**: Modelo `Users` personalizado que estende o `User` integrado do Django
- O campo de e-mail é único e obrigatório
- Campos adicionais: carteiras de cripto, perfil do Instagram, rastreamento de indicações, aceitação do código de conduta

**Controle de Acesso**:
- Permissões baseadas em nível (apenas certos níveis podem criar propostas, votar, etc.)
- Requisitos de preenchimento de perfil (`ProfilePendencia`)
- Separação entre administrador e usuário regular

**Recursos de Segurança**:
- Validação de upload de arquivos (tipo, tamanho)
- Armazenamento de hash SHA256 para integridade de arquivos (propostas)
- Proteção CSRF ativada
- ORM previne injeção de SQL
- Manipuladores de erro personalizados (404, 500, 403, 400) no app de log

### Dependências Externas

**Bibliotecas Chave**:
- django-bootstrap5 - Integração do Bootstrap 5 para o frontend
- mysqlclient - Driver de banco de dados MySQL
- Pillow - Processamento de imagens para fotos de perfil e imagens de anúncios
- python-decouple - Gerenciamento de configuração de ambiente
- beautifulsoup4 - Análise de HTML

**Configuração de E-mail**:
- Backend SMTP (Office365)
- Usado para redefinição de senhas e notificações
- Configurado via variáveis de ambiente

### Armazenamento de Arquivos

**Arquivos de Mídia**:
- Desenvolvimento: Pasta de mídia local
- Produção: /var/www/fraguismo/media/
- Uploads de usuários: fotos de perfil, imagens de anúncios, documentos de propostas
- Processamento de imagens via Pillow

**Arquivos Estáticos**:
- Produção: /var/www/fraguismo/static/
- Inclui JavaScript personalizado (integração Web3), CSS/SCSS, Bootstrap

## Implantação

**CI/CD**: Fluxo de trabalho do GitHub Actions em push para a branch `develop`
- Arquivo: .github/workflows/deploy-develop.yml
- Método: SSH para VPS, executa deploy_teste.sh
- Alvo: Ambiente de teste/homologação

**Ambiente**: Hospedagem baseada em VPS com ambientes de desenvolvimento/produção separados

## Considerações Importantes

1. **Todo o conteúdo voltado para o usuário está em português** - mantenha esta convenção
2. **A gamificação é central** - os usuários progridem através de 5 níveis ganhando pontos
3. **Integração com blockchain** - teste exaustivamente com a testnet da Graphene antes da produção
4. **Acesso baseado em permissão** - sempre verifique o nível do usuário antes de permitir operações sensíveis
5. **Integridade de arquivos** - as propostas usam hash SHA256 para verificação de documentos
6. **Sistema de escrow** - o mercado_secundario tem um fluxo complexo de comprador/vendedor/árbitro
7. **Rastreamento de indicações** - usuários podem ser indicados por outros (campo `quem_indicou`)
8. **Específico do MySQL** - as migrações podem precisar de ajustes para outros bancos de dados
