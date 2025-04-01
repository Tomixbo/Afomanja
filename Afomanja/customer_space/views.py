from django.shortcuts import render

# Create your views here.
def client_dashboard(request):
    # Votre logique pour le tableau de bord client
    return render(request, 'customer_space/client_home.html')



def gestion_digestion(request):
    # Logique spécifique à la page de gestion de digestion
    return render(request, 'customer_space/gestion_digestion.html')

def marketplace(request):
    # Logique spécifique à la page Marketplace
    return render(request, 'customer_space/marketplace.html')