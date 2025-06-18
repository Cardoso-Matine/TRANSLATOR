document.addEventListener('DOMContentLoaded', function() {
    const sourceLangSelect = document.getElementById('source-lang');
    const targetLangSelect = document.getElementById('target-lang');
    const swapButton = document.getElementById('swap-langs');
    const sourceText = document.getElementById('source-text');
    const translatedText = document.getElementById('translated-text');
    const translateButton = document.getElementById('translate-btn');

    
 const themeToggle = document.getElementById('themeToggle');
 themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
 });


 if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
 }
    
    async function translate() {
        const text = sourceText.value.trim();
        if (!text) {
            alert('Por favor, digite algum texto para traduzir.');
            return;
        }
        
        const sourceLang = sourceLangSelect.value;
        const targetLang = targetLangSelect.value;
        
        try {
            translateButton.disabled = true;
            translateButton.textContent = 'Traduzindo...';
            
            const response = await fetch('/translate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({
                    text: text,
                    source_lang: sourceLang,
                    target_lang: targetLang
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                translatedText.value = data.translated_text;
            } else {
                alert('Erro na tradução: ' + (data.error || 'Erro desconhecido'));
            }
        } catch (error) {
            alert('Erro: ' + error.message);
        } finally {
            translateButton.disabled = false;
            translateButton.textContent = 'Traduzir';
        }
    }
    
    
    function swapLanguages() {
        const tempLang = sourceLangSelect.value;
        sourceLangSelect.value = targetLangSelect.value;
        targetLangSelect.value = tempLang;
        
        const tempText = sourceText.value;
        sourceText.value = translatedText.value;
        translatedText.value = tempText;
    }
    
    
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
    
    translateButton.addEventListener('click', translate);
    swapButton.addEventListener('click', swapLanguages);
    
    
    sourceText.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.shiftKey)) {
            e.preventDefault();
            translate();
        }
    });
});