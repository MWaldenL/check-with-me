export default {
  // Register
  register: {
    FIRST_NAME: 'First name must contain letters only.',
    LAST_NAME: 'Last name must contain letters only.',
    USERNAME: 'Username must contain letters and/or numbers only.',
    EMAIL: 'Please enter a valid email.',
    PASSWORD: `Password must contain at least 8 characters, 
              1 uppercase letter, 
              1 lowercase letter, 
              1 number, and
              1 special character.`,
    CONFIRM_PASSWORD: `Passwords don't match.`,
    USERNAME_EXISTS: `That username is already in use.`,
    EMAIL_EXISTS: `That email is already in use.`
  },

  login: {
    USERNAME: 'This username does not exist.',
    PASSWORD: 'Invalid password.'
  }
}