from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms


class RegisterUserForm(UserCreationForm):
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class':'form-control'}), label='E-mail *', label_suffix='')
    first_name = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class':'form-control'}), label='Nome *', label_suffix='')
    last_name = forms.CharField(max_length=50, widget=forms.TextInput(attrs={'class':'form-control'}), label='Sobrenome *', label_suffix='')
    city = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class':'form-control'}), label='Cidade *', label_suffix='')
    fone = forms.CharField(max_length=30, widget=forms.TextInput(attrs={'class':'form-control'}), label='Telefone *', label_suffix='')
    instagram = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class':'form-control'}), required=False, label='Instagram')
    birth = forms.DateField(widget=forms.DateInput(attrs={'class':'form-control', 'type': 'date'}), label='Data de nascimento *', label_suffix='')
    job_title = forms.CharField(max_length=255, widget=forms.TextInput(attrs={'class':'form-control'}), label='Profissão *', help_text='Ex.: Programador Backend Java.', label_suffix='')
    lightining_wallet = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class': 'form-control'}), label='Carteira Lightining', required=False)
    bsc_wallet = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class': 'form-control'}), label='Carteira BSC', required=False)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2', 'city', 'fone', 'instagram', 'birth', 'job_title')

    def __init__(self, *args, **kwargs):
        super(RegisterUserForm, self).__init__(*args, **kwargs)
        self.fields['username'].widget.attrs['class'] = 'form-control'
        self.fields['username'].label_suffix = ' *'
        self.fields['password1'].widget.attrs['class'] = 'form-control'
        self.fields['password1'].label_suffix = ' *'
        self.fields['password2'].widget.attrs['class'] = 'form-control'
        self.fields['password2'].label_suffix = ' *'
