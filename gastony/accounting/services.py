import requests 
import json
import decimal
import re


def generate_prompt(text):
    return f"""Eres un sistema automático de extracción de datos financieros.
    Devuelve ÚNICAMENTE un objeto JSON válido.
    No incluyas texto adicional.
    No uses markdown ni bloques de código.
    El JSON debe tener EXACTAMENTE esta estructura:
    {{"nombre": null, "fecha": null, "monto": null, "concepto": null}}
    Reglas:
    - Extrae solo datos presentes en el texto.
    - No inventes información.
    - Si el texto contiene "hoy", devuelve la fecha actual en formato DD/MM/YYYY.
    - Si el texto contiene "ayer", devuelve la fecha correspondiente a un día antes de hoy.
    - El monto debe ser un número decimal usando punto.
    - Elimina símbolos de moneda y separadores de miles.
    Texto OCR:
    {text}
    """


def from_text_to_json(text):
    # print(generate_prompt(text))
    body={
        "model": "gemma3",
        "prompt": generate_prompt(text),
        "stream": False
    }
    resolve = requests.post("http://localhost:11434/api/generate",json=body)
    ai_json=json.loads(resolve.text)
    response =ai_json["response"]
    coincide=re.search(r"```json\s*(\{\s*.*?\s*\})\s*```",response,re.DOTALL)

    if coincide:
        json_srt= coincide.group(1)
        try:
            data = json.loads(json_srt)
            print(data)
            return {
                "concepto": data.get('concepto'),
                "nombre": data.get("nombre"),
                "monto": decimal.Decimal(data.get("monto"))  
            }
        except json.JSONDecodeError as error:
            print("Error parseando JSON ",error)
            return error
    return {
        "nombre": None,
        "fecha": None,
        "monto": None
    }