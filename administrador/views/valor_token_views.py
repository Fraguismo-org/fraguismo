from django.contrib import messages
from django.contrib.auth.decorators import user_passes_test 
from django.shortcuts import render

from administrador.models.fraga_token_valor import ValorToken

@user_passes_test(lambda u: u.is_superuser)
def valor_token(request):
    if request.method == 'POST':
        try:
            valor_brl = request.POST.get('valor_brl')
            valor_brl = valor_brl.replace('.', '').split(',')[0]
            numeric_value = None
            if str.isnumeric(valor_brl):
                numeric_value = int(valor_brl)
            fraga_token_valor = ValorToken(valor_brl=numeric_value)
            fraga_token_valor.save()
        except Exception as e:
            messages.error(request, f'Erro ao adicionar valor: {e}')
    historico = ValorToken.objects.all().order_by('-created_at')[:30]
    return render(request, 'valor_token.html', {'tokens': historico})