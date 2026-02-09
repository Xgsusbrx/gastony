# test_gemini.py
import google.generativeai as genai

genai.configure(api_key="AIzaSyC9ko-RefkRNKRWdYoHa1xbYs8RSWsRFXw" \
)  # Pon tu API key real

# Listar modelos disponibles
print("Modelos disponibles:")
for model in genai.list_models():
    if 'generateContent' in model.supported_generation_methods:
        print(model.name)
        