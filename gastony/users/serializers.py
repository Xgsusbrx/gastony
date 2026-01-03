from rest_framework import serializers
from users.models import User
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class SayHelloSerializer(serializers.Serializer):
    name = serializers.EmailField(required=True)
