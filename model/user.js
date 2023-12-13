import connectionPromise from '../connexion.js';
import bcrypt from 'bcrypt';

/**
 * Get user by username.
 * @param {string} username - The username to search for.
 * @returns {Object} The user object or null if not found.
 */
export const getUserByUsername = async (username) => {
  let connection = await connectionPromise;

  // Replace this query with your actual query
  let result = await connection.get('SELECT * FROM users WHERE username = ?', [username]);

  return result;
};

/**
 * Get user by ID.
 * @param {number} id - The user ID to search for.
 * @returns {Object} The user object or null if not found.
 */
export const getUserById = async (id) => {
  let connection = await connectionPromise;

  // Replace this query with your actual query
  let result = await connection.get('SELECT * FROM users WHERE id = ?', [id]);

  return result;
};

/**
 * Create a new user.
 * @param {string} username - The username for the new user.
 * @param {string} password - The hashed password for the new user.
 * @returns {Object} The newly created user object.
 */
export const createUser = async (username, password) => {
  let connection = await connectionPromise;

  // Replace this query with your actual query
  let result = await connection.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);

  // Replace this query with your actual query to get the created user
  return await getUserById(result.lastID);
};

/**
 * Validate user credentials.
 * @param {string} username - The username to validate.
 * @param {string} password - The password to validate.
 * @returns {Object} The user object if credentials are valid, null otherwise.
 */
export const validateUserCredentials = async (username, password) => {
  let user = await getUserByUsername(username);

  if (!user) {
    return null; // User not found
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return null; // Incorrect password
  }

  return user;
};
