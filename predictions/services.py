# predictions/services.py
import random

class ReadmissionPredictor:
    def __init__(self):
        self.model = None
        
    def load_model(self, model_path):
        """Simple model loader - for demo purposes"""
        self.model = "simple_rule_based"
        return True
    
    def predict(self, patient_data):
        """Simple prediction using rule-based approach"""
        # Use a simple rule-based calculation
        risk_score = self._calculate_simple_risk(patient_data)
        confidence = 0.85  # Fixed confidence for demo
        
        return {
            'risk_score': risk_score,
            'confidence': confidence,
            'risk_category': self._categorize_risk(risk_score),
            'top_factors': self._get_simple_factors(patient_data)
        }
    
    def _calculate_simple_risk(self, patient_data):
        """Calculate risk using simple rules"""
        base_risk = 0.1
        age_factor = min(0.3, patient_data.get('age', 50) / 200)
        admissions_factor = min(0.3, patient_data.get('previous_admissions', 0) * 0.1)
        conditions_factor = min(0.3, patient_data.get('chronic_conditions_count', 0) * 0.08)
        stay_factor = min(0.2, patient_data.get('length_of_stay', 5) / 50)
        
        total_risk = base_risk + age_factor + admissions_factor + conditions_factor + stay_factor
        return max(0.05, min(0.95, total_risk))
    
    def _get_simple_factors(self, patient_data):
        """Get simple factor analysis"""
        factors = {}
        if patient_data.get('age', 0) > 65:
            factors['Age'] = 25
        if patient_data.get('previous_admissions', 0) > 1:
            factors['Previous Admissions'] = 30
        if patient_data.get('chronic_conditions_count', 0) > 0:
            factors['Chronic Conditions'] = 35
        if patient_data.get('length_of_stay', 0) > 7:
            factors['Length of Stay'] = 20
        
        return factors
    
    def _categorize_risk(self, risk_score):
        if risk_score < 0.3:
            return 'low'
        elif risk_score < 0.6:
            return 'medium'
        else:
            return 'high'