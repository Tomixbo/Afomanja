from django.urls import path
from . import views

urlpatterns = [
    
    path('fournisseur-dashboard/', views.fournisseur_dashboard, name='tableau_de_bord_fournisseur'),
    
]
