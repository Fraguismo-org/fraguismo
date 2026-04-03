"""
Popula o banco com usuários e rankings fictícios para testes.
Remove os dados de teste com: python manage.py popular_ranking_teste --limpar
"""
import random
import calendar
from datetime import date, timedelta, datetime, time
from zoneinfo import ZoneInfo

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from members.models.profile import Profile
from members.models.users import Users
from ranking.models.ranking_periodico import RankingPeriodico
from rating.models.atividade import Atividade
from rating.models.log_rating import LogRating
from rating.models.nivel import Nivel


NOMES_TESTE = [
    'aragorn', 'legolas', 'gimli', 'gandalf', 'boromir',
    'frodo', 'samwise', 'meriadoc', 'peregrin', 'faramir',
]

PREFIX = 'teste_'


class Command(BaseCommand):
    help = 'Popula rankings fictícios para testes. Use --limpar para remover.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--limpar',
            action='store_true',
            help='Remove todos os dados de teste criados por este comando',
        )

    def handle(self, *args, **options):
        if options['limpar']:
            self._limpar()
        else:
            self._popular()

    # ------------------------------------------------------------------

    @transaction.atomic
    def _popular(self):
        nivel_base = Nivel.objects.order_by('id').first()
        if not nivel_base:
            raise Exception('Nenhum Nivel cadastrado. Crie ao menos um antes de rodar este comando.')

        usuarios = self._criar_usuarios(nivel_base)
        self._criar_log_ratings(usuarios)
        self._criar_rankings(usuarios)

        self.stdout.write(self.style.SUCCESS(
            f'{len(usuarios)} usuário(s) de teste criados com LogRating e rankings semanal, mensal e anual.'
        ))

    def _criar_usuarios(self, nivel_base):
        usuarios = []
        for nome in NOMES_TESTE:
            username = f'{PREFIX}{nome}'
            member, created = Users.objects.get_or_create(
                username=username,
                defaults={
                    'email': f'{username}@teste.fraguismo',
                    'first_name': nome.capitalize(),
                    'is_fraguista': True,
                    'aonde': 'teste',
                },
            )
            if not created:
                member.is_fraguista = True
                member.save(update_fields=['is_fraguista'])

            profile, _ = Profile.objects.get_or_create(
                user=member,
                defaults={'nivel_id': nivel_base},
            )
            profile.nivel_id = nivel_base
            profile.pontuacao = random.randint(10, 500)
            profile.save(update_fields=['nivel_id', 'pontuacao'])

            usuarios.append(member)

        return usuarios

    def _criar_log_ratings(self, usuarios):
        """Cria entradas de LogRating distribuídas nas últimas 4 semanas."""
        tz = ZoneInfo(str(timezone.get_current_timezone()))
        hoje = date.today()
        atividade = Atividade.objects.first()

        for user in usuarios:
            profile = Profile.objects.get(user=user)
            # 5 a 15 lançamentos por usuário nos últimos 28 dias
            for _ in range(random.randint(5, 15)):
                dias_atras = random.randint(0, 27)
                hora = random.randint(8, 22)
                dt = datetime.combine(
                    hoje - timedelta(days=dias_atras),
                    time(hora, random.randint(0, 59)),
                    tzinfo=tz,
                )
                pontos = random.randint(1, 50)
                log = LogRating(
                    user_id=user,
                    pontuacao_ganha=pontos,
                    pontuacao=profile.pontuacao,
                    atividade=atividade,
                    updated_by=0,
                )
                # Sobrescreve o auto_now para simular datas passadas
                LogRating.objects.filter(pk=log.pk).update(updated_at=dt) if log.pk else None
                log.save()
                LogRating.objects.filter(pk=log.pk).update(updated_at=dt)

    def _criar_rankings(self, usuarios):
        hoje = date.today()

        # Semanal: últimas 4 semanas (sábados)
        sabados = [hoje - timedelta(weeks=i) for i in range(4)]
        sabados = [d - timedelta(days=(d.weekday() - 5) % 7) for d in sabados]

        for sabado in sabados:
            for user in usuarios:
                RankingPeriodico.objects.update_or_create(
                    user=user, tipo='semanal', data=sabado,
                    defaults={'pontuacao': random.randint(1, 150)},
                )

        # Mensal: últimos 12 meses (último dia de cada mês)
        meses = []
        ano, mes = hoje.year, hoje.month
        for _ in range(12):
            ultimo = calendar.monthrange(ano, mes)[1]
            meses.append(date(ano, mes, ultimo))
            mes -= 1
            if mes == 0:
                mes = 12
                ano -= 1

        for data_mes in meses:
            for user in usuarios:
                RankingPeriodico.objects.update_or_create(
                    user=user, tipo='mensal', data=data_mes,
                    defaults={'pontuacao': random.randint(10, 600)},
                )

        # Anual: último dia dos últimos 3 anos
        for delta_ano in range(3):
            ano_ref = hoje.year - delta_ano
            data_anual = date(ano_ref, 12, 31)
            for user in usuarios:
                RankingPeriodico.objects.update_or_create(
                    user=user, tipo='anual', data=data_anual,
                    defaults={'pontuacao': random.randint(200, 5000)},
                )

    # ------------------------------------------------------------------

    @transaction.atomic
    def _limpar(self):
        usernames = [f'{PREFIX}{n}' for n in NOMES_TESTE]
        users = Users.objects.filter(username__in=usernames)

        ranking_deletados, _ = RankingPeriodico.objects.filter(user__in=users).delete()
        log_deletados, _ = LogRating.objects.filter(user_id__in=users).delete()
        profile_deletados, _ = Profile.objects.filter(user__in=users).delete()
        user_deletados, _ = users.delete()

        self.stdout.write(self.style.SUCCESS(
            f'Removidos: {user_deletados} usuário(s), '
            f'{profile_deletados} profile(s), '
            f'{ranking_deletados} registro(s) de ranking, '
            f'{log_deletados} log(s) de rating.'
        ))
