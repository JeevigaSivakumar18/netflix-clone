// Copy this file to .env in the backend folder
// Example environment configuration

module.exports = {
  // MongoDB Connection
  MONGO_URI: 'mongodb://localhost:27017/netflix-clone',
  
  // JWT Secret (change this to a secure random string in production)
  JWT_SECRET: 'your_super_secret_jwt_key_change_this_in_production',
  
  // Server Port
  PORT: 5001
};
