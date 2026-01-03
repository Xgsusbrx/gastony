from rest_framework import permissions, viewsets
from .models import User
from .serializers import UserSerializer

# Create your views here.

class UserViewSet(viewsets.ModelViewSet): 
    queryset=User.objects.all()
    permission_classes=[permissions.AllowAny]


    serializer_class = UserSerializer
