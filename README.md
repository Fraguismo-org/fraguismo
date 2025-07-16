# Configurando o projeto

1. Clone o repositório
2. Crie uma virtual environment com Python
`$python -m venv .venv`
3. Ative a virtual environment
**Windows**
`.venv/Script/Activate.ps1`
**Linux**
`$source .venv/bin/activate`
4. Instale as dependencias
`pip install -r requirements/requirements.txt`

5. Fazer o migration  `python manage.py makemigrations`  `python manage.py migrate`
6. Rode o projeto
`python manage.py runserver`

### O padrão da url é http://localhost:8000

