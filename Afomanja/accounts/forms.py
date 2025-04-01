from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Profile

class InscriptionForm(UserCreationForm):
    email = forms.EmailField(required=True)
    role = forms.ChoiceField(choices=Profile.ROLE_CHOICES, initial='client', widget=forms.HiddenInput())  # Rôle caché par défaut

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2', 'role']  # Ajouter 'role' ici