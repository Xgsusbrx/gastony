# importaciones 
from django.conf import settings
from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Transaction
from .serializers import OcrSerializer, TransactionSerializer
from .utils import ocr
import requests 
from rest_framework import status
from .services import from_text_to_json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


from twilio.rest import Client


account_sid = settings.TWILIO_ACCOUNT_SID
auth_token = settings.TWILIO_AUTH_TOKEN






# logica 


 #clase general que hace todo 
class OcrViewSet(viewsets.ModelViewSet): 
    # configuracion del viewset
    # la base donde trabaja el viewset osea el modelo Transaction
    queryset=Transaction.objects.all()
    # permisos  
    permission_classes=[permissions.AllowAny]


    serializer_class = OcrSerializer

    def get_serializer_class(self):
        if self.action == 'register_from_text':
            return []
        return super().get_serializer_class()
    
    # esto crea el endpoint 
    @action(methods=['post'], detail=False, url_path='image-to-text', permission_classes=[permissions.AllowAny])

    # esto es un endpoint
    def image_to_text(self, request):
        # esto valida que sea una imagen valida 
        serializer = OcrSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # llama la funcion ocr que se encarga de procesar la imagen 
        text=ocr(serializer.validated_data.get('image'))
        # condicion: si el texto de la imagen tiene 10 caracteres o menos manda un mensaje 
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
    
    # metodo que se encarga de analizar el texto a travez de un mensaje(otro endpoint )
    @action(methods=['post'], detail=False, url_path='from-text', permission_classes=[permissions.AllowAny])
    def register_from_text(self, request):
        message_from_whatsapp = request.data.get('message')
        result = from_text_to_json(message_from_whatsapp)
        return Response({
            "result": result
        })
    # metodo o endpoint que se encarga de recibir un texto y lo manda a la ia 
    @action(methods=['post'], detail=False,url_path='whatsapp', permission_classes=[])
    def ws_hook(self, request):
        print(request.data.get('Body'))
        print(request.data)
        resolve = from_text_to_json(request.data.get('Body')) 
        print(resolve)

        body=f'hola ya registre tu gasto de {resolve.get('monto')}'
        numero=request.data.get('From') 
        self.send_message(numero=numero,body=body, from_=numero)
        
        return Response('hola esto es una prueba de que funciona ')
    
    def send_message(self,body,numero,from_): 
        # aqui se envia el mensaje 

        client = Client(account_sid, auth_token)

        message = client.messages.create(
            body=body,
            to='whatsapp:+5491172373115',
            from_='whatsapp:+14155238886'   # tu número con código país
        )

        print(message.sid)
        print(body)
        print(numero)

#         'From': ['whatsapp:+5491172373115'],     # 👤 USUARIO
# 'To':   ['whatsapp:+14155238886'],       # 🤖 TWILIO (sandbox)

