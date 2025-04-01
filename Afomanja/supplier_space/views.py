from django.shortcuts import render

# Create your views here.
def fournisseur_dashboard(request):
    # Votre logique pour le tableau de bord fournisseur
    return render(request, 'supplier_space/fournisseur_home.html')




def order(request):
    # Logique spécifique à la page de gestion de digestion
    return render(request, 'supplier_space/order_supplier.html')

def marketplace_supplier(request):
    # Logique spécifique à la page Marketplace
    return render(request, 'supplier_space/marketplace_supplier.html')