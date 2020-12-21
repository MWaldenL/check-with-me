export default {
  // Register
  register: {
    NAME: 'Name must contain letters only. If your name has spaces, use only one space.',
    USERNAME: `Username must contain letters and/or numbers only, 
              and must be 8-20 characters long`,
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
  },

  changePassword: {
    EMAIL: 'The email you entered is incorrect.',
    PASSWORD: 'The password you entered is incorrect'
  },

  changePasswordConfirm: {
    PASSWORD: `Password must contain at least 8 characters, 
              1 uppercase letter, 
              1 lowercase letter, 
              1 number, and
              1 special character.`,
    CONFIRM_PASSWORD: `Passwords don't match.`,
    SAME_PASSWORD: `New password can't be the same as the old password`,
  }
}