
# Create your models here.
from django.db import models
from django.contrib.auth.models import User




class Profile(models.Model):
    ROLE_CHOICES = [
        ('client', 'Client'),
        ('fournisseur', 'Fournisseur'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')

    def __str__(self):
        return self.user.username