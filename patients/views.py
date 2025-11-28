from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.http import JsonResponse
import json

def new_assessment(request):
    if request.method == 'POST':
        # Parse JSON data from JS
        data = json.loads(request.body)
        
        # For now, just return the data back (you can later save it to DB)
        return JsonResponse({'status': 'success', 'data': data})
    
    # If GET, just show a simple page or modal trigger
    return render(request, 'patients/new_assessment.html')
