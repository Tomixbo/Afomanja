from django.urls import path
from . import views

urlpatterns = [
    path('se-connecter/', views.login, name='login'),
    path('inscription/', views.register, name='register'),
    path('logout/', views.log_out, name='logout'),

    path('', views.home, name='home'),
]
