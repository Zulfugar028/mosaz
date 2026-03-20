from .models import Visitor
from django.utils import timezone

def visitor_count(request):
    today = timezone.now().date()
    count = Visitor.objects.filter(date=today).count()
    return {
        'daily_visitors': count
    }