import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import { 
  BForm, 
  BFormInput, 
  BInputGroup, 
  BButton, 
  BRow, 
  BCol, 
  BContainer 
} from 'bootstrap-vue'
import Register from '@/views/Register'

describe('Good input tests on registration fields', () => {
  let cmp
  beforeEach(() => {
    cmp = shallowMount(Register, {
      stubs: {
        'b-form': BForm,
        'b-form-input': BFormInput,
        'b-input-group': BInputGroup,
        'b-button': BButton,
        'b-container': BContainer,
        'b-row': BRow,
        'b-col': BCol,
        RouterLink: RouterLinkStub
      }})
  })

  describe('Name testing', ()  => {
    it ('returns true if the user-inputted first name contains only letters', () => {
      // Arrange
      const firstName = 'Matthew'
      
      // Act
      const result = cmp.vm.isValidName(firstName)

      // Assert
      expect(result).toBe(true)
    }),

    it ('returns true if the valid user-inputted first name contains a space', () => {
      // Arrange
      const firstName = 'Matthew Walden Barcelona Chen'
      
      // Act
      const result = cmp.vm.isValidName(firstName)

      // Assert
      expect(result).toBe(true)
    })
  }),

  describe('Username testing', ()  => {
    it ('returns true if the user-inputted first name contains only letters', () => {
      // Arrange
      const username = "usernAMe"

      // Act
      cmp.setData({ username })

      // Assert
      expect(cmp.vm.isValidUsername).toBe(true)
    }),

    it ('returns true if the user-inputted first name contains only numbers', () => {
      // Arrange
      const username = "0123456789"

      // Act
      cmp.setData({ username })

      // Assert
      expect(cmp.vm.isValidUsername).toBe(true)
    }),

    it ('returns true if the user-inputted first name contains letters and numbers', () => {
      // Arrange
      const username = "a1b2c3d4"

      // Act
      cmp.setData({ username })

      // Assert
      expect(cmp.vm.isValidUsername).toBe(true)
    })
  }),

  describe('Email testing', () => {
    it ('returns true if an email follows a valid format', () => {
      // Arrange
      const email = "user@email.com"

      // Act
      cmp.setData({ email })

      // Assert
      expect(cmp.vm.isValidEmail).toBe(true)
    }),

    it ('returns true even if an email contains mixed-case letters', () => {
      // Arrange
      const email = "UsErABc@email.com"

      // Act
      cmp.setData({ email })

      // Assert
      expect(cmp.vm.isValidEmail).toBe(true)
    })
  }),

  describe('Password testing', () => {
    it ('returns true if a given password conforms to its standards', () => {
      // Arrange
      const password = "p@ssworD1"

      // Act
      cmp.setData({ password })

      // Assert
      expect(cmp.vm.isValidPassword).toBe(true)
    }),

    it ('returns true if a given password conforms to its standards 2', () => {
      // Arrange
      const password = "Ab1,./;?"

      // Act
      cmp.setData({ password })

      // Assert
      expect(cmp.vm.isValidPassword).toBe(true)
    }),

    it ('returns true if a given password conforms to its standards 3', () => {
      // Arrange
      const password = `Ab1~\`!@#$%^&*()_+-=[]\\;',./{}|:"<>?`

      // Act
      cmp.setData({ password })

      // Assert
      expect(cmp.vm.isValidPassword).toBe(true)
    }),
    
    it ('returns true if a given password has spaces', () => {
      // Arrange
      const password = `Ab1~\`!@#$%^&*()_+-=[]\\;',./{}|:" < > ?`

      // Act
      cmp.setData({ password })

      // Assert
      expect(cmp.vm.isValidPassword).toBe(true)
    }),

    it ('returns true if a given password has spaces 2', () => {
      // Arrange
      const password = `Ab1~\`!@#$     `

      // Act
      cmp.setData({ password })

      // Assert
      expect(cmp.vm.isValidPassword).toBe(true)
    })
  }),

  describe('Password matching', () => {
    it (`returns true when a password and its confirmation match`, () => {
      // Arrange
      const password = "p@ssworD1"
      const confirmPassword = "p@ssworD1"

      // Act
      cmp.setData({ password, confirmPassword })

      // Assert
      expect(cmp.vm.arePasswordsEqual).toBe(true)
    })
  })
})
