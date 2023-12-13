// Retrieve all login form elements
const loginForm = document.getElementById('loginForm'); // Assuming you have a form with the id 'loginForm'
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

/**
 * Handle the login form submission.
 * @param {Event} event - The form submission event.
 */
const handleLogin = async (event) => {
    event.preventDefault();

    const data = {
        username: usernameInput.value,
        password: passwordInput.value
    };

    try {
        // Assuming your login route is '/login'
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Redirect or perform other actions upon successful login
            window.location.href = '/'; // Redirect to the home page
        } else {
            // Handle login failure, e.g., show an error message
            console.error('Login failed');
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
};

// Attach the handleLogin function to the form's submit event
loginForm.addEventListener('submit', handleLogin);
