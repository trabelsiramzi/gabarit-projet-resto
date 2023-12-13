// authMiddleware.js

// Placeholder for a logged-in user (replace this with your actual authentication logic)
let loggedInUser = null;

export const isAuthenticated = (req, res, next) => {
  // Check if the user is not authenticated (user is falsy or empty)
  if (!loggedInUser) {
    next(); // User is not authenticated, proceed to the next middleware or route handler
  } else {
    res.redirect('/login'); // Redirect authenticated users to the login page
  }
};
