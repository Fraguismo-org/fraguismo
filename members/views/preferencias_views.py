from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required(login_url='login')
def preferencias(request):
    if request.method == 'POST':
        mostra_email = request.post.get()
        mostra_nome = request.post.get()
        mostra_localidade = request.post.get()
        mostra_telefone = request.post.get()
        mostra_instagram = request.post.get()
        mostra_aniversario = request.post.get()
        mostra_profissao = request.post.get()
        mostra_carteira_polygon = request.post.get()
        mostra_carteira_lightining = request.post.get()
        return render(request, 'members/preferencias.html')
    return render(request, 'members/preferencias.html')