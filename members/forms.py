from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms


class RegisterUserForm(UserCreationForm):
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class':'form-control'}), label='E-mail')
    first_name = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class':'form-control'}), label='Nome')
    last_name = forms.CharField(max_length=50, widget=forms.TextInput(attrs={'class':'form-control'}), label='Sobrenome')
    city = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class':'form-control'}), label='Cidade')
    fone = forms.CharField(max_length=30, widget=forms.TextInput(attrs={'class':'form-control'}), label='Telefone')
    instagram = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class':'form-control'}))
    birth = forms.DateField(widget=forms.DateInput(attrs={'class':'form-control', 'type': 'date'}), label='Data de nascimento')
    # Extender para aceitar separacao por virgula
    job_title = forms.CharField(max_length=255, widget=forms.TextInput(attrs={'class':'form-control'}), label='Profissão', help_text='Ex.: Programador Backend Java.')
    lightining_wallet = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class': 'form-control'}), label='Carteira Lightining')
    bsc_wallet = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class': 'form-control'}), label='Carteira BSC')

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2', 'city', 'fone', 'instagram', 'birth', 'job_title')

    def __init__(self, *args, **kwargs):
        super(RegisterUserForm, self).__init__(*args, **kwargs)
        self.fields['username'].widget.attrs['class'] = 'form-control'
        self.fields['password1'].widget.attrs['class'] = 'form-control'
        self.fields['password2'].widget.attrs['class'] = 'form-control'
