from django.db import models
from users.models import User

# Create your models here.
class Category(models.Model): 
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='categories'
    )
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name



class Transaction(models.Model):

    class CurrenciesChoices(models.TextChoices):
        ARS = 'ARS', 'ARS'
        USD = 'USD','USD'

    class TransactionType(models.TextChoices):
        IN = 'IN', 'IN'
        OUT= 'OUT','OUT'  
    
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='categories'
    )
    
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='transactions'
    )

    amount=models.DecimalField(null=False,decimal_places=2,max_digits=100)
    notes=models.TextField(null=True, blank=True)
    date=models.DateTimeField(null=False)
    currency=models.CharField(null=False, choices=CurrenciesChoices)
    type=models.CharField(null=False, choices=TransactionType)


