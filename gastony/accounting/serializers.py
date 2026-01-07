from rest_framework import serializers

class OcrSerializer(serializers.Serializer):
    image=serializers.ImageField()

    