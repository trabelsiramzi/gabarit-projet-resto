// authorizationMiddleware.js

// Placeholder for checking if the user is an administrator (replace this with your actual logic)
let isAdminUser = false;

export const isAdmin = (req, res, next) => {
  // Check if the user is an administrator (isAdminUser is truthy)
  if (isAdminUser) {
    next(); // User is an administrator, proceed to the next middleware or route handler
  } else {
    res.status(403).send('Access forbidden'); // User is not an administrator, send a forbidden status
  }
};
