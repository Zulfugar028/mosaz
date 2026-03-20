from django.db import models

class ContactRequest(models.Model):
    full_name = models.CharField(max_length=100)
    company = models.CharField(max_length=100, blank=True)
    email = models.EmailField()
    service = models.CharField(max_length=50, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} — {self.email}"

class Visitor(models.Model):
    ip_address = models.GenericIPAddressField()
    date = models.DateField(auto_now_add=True)
    country = models.CharField(max_length=64, blank=True, null=True)
    city = models.CharField(max_length=64, blank=True, null=True)

    def __str__(self):
        return f"{self.ip_address} - {self.date} - {self.country} - {self.city}"