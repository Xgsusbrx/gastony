from django.contrib import admin
from .models import Transaction, Category


# Register your models here.
@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['amount','notes','user__first_name']


# Register your models here.
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    # list_display = ['phone','first_name','last_name']
    pass
