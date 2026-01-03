from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import User
from .serializers import UserSerializer, SayHelloSerializer


# Create your views here.



class UserViewSet(viewsets.ModelViewSet): 
    queryset=User.objects.all()
    permission_classes=[permissions.IsAuthenticated]


    serializer_class = UserSerializer

    @action(methods=['post'], detail=False, url_path='say-hello', permission_classes=[permissions.AllowAny])
    def say_hello(self, request):
        serializer = SayHelloSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data={"greattings":f"hello {serializer.validated_data.get('name')}"}
        return Response(data)
