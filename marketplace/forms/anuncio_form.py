from django import forms
from marketplace.models.anuncio import Anuncio


class AnuncioForm(forms.ModelForm):    
    class Meta:
        model = Anuncio
        fields = [
            'titulo', 
            'descricao', 
            'status_anuncio', 
            'preco',
            'departamento',  # Adicionando o campo departamento
        ]
        widgets = {
            'titulo': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Título do Anúncio'}),
            'descricao': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Descrição'}),
            'status_anuncio': forms.Select(attrs={'class': 'form-select'}),
            'preco': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Preço'}),
            'departamento': forms.Select(attrs={'class': 'form-select'}),  # Configurando o widget
        }
