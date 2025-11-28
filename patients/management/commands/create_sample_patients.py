# patients/management/commands/create_sample_patients.py
from django.core.management.base import BaseCommand
from patients.models import Patient
from django.utils import timezone

class Command(BaseCommand):
    help = 'Create sample patient data for testing'

    def handle(self, *args, **options):
        sample_patients = [
            {
                'first_name': 'John',
                'last_name': 'Smith',
                'age': 65,
                'previous_admissions': 3,
                'chronic_conditions': ['diabetes', 'hypertension'],
                'medication_count': 5,
                'length_of_stay': 7,
                'social_support_score': 2,
                'ml_risk_score': 0.75,
                'risk_category': 'high'
            },
            {
                'first_name': 'Maria',
                'last_name': 'Garcia',
                'age': 45,
                'previous_admissions': 1,
                'chronic_conditions': ['asthma'],
                'medication_count': 2,
                'length_of_stay': 3,
                'social_support_score': 4,
                'ml_risk_score': 0.25,
                'risk_category': 'low'
            },
            {
                'first_name': 'Robert',
                'last_name': 'Johnson',
                'age': 58,
                'previous_admissions': 2,
                'chronic_conditions': ['hypertension', 'copd'],
                'medication_count': 4,
                'length_of_stay': 5,
                'social_support_score': 3,
                'ml_risk_score': 0.45,
                'risk_category': 'medium'
            }
        ]
        
        for patient_data in sample_patients:
            patient, created = Patient.objects.get_or_create(
                first_name=patient_data['first_name'],
                last_name=patient_data['last_name'],
                defaults=patient_data
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created patient: {patient.first_name} {patient.last_name}')
                )