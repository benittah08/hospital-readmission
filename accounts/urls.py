from django.urls import path
from . import views 
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', views.register, name='register'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('login/', views.login_view, name='login'), 
    path('clinical/dashboard/', views.clinical_dashboard, name='clinical_dashboard'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
