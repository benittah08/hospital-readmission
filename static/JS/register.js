// Helper function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Listen for form submission
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // prevent default submission

    // Collect form values
    const formData = {
        first_name: document.getElementById('firstName').value.trim(),
        last_name: document.getElementById('lastName').value.trim(),
        username: document.getElementById('username').value.trim(),
        email: document.getElementById('email').value.trim(),
        employee_id: document.getElementById('employeeId').value.trim(),
        password: document.getElementById('password').value,
        confirm_password: document.getElementById('confirmPassword').value,
        role: 'clinician'
    };

    try {
        const response = await fetch('{% url "register" %}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.success || 'Registered successfully!');
            window.location.href = '{% url "login" %}';
        } else {
            alert(data.error || 'Registration failed. Check the form for errors.');
        }

    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. See console for details.');
    }
});
