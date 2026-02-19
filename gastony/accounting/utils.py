


def ocr(image):

    from PIL import Image
    import pytesseract
    


    pytesseract.pytesseract.tesseract_cmd = r"C:\Users\Usuario\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"

    # Abrir imagen
    imagen = Image.open(image)

    # Extraer texto
    texto = pytesseract.image_to_string(imagen, lang="spa")
    return texto
    

