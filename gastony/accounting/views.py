# importaciones 

from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Transaction
from .serializers import OcrSerializer, TransactionSerializer
from .utils import ocr
import requests 
from rest_framework import status
from .services import from_text_to_json




# logica 



class OcrViewSet(viewsets.ModelViewSet): 
    queryset=Transaction.objects.all()
    permission_classes=[permissions.IsAuthenticated]


    serializer_class = OcrSerializer

    def get_serializer_class(self):
        if self.action == 'register_from_text':
            return []
        return super().get_serializer_class()
    
    # metodo que ejecuta la funcion de leer la imagen 
    @action(methods=['post'], detail=False, url_path='image-to-text', permission_classes=[permissions.AllowAny])
    def image_to_text(self, request):
        serializer = OcrSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # llama la funcion ocr que se encarga de procesar la imagen 
        text=ocr(serializer.validated_data.get('image'))
        if len(text) < 10:
            return Response(data={
                "msg": "imagen invalida o con mala definicion"
            }, status=status.HTTP_400_BAD_REQUEST)
        # llamada a la ia con el texto extraido de la imagen 
        resolve = from_text_to_json(text) 
        # logica que se encarga de guardar en la DB lo que genera 
        transaction = Transaction.objects.create(
            notes=resolve.get("concepto"),
            amount=resolve.get("monto")
        )
   
        data={"raw": text,"transaction": TransactionSerializer(transaction).data }
        return Response(data, status=status.HTTP_200_OK)
    
    # metodo que se encarga de analizar el texto a travez de un mensaje 
    @action(methods=['post'], detail=False, url_path='from-text', permission_classes=[permissions.AllowAny])
    def register_from_text(self, request):
        message_from_whatsapp = request.data.get('message')
        result = from_text_to_json(message_from_whatsapp)
        return Response({
            "result": result
        })