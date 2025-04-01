from django.shortcuts import render

# Create your views here.
def fournisseur_dashboard(request):
    # Votre logique pour le tableau de bord fournisseur
    return render(request, 'supplier_space/fournisseur_home.html')