from django.urls import path
from . import views

urlpatterns = [
    path('new_assessment/', views.new_assessment, name='new_assessment'),
]
