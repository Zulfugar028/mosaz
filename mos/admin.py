from django.contrib import admin
from .models import ContactRequest

@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'service', 'created_at')
    list_filter = ('service', 'created_at')
    search_fields = ('full_name', 'email', 'message')