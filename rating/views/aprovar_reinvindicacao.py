from django.contrib import messages
from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import render, get_object_or_404, redirect

from log.models.log import Log
from members.models.profile import Profile
from rating.models.fotos_pro_liberdade import FotosProLiberdade
from rating.models.pro_liberadade import ProLiberdade
from rating.services.pontos_service import PontosService


SORT_OPTIONS = {
    'username': 'user__username',
    '-username': '-user__username',
    'evento': 'evento',
    '-evento': '-evento',
    'data_evento': 'data_evento',
    '-data_evento': '-data_evento',
    'created_at': 'created_at',
    '-created_at': '-created_at',
}


@user_passes_test(lambda u: u.is_superuser)
def aprovar_reinvindicacao(request, id=None):
    if request.method == 'POST' and id:
        action = request.POST.get('action')
        if action == 'aprovar':
            return _aprovar(request, id)
        if action == 'negar':
            return _negar(request, id)

    try:
        sort = request.GET.get('sort', '-created_at')
        order_by = SORT_OPTIONS.get(sort, '-created_at')

        reinvindicacoes = (
            ProLiberdade.objects
            .filter(is_approved=False, is_denied=False)
            .select_related('user')
            .prefetch_related('fotos')
            .order_by(order_by)
        )

        return render(request, 'aprovar_reinvindicacao.html', {
            'reinvindicacoes': reinvindicacoes,
            'current_sort': sort,
        })
    except Exception as e:
        Log.salva_log(e)
        return render(request, 'aprovar_reinvindicacao.html', {
            'reinvindicacoes': [],
            'current_sort': '-created_at',
        })


def _aprovar(request, id):
    reinvindicacao = get_object_or_404(ProLiberdade, id=id, is_approved=False, is_denied=False)

    try:
        pontos = int(request.POST.get('pontos', 0))
        if pontos <= 0:
            messages.warning(request, 'A pontuação deve ser maior que zero.')
            return redirect('aprovar_reinvindicacao')

        profile = Profile.objects.get(user=reinvindicacao.user)
        resultado = PontosService.editar(profile, pontos, request.user.id)

        if not resultado['result']:
            messages.warning(request, resultado['message'])
            return redirect('aprovar_reinvindicacao')

        reinvindicacao.is_approved = True
        reinvindicacao.updated_by = request.user.id
        reinvindicacao.save()

        messages.success(request, f'Reinvindicação de {reinvindicacao.user.username} aprovada com {pontos} pontos.')
    except Exception as e:
        Log.salva_log(e)
        messages.warning(request, 'Erro ao aprovar reinvindicação.')

    return redirect('aprovar_reinvindicacao')


def _negar(request, id):
    reinvindicacao = get_object_or_404(ProLiberdade, id=id, is_approved=False, is_denied=False)

    try:
        deny_reason = request.POST.get('deny_reason', '').strip()

        if deny_reason:
            num_palavras = len(deny_reason.split())
            if num_palavras <= 4 or len(deny_reason) >= 255:
                messages.warning(request, 'O motivo deve conter mais de 4 palavras e menos de 255 caracteres.')
                return redirect('aprovar_reinvindicacao')

        reinvindicacao.is_denied = True
        reinvindicacao.deny_reason = deny_reason
        reinvindicacao.updated_by = request.user.id
        reinvindicacao.save()

        messages.success(request, f'Reinvindicação de {reinvindicacao.user.username} negada.')
    except Exception as e:
        Log.salva_log(e)
        messages.warning(request, 'Erro ao negar reinvindicação.')

    return redirect('aprovar_reinvindicacao')


@user_passes_test(lambda u: u.is_superuser)
def remover_foto_pro_liberdade(request, foto_id):
    if request.method != 'POST':
        return redirect('aprovar_reinvindicacao')

    foto = get_object_or_404(FotosProLiberdade, id=foto_id)

    try:
        if foto.foto and foto.foto.storage.exists(foto.foto.name):
            foto.foto.delete(save=False)

        foto.delete()
        messages.success(request, 'Foto removida com sucesso.')
    except Exception as e:
        Log.salva_log(e)
        messages.warning(request, 'Erro ao remover foto.')

    return redirect('aprovar_reinvindicacao')
