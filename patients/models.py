# patients/models.py
from django.db import models

class Patient(models.Model):
    # Basic identification fields (ADD THESE)
    first_name = models.CharField(max_length=100, default='Unknown')
    last_name = models.CharField(max_length=100, default='Patient')
    patient_id = models.CharField(max_length=20, unique=True, blank=True, null=True)
    age = models.IntegerField(null=True, blank=True)
    last_visit = models.DateField(null=True, blank=True)  # Add this for template
    
    # Enhanced medical history for ML
    previous_admissions = models.IntegerField(default=0)
    chronic_conditions = models.JSONField(default=list)  # ['diabetes', 'hypertension', 'copd']
    medication_count = models.IntegerField(default=0)
    lab_abnormalities = models.JSONField(default=dict)
    vital_signs = models.JSONField(default=dict)
    
    # Temporal features
    length_of_stay = models.IntegerField(default=0)  # in days
    time_since_last_discharge = models.IntegerField(null=True, blank=True)
    
    # Socio-economic factors
    social_support_score = models.IntegerField(default=0)  # 1-5 scale
    transportation_access = models.BooleanField(default=True)
    
    # Prediction results
    ml_risk_score = models.FloatField(default=0.0)
    risk_category = models.CharField(max_length=20, default='unknown')
    last_prediction_date = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} (ID: {self.patient_id})"
    
    def save(self, *args, **kwargs):
        # Auto-generate patient ID if not provided
        if not self.patient_id:
            last_patient = Patient.objects.order_by('-id').first()
            next_id = (last_patient.id + 1) if last_patient else 1
            self.patient_id = f"P{next_id:04d}"
        super().save(*args, **kwargs)