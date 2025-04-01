from django.urls import path
from . import views

urlpatterns = [
    path('', views.fournisseur_dashboard, name='tableau_de_bord_fournisseur'),
    path('order/', views.order, name='order'),
    path('marketplace/', views.marketplace_supplier, name='marketplace_supplier'),
]
