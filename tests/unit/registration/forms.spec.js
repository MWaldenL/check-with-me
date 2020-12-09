import { shallowMount } from '@vue/test-utils'
import { BForm, BFormInline, BFormGroup, BButton } from 'bootstrap-vue'
import Register from '@/views/Register'

describe('Good input tests on registration fields', () => {
  let cmp
  beforeEach(() => {
    cmp = shallowMount(Register)
      // stubs: {
      //   'b-form': BForm,
      //   'b-form-inline': BFormInline,
      //   'b-form-group': BFormGroup,
      //   'b-button': BButton,
      // }})
  })

  describe('Name testing', ()  => {
    it ('returns true if the user-inputted first name contains only letters', () => {
      // Arrange
      const name = 'Matthew'
      
      // Act
      cmp.setData({ firstName: name })
      
      // Assert
      expect(cmp.vm.isValidFirstName).toBe(true)
    }),

    it ('checks if the user-inputted last name contains only letters', () => {
      // Arrange
      const name = 'Lua'
      
      // Act
      cmp.setData({ lastName: name })
      
      // Assert
      expect(cmp.vm.isValidLastName).toBe(true)
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
  })
})
