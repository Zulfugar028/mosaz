from django.urls import path
from . import views

urlpatterns = [
    path('mos', views.members, name='home'),
]