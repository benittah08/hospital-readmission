# predictions/models.py
from django.db import models
from patients.models import Patient

class MLModel(models.Model):
    MODEL_TYPES = [
        ('logistic', 'Logistic Regression'),
        ('random_forest', 'Random Forest'),
        ('xgboost', 'XGBoost'),
        ('neural_net', 'Neural Network'),
    ]
    
    name = models.CharField(max_length=255)
    model_type = models.CharField(max_length=50, choices=MODEL_TYPES)
    version = models.CharField(max_length=50)
    accuracy = models.FloatField(default=0.0)
    precision = models.FloatField(default=0.0)
    recall = models.FloatField(default=0.0)
    feature_importance = models.JSONField(default=dict)
    is_active = models.BooleanField(default=False)
    model_file = models.FileField(upload_to='ml_models/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class PredictionResult(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    ml_model = models.ForeignKey(MLModel, on_delete=models.CASCADE)
    risk_score = models.FloatField()  # 0-1 probability
    risk_category = models.CharField(max_length=20, choices=[
        ('low', 'Low Risk (0-30%)'),
        ('medium', 'Medium Risk (31-60%)'), 
        ('high', 'High Risk (61-100%)')
    ])
    confidence = models.FloatField()  # Model confidence
    top_factors = models.JSONField()  # {"factor": "weight"}
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']