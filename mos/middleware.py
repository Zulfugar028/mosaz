from .models import Visitor
from django.utils import timezone
from django.contrib.gis.geoip2 import GeoIP2
from django.conf import settings

class VisitorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        ip = self.get_client_ip(request)
        today = timezone.now().date()

        # Botları filtr et (optional)
        if ip and not self.is_bot(request):
            # Eyni IP gün ərzində 1 dəfə sayılsın
            exists = Visitor.objects.filter(ip_address=ip, date=today).exists()
            if not exists:
                country, city = self.get_geo(ip)
                Visitor.objects.create(
                    ip_address=ip,
                    date=today,
                    country=country.get('country_name') if country else None,
                    city=city.get('city') if city else None
                )

        return self.get_response(request)

    def get_client_ip(self, request):
        x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded:
            return x_forwarded.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')

    def get_geo(self, ip):
        g = GeoIP2(settings.GEOIP_PATH)
        try:
            country = g.country(ip)  # ölkə
            city = g.city(ip)        # şəhər
            return country, city
        except Exception:
            return None, None

    def is_bot(self, request):
        ua = request.META.get('HTTP_USER_AGENT', '').lower()
        bots = ['googlebot', 'bingbot', 'yandex', 'crawler', 'bot', 'spider', 'curl', 'wget', 'python-requests']
        return any(bot in ua for bot in bots)