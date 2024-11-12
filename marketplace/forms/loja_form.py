from django import forms
from marketplace.models.loja import Loja

class LojaForm(forms.ModelForm):
    class Meta:
        model = Loja
        fields = [
            'logo',
            'nome',
            'descricao', 
            'localidade', 
            'email', 
            'telefone',
            'instagram',
            'facebook',
            'twitter',
            'web_site',
            'whatsapp',
            'telegram',
        ]

        widgets = {
            'nome': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nome da Loja'}),
            'descricao': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Descrição'}),
            'localidade': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Localidade'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email'}),
            'telefone': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Telefone'}),
            'instagram': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Instagram'}),
            'facebook': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Facebook'}),
            'twitter': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'X'}),
            'web_site': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Website'}),
            'whatsapp': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'WhatsApp'}),
            'telegram': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Telegram'}),
        }
