// signup.js

// Signup form
const signupForm = document.getElementById('signup-form');

/**
 * Handles the signup form submission.
 * @param {SubmitEvent} event The submit event.
 */
const handleSignup = async (event) => {
    event.preventDefault();

    const formData = new FormData(signupForm);
    const data = {
        username: formData.get('username'),
        password: formData.get('password')
    };

    await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
};

signupForm.addEventListener('submit', handleSignup);
