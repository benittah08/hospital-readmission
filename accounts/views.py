from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login
from django.contrib import messages
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import logout
from patients.models import Patient
import re

User = get_user_model()

def register(request):
    if request.method == "POST":
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")
        email = request.POST.get("email")
        username = request.POST.get("username")
        employee_id = request.POST.get("employee_id")
        role = 'clinician'  # default role
        password = request.POST.get("password")
        confirm_password = request.POST.get("confirm_password")

        # Validate fields
        if not all([first_name, last_name, email, username, employee_id, password, confirm_password]):
            messages.error(request, "All fields are required")
            return render(request, "register.html")

        if password != confirm_password:
            messages.error(request, "Passwords do not match")
            return render(request, "register.html")

        if not re.match(r'^[A-Za-z]+$', first_name):
            messages.error(request, "First name must contain only letters")
            return render(request, "register.html")

        if not re.match(r'^[A-Za-z]+$', last_name):
            messages.error(request, "Last name must contain only letters")
            return render(request, "register.html")

        if not re.match(r'^[A-Za-z0-9]+$', username):
            messages.error(request, "Username must be alphanumeric")
            return render(request, "register.html")

        if not re.match(r'^[A-Za-z0-9]+$', employee_id):
            messages.error(request, "Employee ID must be alphanumeric")
            return render(request, "register.html")

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists")
            return render(request, "register.html")

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already exists")
            return render(request, "register.html")

        # Create user and set password properly
        user = User(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            employee_id=employee_id,
            role=role,
            is_active=False  # account inactive until admin approval
        )
        user.set_password(password)  # This is the key fix!
        user.save()

        messages.success(request, "Account created successfully. Your account is pending admin approval.")
        return redirect("login")

    return render(request, "register.html")





def login_view(request):
    if request.method == "POST":
        identifier = request.POST.get("identifier")
        password = request.POST.get("password")
        
        print(f"🔐 LOGIN ATTEMPT: {identifier}")  # DEBUG

        # Try authenticate with username first
        user = authenticate(request, username=identifier, password=password)
        print(f"🔑 Username auth result: {user}")  # DEBUG

        # If not username, try email
        if user is None:
            try:
                email_user = User.objects.get(email=identifier)
                print(f"📧 Found user by email: {email_user.username}")  # DEBUG
                user = authenticate(request, username=email_user.username, password=password)
                print(f"🔑 Email auth result: {user}")  # DEBUG
            except User.DoesNotExist:
                user = None
                print("❌ No user found with that email")  # DEBUG

        if user is not None:
            print(f"✅ User found: {user.username}, Active: {user.is_active}, Role: {user.role}")  # DEBUG
            if not user.is_active:
                messages.error(request, "Your account is not yet activated by the admin.")
                return render(request, "login.html")

            auth_login(request, user)
            print(f"👤 User logged in: {request.user.is_authenticated}")  # DEBUG

            if user.is_superuser:
                print("➡️ Redirecting to admin dashboard...")  # DEBUG
                return redirect("admin_dashboard")

            print("➡️ Redirecting to clinical dashboard...")  # DEBUG
            return redirect("clinical_dashboard")  # This should work

        print("❌ Authentication failed completely")  # DEBUG
        messages.error(request, "Invalid username, email, or password")

    return render(request, "login.html")



@login_required
def clinical_dashboard(request):
    """Clinical staff dashboard view"""
    try:
        # Get all patients
        patients = Patient.objects.all()
        
        # Calculate risk counts
        high_risk_count = patients.filter(risk_category='high').count()
        medium_risk_count = patients.filter(risk_category='medium').count()
        low_risk_count = patients.filter(risk_category='low').count()
        unknown_risk_count = patients.filter(risk_category='unknown').count()
        
        # Create sample alerts
        alerts = [
            {
                'title': 'System Ready',
                'message': 'Readmission prediction system is operational',
                'level': 'medium',
                'timestamp': timezone.now()
            },
            {
                'title': f'{high_risk_count} High Risk Patients',
                'message': f'There are {high_risk_count} patients with high readmission risk',
                'level': 'high' if high_risk_count > 0 else 'medium',
                'timestamp': timezone.now()
            }
        ]
        
        # Prepare patient data for template
        patient_data = []
        for patient in patients:
            patient_info = {
                'id': patient.id,
                'first_name': getattr(patient, 'first_name', 'Patient'),
                'last_name': getattr(patient, 'last_name', f'#{patient.id}'),
                'patient_id': getattr(patient, 'patient_id', f'P{patient.id:04d}'),
                'age': getattr(patient, 'age', 0),
                'risk_category': getattr(patient, 'risk_category', 'unknown'),
                'ml_risk_score': getattr(patient, 'ml_risk_score', 0),
                'risk_score': int(getattr(patient, 'ml_risk_score', 0) * 100),  # Convert to percentage for display
                'last_visit': getattr(patient, 'last_visit', None),
                'length_of_stay': getattr(patient, 'length_of_stay', 0),
                'previous_admissions': getattr(patient, 'previous_admissions', 0),
            }
            patient_data.append(patient_info)
        
        context = {
            'patients': patient_data,
            'high_risk_count': high_risk_count,
            'medium_risk_count': medium_risk_count,
            'low_risk_count': low_risk_count,
            'alerts': alerts,
        }
        
        return render(request, 'patients/clinical-dashboard.html', context)
        
    except Exception as e:
        # Fallback context if there's an error
        import traceback
        print(f"Dashboard error: {str(e)}")
        print(traceback.format_exc())
        
        # Provide fallback data
        context = {
            'patients': [],
            'high_risk_count': 0,
            'medium_risk_count': 0,
            'low_risk_count': 0,
            'alerts': [
                {
                    'title': 'System Notice',
                    'message': 'Loading patient data...',
                    'level': 'medium',
                    'timestamp': timezone.now()
                }
            ],
            'error': 'Loading patient data...'
        }
    return render(request, 'clinical-dashboard.html', context)

def logout_view(request):
    logout(request)
    return redirect('login')