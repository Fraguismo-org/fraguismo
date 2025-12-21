# Configuração de Deploy Automático

Este repositório está configurado para fazer deploy automático na VPS quando houver push na branch `develop`.

## Secrets Necessários

Para o workflow funcionar corretamente, você precisa configurar os seguintes secrets no GitHub:

### Como adicionar secrets:
1. Vá até o repositório no GitHub
2. Clique em **Settings** > **Secrets and variables** > **Actions**
3. Clique em **New repository secret**
4. Adicione cada um dos secrets abaixo:

### Secrets Obrigatórios:

- **VPS_HOST**: Endereço IP ou hostname da VPS
  - Exemplo: `192.168.1.100` ou `servidor.exemplo.com`

- **VPS_USERNAME**: Nome de usuário SSH para acessar a VPS
  - Exemplo: `root` ou `ubuntu`

- **VPS_SSH_KEY**: Chave privada SSH para autenticação
  - Para gerar uma nova chave (se necessário):
    ```bash
    ssh-keygen -t ed25519 -C "github-actions"
    ```
  - Cole o conteúdo completo do arquivo de chave privada (normalmente `~/.ssh/id_ed25519`)
  - Certifique-se de adicionar a chave pública correspondente ao arquivo `~/.ssh/authorized_keys` na VPS

- **VPS_PORT**: Porta SSH da VPS
  - Exemplo: `22` (porta padrão)

- **VPS_DEPLOY_PATH**: Caminho completo onde o script `deploy_teste.sh` está localizado na VPS
  - Exemplo: `/home/user/app` ou `/var/www/projeto`

## Configuração de Sudo na VPS

Como o script `deploy_teste.sh` precisa executar comandos `systemctl`, é necessário configurar o sudo sem senha na VPS.

### Opção 1: Usar usuário root (mais simples, menos seguro)
Configure o secret `VPS_USERNAME` como `root` e não precisa de configuração adicional.

### Opção 2: Configurar sudo sem senha (RECOMENDADO)

Na VPS, execute os seguintes comandos:

```bash
# Substitua 'seu_usuario' pelo usuário configurado em VPS_USERNAME
sudo visudo
```

Adicione uma das seguintes linhas no final do arquivo:

**Para permitir todos os comandos sem senha** (mais simples):
```
seu_usuario ALL=(ALL) NOPASSWD: ALL
```

**Para permitir apenas comandos específicos** (mais seguro):
```
seu_usuario ALL=(ALL) NOPASSWD: /bin/systemctl restart *, /bin/systemctl start *, /bin/systemctl stop *, /bin/bash /caminho/completo/deploy_teste.sh
```

Salve e saia (CTRL+X, depois Y, depois Enter).

Teste se funciona:
```bash
sudo systemctl status nome-do-servico
```

Se não pedir senha, está configurado corretamente.

## Workflow

O arquivo [.github/workflows/deploy-develop.yml](.github/workflows/deploy-develop.yml) contém a configuração do workflow que:

1. É acionado automaticamente quando há push na branch `develop`
2. Conecta-se à VPS via SSH
3. Navega até o diretório configurado
4. Executa o script `deploy_teste.sh` com sudo

## Testando

Após configurar os secrets, faça um push na branch `develop` e acompanhe a execução em:
- **Actions** tab no repositório do GitHub

## Troubleshooting

### Problema: SSH pedindo senha mesmo com chave configurada

Se o SSH continua pedindo senha mesmo após adicionar a chave pública em `authorized_keys`, verifique:

#### 1. Permissões dos arquivos na VPS (MUITO IMPORTANTE)
```bash
# Na VPS, execute estes comandos como o usuário que vai receber a conexão:
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chown -R $USER:$USER ~/.ssh
```

As permissões **devem** ser exatamente essas, senão o SSH ignora o arquivo por segurança.

#### 2. Verifique se a chave pública está correta
```bash
# Na VPS, veja o conteúdo do authorized_keys:
cat ~/.ssh/authorized_keys
```

Cada linha deve começar com `ssh-rsa`, `ssh-ed25519`, ou similar, seguido de uma string longa.

#### 3. Verifique se está usando a chave correta
```bash
# No seu computador, veja sua chave pública:
cat ~/.ssh/id_rsa.pub
# ou
cat ~/.ssh/id_ed25519.pub
```

O conteúdo deve ser **exatamente igual** ao que está no `authorized_keys` da VPS.

#### 4. Teste a conexão com modo verboso
```bash
# No seu computador:
ssh -v seu_usuario@ip_da_vps
```

Isso mostra detalhes do processo de autenticação. Procure por linhas como:
- `Offering public key` - está tentando usar a chave
- `Server accepts key` - servidor aceitou
- `Permission denied` - algo está errado

#### 5. Verifique a configuração do SSH na VPS
```bash
# Na VPS, verifique o arquivo de configuração:
sudo cat /etc/ssh/sshd_config
```

Certifique-se que estas linhas estão habilitadas (sem `#` na frente):
```
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
```

Se precisou alterar, reinicie o SSH:
```bash
sudo systemctl restart sshd
```

#### 6. Verifique o SELinux (em sistemas Red Hat/CentOS)
```bash
# Na VPS:
restorecon -R ~/.ssh
```

### Outros problemas comuns

Se o deploy falhar, verifique:
- Se todos os secrets estão configurados corretamente
- Se a chave SSH tem permissões corretas (600 no seu computador)
- Se o script `deploy_teste.sh` existe no caminho especificado
- Se o script tem permissão de execução (`chmod +x deploy_teste.sh`)
- Os logs na aba Actions do GitHub

### Testando a conexão SSH manualmente

Antes de usar o GitHub Actions, teste a conexão manualmente:
```bash
# Use a mesma chave que vai configurar no GitHub:
ssh -i ~/.ssh/sua_chave_privada seu_usuario@ip_da_vps

# Se funcionar sem pedir senha, o GitHub Actions também vai funcionar
```
