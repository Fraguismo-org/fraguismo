from django import forms
from marketplace.models.anuncio import Anuncio


class AnuncioForm(forms.Form):
    class Meta:
        model = Anuncio
        fields = ['cod_anuncio', 'titulo', 'status_anuncio', 'preco']

