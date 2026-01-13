from rest_framework import serializers
from .models import Transaction

class OcrSerializer(serializers.Serializer):
    image=serializers.ImageField()

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model =  Transaction
        fields = "__all__"