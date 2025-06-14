from django.shortcuts import render
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

LANGUAGES = {
    'en': 'English',
    'pt': 'Portuguese',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'ja': 'Japanese',
    'ru': 'Russian',
    'zh': 'Chinese',
    'ar': 'Arabic'
}

def home(request):
    return render(request, 'translation/home.html', {'languages': LANGUAGES})

@csrf_exempt
def translate_text(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            text = data.get('text', '')
            source_lang = data.get('source_lang', 'en')
            target_lang = data.get('target_lang', 'pt')
            
            # Chamada para a API MyMemory
            url = f"https://api.mymemory.translated.net/get?q={text}&langpair={source_lang}|{target_lang}"
            response = requests.get(url)
            
            if response.status_code == 200:
                result = response.json()
                translated_text = result['responseData']['translatedText']
                
                return JsonResponse({
                    'success': True,
                    'translated_text': translated_text
                })
            else:
                return JsonResponse({
                    'success': False,
                    'error': 'API Error'
                }, status=500)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    return JsonResponse({'error': 'Método não permitido'}, status=405)