from django import forms
from marketplace.models.anuncio import Anuncio
from marketplace.models.image import Images

class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True

class MultipleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('widget', MultipleFileInput())
        super().__init__(*args, **kwargs)

    def clea(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            result = [single_file_clean(d, initial) for d in data]
        else:
            result = single_file_clean(data, initial)
        return result

class AnuncioForm(forms.ModelForm):
    images = MultipleFileField(label="Escolha as fotos", required=False)
    class Meta:
        model = Anuncio
        fields = [
            'titulo', 
            'descricao', 
            'status_anuncio', 
            'preco', 
            'images'
            ]
        widgets = {
            'titulo': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Título do Anúncio'}),
            'descricao': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Descrição'}),
            'status_anuncio': forms.Select(attrs={'class': 'form-select'}),
            'preco': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Preço'}),
        }