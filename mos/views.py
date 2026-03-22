from django.shortcuts import render
from django.core.cache import cache
from django.http import HttpResponse
from .forms import ContactRequestForm
from .services_data import SERVICES

def members(request):
    success = False

    if request.method == 'POST':
        ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', '')).split(',')[0].strip()
        cache_key = f'contact_ratelimit_{ip}'
        requests_count = cache.get(cache_key, 0)

        if requests_count >= 5:
            return HttpResponse('Çox sayda sorğu göndərdiniz. Zəhmət olmasa bir az gözləyin.', status=429)

        cache.set(cache_key, requests_count + 1, timeout=3600)

        form = ContactRequestForm(request.POST)
        if form.is_valid():
            form.save()
            success = True
            form = ContactRequestForm()
    else:
        form = ContactRequestForm()

    return render(request, 'mos-az-design.html', {'form': form, 'success': success})


def service_detail(request, slug):
    service = next((s for s in SERVICES if s['slug'] == slug), None)
    if not service:
        raise Http404
    return render(request, 'service_detail.html', {'service': service})