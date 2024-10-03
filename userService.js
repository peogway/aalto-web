const users = new Map(); // Temporary storage for users

// Find user by email
const findUserByEmail = (email) => {
  return users.get(email); // Replace with actual database logic
};

// Create a new user
const createUser = (userData) => {
  users.set(userData.email, userData); // Store user; replace with actual database insertion
};

const validateUser = (email, password) => {
  const user = findUserByEmail(email);

  if (!user) return null; // User not found
  const matchPassword = password === user.password;
  return matchPassword ? user : null;
};

export { createUser, findUserByEmail, validateUser };
