# Create your views here.

from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Transaction
from .serializers import OcrSerializer 
from .utils import ocr
import requests 





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
        text_test="Hola acabo de gastar 5000 pesos en un cafe"
        body={
            "model": "gemma3",
            "prompt": f"A partir del siguiente texto extraído por OCR devuélvelo ordenado y estructurado en formato JSON. Devuelve SOLO JSON válido, sin texto adicional solo con estos campos: - nombre    - fecha- monto - concepto    Texto OCR: {text_test}",
            "stream": False
             }
        resolve=requests.post("http://localhost:11434/api/generate",json=body)
        import json
        import re
        
        test=json.loads(resolve.text)
        result=test["response"]
        print(test["response"])
        coincide=re.search(r"```json\s*(\{\s*.*?\s*\})\s*```",result,re.DOTALL)

        if coincide:
            json_srt= coincide.group(1)
            try:
                data = json.loads(json_srt)
                print(data)
                print("Nombre del primer elemento")
            except json.JSONDecodeError as e:
                print("Error parseando JSON ",e)
        else:
            print("No se encontro JSON")            
        

    #     formateado = ollama(f"""
    # A partir del siguiente texto extraído por OCR,
    # devuélvelo ordenado y estructurado en formato JSON.

    # Devuelve SOLO JSON válido, sin texto adicional.

    # Campos sugeridos:
    # - nombre
    # - fecha
    # - monto
    # - concepto

    # Texto OCR:
    # {text}
    # """)
        
        import decimal
        concepto=data.get("concepto") 
        monto=data.get("monto")
        monto=decimal.Decimal(monto)
        
        Transaction.objects.create(notes=concepto,amount=monto)

        
        # data={"tu resumen es ": text,"resolve":test["response"]}
        return Response(data)
    
    
