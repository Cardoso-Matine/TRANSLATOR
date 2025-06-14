from django.db import models

# Create your models here.


class TranslationHistory(models.Model):
    original_text = models.TextField()
    translated_text = models.TextField()
    source_lang = models.CharField(max_length=10)
    target_lang = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.source_lang} to {self.target_lang}"
