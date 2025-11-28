# predictions/urls.py
from django.urls import path
from . import views

app_name = 'predictions'

urlpatterns = [
    # API endpoints for clinical dashboard tabs
    path('api/dashboard-data/', views.api_dashboard_data, name='api_dashboard_data'),
    path('api/analytics/', views.api_analytics, name='api_analytics'),
    path('api/models/', views.api_models, name='api_models'),
    
    # Prediction endpoints
    path('patient/<int:patient_id>/predict/', views.predict_readmission, name='predict_readmission'),
    path('bulk-predict/', views.bulk_predict, name='bulk_predict'),
    
    # Model management endpoints
    path('train-model/', views.train_model, name='train_model'),
    path('activate-model/<int:model_id>/', views.activate_model, name='activate_model'),
]