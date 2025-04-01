from django.urls import path
from . import views

urlpatterns = [
   
    path('client-dashboard/', views.client_dashboard, name='tableau_de_bord_client'),
    path('gestion_digestion/', views.gestion_digestion, name='gestion_digestion'),
    path('marketplace/', views.marketplace, name='marketplace'),
    
]
