from django.db import models

# Create your models here.
class Transaction(models.Model):
    amount=models.DecimalField(null=False,decimal_places=2,max_digits=100)
    notes=models.TextField(null=True, blank=True)