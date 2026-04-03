import calendar
from datetime import date, timedelta

from django.core.management.base import BaseCommand, CommandError
from django.db.models import Sum

from members.models.profile import Profile
from ranking.models.ranking_periodico import RankingPeriodico
from rating.models.log_rating import LogRating


class Command(BaseCommand):
    help = (
        'Fecha o ranking periódico. '
        'Uso: fechar_ranking semanal|mensal|anual'
    )

    def add_arguments(self, parser):
        parser.add_argument(
            'tipo',
            choices=['semanal', 'mensal', 'anual'],
            help='Tipo de período a fechar: semanal, mensal ou anual',
        )

    def handle(self, *args, **options):
        tipo = options['tipo']
        hoje = date.today()

        if tipo == 'semanal':
            self._fechar_semanal(hoje)
        elif tipo == 'mensal':
            self._fechar_mensal(hoje)
        elif tipo == 'anual':
            self._fechar_anual(hoje)

    # ------------------------------------------------------------------
    # Semanal — executar todo sábado às 23:59
    # ------------------------------------------------------------------
    def _fechar_semanal(self, hoje):
        # Janela: segunda-feira até hoje (sábado inclusive)
        segunda = hoje - timedelta(days=hoje.weekday())
        self._salvar_por_lograting(hoje, 'semanal', segunda, hoje)

    # ------------------------------------------------------------------
    # Mensal — executar diariamente nos dias 28-31; o comando verifica
    # se hoje é o último dia do mês antes de agir.
    # ------------------------------------------------------------------
    def _fechar_mensal(self, hoje):
        ultimo_dia = calendar.monthrange(hoje.year, hoje.month)[1]
        if hoje.day != ultimo_dia:
            self.stdout.write(
                self.style.WARNING(
                    f'Hoje ({hoje}) não é o último dia do mês ({ultimo_dia}). Nada salvo.'
                )
            )
            return

        inicio_mes = hoje.replace(day=1)
        self._salvar_por_lograting(hoje, 'mensal', inicio_mes, hoje)

    # ------------------------------------------------------------------
    # Anual — soma os rankings mensais do ano corrente
    # ------------------------------------------------------------------
    def _fechar_anual(self, hoje):
        fraguistas = Profile.objects.filter(user__is_fraguista=True).select_related('user')

        salvos = 0
        for profile in fraguistas:
            total = (
                RankingPeriodico.objects
                .filter(
                    user=profile.user,
                    tipo='mensal',
                    data__year=hoje.year,
                )
                .aggregate(total=Sum('pontuacao'))['total'] or 0
            )

            RankingPeriodico.objects.update_or_create(
                user=profile.user,
                tipo='anual',
                data=hoje,
                defaults={'pontuacao': total},
            )
            salvos += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Ranking anual {hoje.year} fechado: {salvos} fraguista(s) salvos.'
            )
        )

    # ------------------------------------------------------------------
    # Utilitário — soma pontuacao_ganha do LogRating no período
    # ------------------------------------------------------------------
    def _salvar_por_lograting(self, data_ref, tipo, data_inicio, data_fim):
        from datetime import datetime, time
        from zoneinfo import ZoneInfo
        from django.utils import timezone

        # Converter datas para datetimes com timezone para filtrar updated_at
        tz = ZoneInfo(str(timezone.get_current_timezone()))
        inicio_dt = datetime.combine(data_inicio, time(0, 0, 0), tzinfo=tz)
        fim_dt = datetime.combine(data_fim, time(23, 59, 0), tzinfo=tz)

        fraguistas = Profile.objects.filter(user__is_fraguista=True).select_related('user')

        salvos = 0
        for profile in fraguistas:
            total = (
                LogRating.objects
                .filter(
                    user_id=profile.user,
                    updated_at__gte=inicio_dt,
                    updated_at__lte=fim_dt,
                )
                .aggregate(total=Sum('pontuacao_ganha'))['total'] or 0
            )

            RankingPeriodico.objects.update_or_create(
                user=profile.user,
                tipo=tipo,
                data=data_ref,
                defaults={'pontuacao': total},
            )
            salvos += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Ranking {tipo} de {data_ref} fechado: {salvos} fraguista(s) salvos.'
            )
        )
