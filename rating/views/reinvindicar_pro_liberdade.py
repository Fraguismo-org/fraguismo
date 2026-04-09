from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect, get_object_or_404
from django.views import View
from django.shortcuts import render

from log.models.log import Log
from members.models.users import Users
from rating.models.pro_liberadade import ProLiberdade
from rating.models.fotos_pro_liberdade import FotosProLiberdade


class ReinvindicarProLiberdadeView(LoginRequiredMixin, View):
    login_url = 'login'
    template_name = 'reinvindicar_pro_liberdade.html'

    def get_reinvindicacao(self, request, id):
        if id:
            return get_object_or_404(ProLiberdade, id=id, user=request.user)
        return None

    def get(self, request, id=None):
        reinvindicacao = self.get_reinvindicacao(request, id)
        fotos = reinvindicacao.fotos.all() if reinvindicacao else []

        return render(request, self.template_name, {
            'reinvindicacao': reinvindicacao,
            'fotos': fotos,
        })

    def post(self, request, id=None):
        reinvindicacao = self.get_reinvindicacao(request, id)

        try:
            if reinvindicacao is None:
                reinvindicacao = ProLiberdade()
                reinvindicacao.user = Users.objects.get(id=request.user.id)

            reinvindicacao.evento = request.POST.get('evento')
            reinvindicacao.data_evento = request.POST.get('data_evento')
            reinvindicacao.local_evento = request.POST.get('local_evento')
            reinvindicacao.updated_by = reinvindicacao.user.user_ptr.id
            reinvindicacao.save()

            self.salvar_fotos(request, reinvindicacao)

            messages.success(request, 'Reivindicação salva com sucesso!')
            return redirect('user_log_rating')
        except Exception as e:
            Log.salva_log(e)
            messages.warning(request, 'Erro ao salvar reivindicação.')

        fotos = reinvindicacao.fotos.all() if reinvindicacao else []
        return render(request, self.template_name, {
            'reinvindicacao': reinvindicacao,
            'fotos': fotos,
        })

    def salvar_fotos(self, request, reinvindicacao):
        fotos = request.FILES.getlist('fotos')
        visibilidades = request.POST.getlist('foto_publica[]')
        fotos_manter = request.POST.getlist('foto_existente[]')

        reinvindicacao.fotos.exclude(id__in=fotos_manter).delete()

        offset = len(fotos_manter)
        for i, foto in enumerate(fotos):
            is_public = str(i + offset) in visibilidades
            FotosProLiberdade.objects.create(
                pro_liberdade=reinvindicacao,
                foto=foto,
                is_public=is_public,
            )
