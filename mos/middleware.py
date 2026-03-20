from .models import Visitor
from django.utils import timezone

class VisitorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        ip = self.get_client_ip(request)
        today = timezone.now().date()

        # Eyni IP gün ərzində 1 dəfə sayılsın
        if ip:
            exists = Visitor.objects.filter(ip_address=ip, date=today).exists()
            if not exists:
                Visitor.objects.create(ip_address=ip)

        return self.get_response(request)

    def get_client_ip(self, request):
        x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded:
            return x_forwarded.split(',')[0]
        return request.META.get('REMOTE_ADDR')