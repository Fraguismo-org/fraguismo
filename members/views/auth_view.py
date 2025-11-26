from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect

from members.models.profile import Profile
from members.models.profile_pendencia import ProfilePendencia
from members.models.questionario import Questionario
from members.models.users import Users
from rating.models.log_rating import LogRating


def login_user(request):
    if request.method == "POST":
        username = request.POST.get('username', None)
        password = request.POST.get('password', None)
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('user_page')
        else:
            messages.success(request, ("E-mail ou senha não encontrado!"))
            return redirect('login')
    return render(request, 'authenticate/login.html', {})

def logout_user(request):
    logout(request)
    messages.success(request, ("Deslogado com sucesso. Volte sempre!"))
    return redirect('login')


def register_user(request):
    if request.method == "POST":
        user  = Users()
        user.is_fraguista = request.POST.get('fraguista', None) == 'on'
        user.codigo_conduta = request.POST.get('codigo_conduta', None) == 'on'
        user.username = request.POST.get('username', None)
        user.email = request.POST.get('email', None)
        if Users.objects.filter(username=user.username).exists():
            messages.warning(request, f'Usu�rio {user.username} já está em uso!')
            return render(request, 'authenticate/register_user.html')
        if Users.objects.filter(email=user.email).exists():
            messages.error(request, f'E-mail {user.email} já está em uso!')
            return render(request, 'authenticate/register_user.html')
        password = request.POST.get('password', None)
        password2 = request.POST.get('password2', None)
        if password == password2:
            user.set_password(password)
        else:
            messages.error(request, 'Os campos de senha devem coincidir.')
            return render(request, 'authenticate/register_user.html')
        if user.is_fraguista:
            user.first_name = request.POST.get('first_name', None)
            user.last_name = request.POST.get('last_name', None)
            user.city = request.POST.get('city', None)
            user.fone = request.POST.get('fone', None)
            user.instagram = request.POST.get('instagram', None)
            user.birth = request.POST.get('birth', None)
            user.job_title = request.POST.get('job_title', None)
            user.lightning_wallet = request.POST.get('lightning_wallet', None)
            user.bsc_wallet = request.POST.get('bsc_wallet', None)
            user.como_conheceu = request.POST.get('como_conheceu', None)
            user.quem_indicou = request.POST.get('quem_indicou', None)
            user.aonde = request.POST.get('aonde', None)
            user.codigo_conduta = request.POST.get('termos_adesao', True)
            
            # question�rio obrigat�rio p/ novos fraguistas
            required_q_fields = {
                "help_project": "Como ajudar o projeto",
                "reason_to_participate": "Motivo para participar",
                "reason_to_accept": "Motivo para aceitar",
                "political_belief": "Crenca politica",
                "state_opinion": "Opinião sobre o Estado",
                "jusnaturalismo_vs_juspositivismo": "Jusnaturalismo vs Juspositivismo",
                "economic_values": "Valor econômico",
                "bitcoin_positive_characteristics": "Características positivas do Bitcoin",
                "game_theory_byzantine_generals": "Teoria dos jogos e generais bizantinos",
                "pna_and_argumentative_ethics": "PNA e ética argumentativa",
                "libertarian_knowledge_sources": "Conhecimento sobre libertarianismo",
                "bitcoin_knowledge_sources": "Conhecimento sobre Bitcoin",
            }
            questionario_respostas = {
                key: request.POST.get(key, "").strip()
                for key in required_q_fields.keys()
            }
            respostas_invalidas = [
                label for key, label in required_q_fields.items()
                if len(questionario_respostas.get(key, "")) < 50
            ]
            if respostas_invalidas:
                messages.error(request, "Preencha todas as respostas do questionário com no mínimo 50 caracteres.")
                return render(request, "authenticate/register_user.html")
            
        user.save()
        profile = Profile.get_or_create_profile(user_request=user)
        profile.save()

        if user.is_fraguista:
            Questionario.objects.update_or_create(
                profile=profile,
                defaults={
                    "help_project": request.POST.get("help_project", "").strip(),
                    "reason_to_participate": request.POST.get("reason_to_participate", "").strip(),
                    "reason_to_accept": request.POST.get("reason_to_accept", "").strip(),
                    "political_belief": request.POST.get("political_belief", "").strip(),
                    "state_opinion": request.POST.get("state_opinion", "").strip(),
                    "jusnaturalismo_vs_juspositivismo": request.POST.get("jusnaturalismo_vs_juspositivismo", "").strip(),
                    "economic_values": request.POST.get("economic_values", "").strip(),
                    "bitcoin_positive_characteristics": request.POST.get("bitcoin_positive_characteristics", "").strip(),
                    "game_theory_byzantine_generals": request.POST.get("game_theory_byzantine_generals", "").strip(),
                    "pna_and_argumentative_ethics": request.POST.get("pna_and_argumentative_ethics", "").strip(),
                    "libertarian_knowledge_sources": request.POST.get("libertarian_knowledge_sources", "").strip(),
                    "bitcoin_knowledge_sources": request.POST.get("bitcoin_knowledge_sources", "").strip(),
                },
            )

        if user.quem_indicou:
            indicacao(request, user)
        auth_user = authenticate(request, username=user.username, password=password)
        login(request, auth_user)
        messages.success(request, ("Conta criada com sucesso!"))       
        return redirect('user_page')
    return render(request, 'authenticate/register_user.html')

def indicacao(request, user):
    try:
        referrer_profile = Profile.objects.get(user__username=user.quem_indicou)
        LogRating.add_log_rating(referrer_profile, 2, user.id)        
        if len(ProfilePendencia.get_pendencias(referrer_profile)) == 0 and referrer_profile.is_next_level():
            referrer_profile.change_level()
        referrer_profile.pontuacao += 2
        referrer_profile.save()
        messages.success(request, f"{user.quem_indicou} ganhou 2 pontos por te indicar!")
    except Profile.DoesNotExist:
        messages.warning(request, f"Usuário que gerou o link ({user.quem_indicou}) não encontrado.")