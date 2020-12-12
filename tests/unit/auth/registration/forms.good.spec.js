import { shallowMount } from '@vue/test-utils'
import { BForm, BFormInput, BInputGroup, BButton } from 'bootstrap-vue'
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
