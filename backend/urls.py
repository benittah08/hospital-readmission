from django.contrib import admin
from django.urls import path, include
from backend import views   # import the views from backend/views.py

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('patients/', include('patients.urls')),  # routes all /patients/... to patients app
    path('login/', views.login_page, name='login'),
    path('register/', views.register_page, name='register'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('predictions/', include('predictions.urls')), # routes all /predictions/... to predictions app
    path('', include('patients.urls')),
]
