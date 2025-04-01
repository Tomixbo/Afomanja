

# Create your views here.
from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login
from django.contrib import messages
from .forms import InscriptionForm
from .models import Profile
from django.contrib.auth import logout

def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Récupérer l'utilisateur par email
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
            user = authenticate(request, username=user.username, password=password)
        except User.DoesNotExist:
            user = None

        if user is not None:
            login(request, user)
            try:
                profile = Profile.objects.get(user=user)
                if profile.role == 'moderateur':
                    return redirect('tableau_de_bord_moderateur')
                else:
                    return redirect('tableau_de_bord_client')
            except Profile.DoesNotExist:
                return redirect('accueil')
        else:
            messages.error(request, 'Email ou mot de passe incorrect.')

    return render(request, 'accounts/login.html')

def register(request):
    if request.method == 'POST':
        form = InscriptionForm(request.POST)
        if form.is_valid():
            user = form.save()  # Enregistrer l'utilisateur
            email = form.cleaned_data.get('email')
            role = form.cleaned_data.get('role')

            # Créer un profil pour l'utilisateur
            Profile.objects.create(user=user, role=role)

            # Connecter l'utilisateur après l'inscription
            login(request, user)

            # Rediriger en fonction du rôle
            if role == 'moderateur':
                return redirect('tableau_de_bord_moderateur')
            else:
                return redirect('tableau_de_bord_client')
        else:
            messages.error(request, 'Erreur lors de l\'inscription. Veuillez corriger les erreurs ci-dessous.')
    else:
        form = InscriptionForm()
    return render(request, 'accounts/register.html', {'form': form})


def log_out(request):
    logout(request)  # Déconnecte l'utilisateur
    return redirect('login')  # Redirige vers la page de connexion après le logout

def home(request):
    return render(request, 'home.html') 