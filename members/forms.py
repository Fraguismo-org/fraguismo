from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User

class RegisterUserForm(UserCreationForm):
    COMO_CONHECEU_CHOICES = [
        ('instagram', 'Instagram'),
        ('facebook', 'Facebook'),
        ('twitter', 'Twitter'),
        ('telegram', 'Telegram'),
        ('amigos', 'Amigos'),
        ('youtube', 'YouTube'),
        ('indicacao', 'Indicação'),
        ('outros', 'Outros')
    ]
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control'}), label='E-mail *')
    first_name = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class': 'form-control'}), label='Nome *')
    last_name = forms.CharField(max_length=50, widget=forms.TextInput(attrs={'class': 'form-control'}), label='Sobrenome *')
    city = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class': 'form-control'}), label='Cidade *')
    fone = forms.CharField(max_length=30, widget=forms.TextInput(attrs={'class': 'form-control'}), label='Telefone *')
    instagram = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class': 'form-control'}), required=False, label='Instagram')
    birth = forms.DateField(widget=forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}), label='Data de nascimento *')
    job_title = forms.CharField(max_length=255, widget=forms.TextInput(attrs={'class': 'form-control'}), label='Profissão *', help_text='Ex.: Programador Backend Java.')
    lightining_wallet = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class': 'form-control'}), label='Carteira Lightining', required=False)
    bsc_wallet = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class': 'form-control'}), label='Carteira BSC', required=False)    
    como_conheceu = forms.ChoiceField(choices=COMO_CONHECEU_CHOICES, widget=forms.Select(attrs={'class': 'form-control'}), label='Como conheceu o Fraguismo? *')
    quem_indicou = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class': 'form-control', 'style': 'display:none;'}), required=False, label='Quem indicou?')
    aonde = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class': 'form-control', 'style': 'display:none;'}), required=False, label='Outros?')

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2', 'city', 'fone', 'instagram', 'birth', 'job_title', 'lightining_wallet', 'bsc_wallet', 'como_conheceu', 'quem_indicou', 'aonde')

    def __init__(self, *args, **kwargs):
        super(RegisterUserForm, self).__init__(*args, **kwargs)              
        self.fields['password1'].help_text = ('<ul class="password-instructions">''<li class="password-requirement">Sua senha não pode ser muito parecida com o resto das suas informações pessoais.</li><li class="password-requirement">Sua senha precisa conter pelo menos 8 caracteres.</li><li class="password-requirement">Sua senha não pode ser uma senha comumente utilizada.</li><li class="password-requirement">Sua senha não pode ser inteiramente numérica.</li>''</ul>') 
        self.fields['password1'].widget.attrs.update({'class': 'password-field'})

        como_conheceu = self.data.get('como_conheceu')
        if como_conheceu == 'indicacao':
            self.fields['quem_indicou'].label = 'Quem indicou?'
        else:
            self.fields['quem_indicou'].label = ''
 
        if como_conheceu == 'outros':
            self.fields['aonde'].label = 'Onde conheceu?'
        else:
            self.fields['aonde'].label = ''
     
        
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'form-control'
            field.label_suffix = ''
