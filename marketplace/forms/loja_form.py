from django import forms
from marketplace.models.loja import Loja



class LojaForm(forms.ModelForm):
    class Meta:
        model = Loja
        fields = ['nome', 'localidade', 'email', 'telefone', 'instagram', 'facebook', 'x_twitter', 'web_site', 'whatsapp', 'telegram']

    def __init__(self, *args, **kwargs):
        super(LojaForm, self).__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].widget.attrs['class'] = 'form-control'
