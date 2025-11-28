// login.js – only for UI validation/enhancements

// Get form and inputs
const loginForm = document.getElementById('loginForm');
const identifierInput = document.getElementById('identifier'); // username or email
const passwordInput = document.getElementById('password');

// Optional: show/hide password
const showPasswordCheckbox = document.getElementById('showPassword');
if (showPasswordCheckbox) {
    showPasswordCheckbox.addEventListener('change', () => {
        passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
    });
}

// Client-side validation before submitting
loginForm.addEventListener('submit', function(e) {
    const identifier = identifierInput.value.trim();
    const password = passwordInput.value.trim();

    if (!identifier) {
        alert('Please enter your username or email.');
        identifierInput.focus();
        e.preventDefault();
        return;
    }

    if (!password) {
        alert('Please enter your password.');
        passwordInput.focus();
        e.preventDefault();
        return;
    }

    // No fetch/ajax – let Django handle the POST
    // The form will submit normally to the server
});
