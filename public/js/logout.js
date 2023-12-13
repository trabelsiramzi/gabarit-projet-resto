// Retrieve the logout form element
const logoutForm = document.getElementById('logoutForm'); // Assuming you have a form with the id 'logoutForm'

/**
 * Handle the logout form submission.
 * @param {Event} event - The form submission event.
 */
const handleLogout = async (event) => {
    event.preventDefault();

    try {
        // Assuming your logout route is '/logout'
        const response = await fetch('/logout', {
            method: 'GET'
        });

        if (response.ok) {
            // Redirect or perform other actions upon successful logout
            window.location.href = '/'; // Redirect to the home page
        } else {
            // Handle logout failure, e.g., show an error message
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
};

// Attach the handleLogout function to the form's submit event
logoutForm.addEventListener('submit', handleLogout);
