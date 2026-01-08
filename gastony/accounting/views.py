# Create your views here.

from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Transaction
from .serializers import OcrSerializer 
from .utils import ocr



# Create your views here.



class OcrViewSet(viewsets.ModelViewSet): 
    queryset=Transaction.objects.all()
    permission_classes=[permissions.IsAuthenticated]


    serializer_class = OcrSerializer

    @action(methods=['post'], detail=False, url_path='image-to-text', permission_classes=[permissions.AllowAny])

    def image_to_text(self, request):
        serializer = OcrSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        text=ocr(serializer.validated_data.get('image'))
        Transaction.objects.create(notes=text,amount=0)
        
        
        data={"texto_de_la_imagen":text}
        return Response(data)
    
    
