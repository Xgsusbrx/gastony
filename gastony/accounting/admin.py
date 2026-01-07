from django.contrib import admin
from .models import Transaction


# Register your models here.
@admin.register(Transaction)
class UserAdmin(admin.ModelAdmin):
    # list_display = ['phone','first_name','last_name']
    pass
