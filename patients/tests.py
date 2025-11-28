from django.http import JsonResponse
import json
from .models import Patient
from predictions.risk_calculator import calculate_risk

def new_assessment(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        patient = Patient.objects.get(id=data['patient_id'])

        # Here, you can update patient attributes or save new assessment model
        risk_score = calculate_risk(
            age=int(data['age']),
            chronic_conditions=data['chronic_conditions'],
            recent_visits=int(data['recent_visits']),
            vitals=data['vitals']
        )
        patient.risk_score = risk_score
        patient.save()

        return JsonResponse({'success': True})
    return JsonResponse({'success': False})
