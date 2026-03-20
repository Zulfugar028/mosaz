from django.contrib import admin
from .models import ContactRequest
from .models import Visitor

@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'service', 'created_at')
    list_filter = ('service', 'created_at')
    search_fields = ('full_name', 'email', 'message')

@admin.register(Visitor)
class VisitorAdmin(admin.ModelAdmin):
    list_display = ('ip_address', 'date', 'country', 'city')
    list_filter = ('date', 'country')