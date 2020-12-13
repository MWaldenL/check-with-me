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

describe ('Integration test on bad form field inputs', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Register, {
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

  describe('Checking if all fields are valid', () => {
    it (`returns false if the first name is invalid`, () => {
      // Arrange
      const firstName = 'Prinz1'
      const lastName = 'Eugen'
      const username = 'prnz_eugn'
      const email = 'prnz_eugen@gmail.com'
      const password = 'p@ssworD1'
      const confirmPassword = 'p@ssworD1'

      wrapper.setData({
        firstName, 
        lastName, 
        username, 
        email, 
        password, 
        confirmPassword
      })

      // Act
      const result = wrapper.vm.isValidRegistration

      // Assert
      expect(result).toBe(false)
    }),

    it (`returns false if the last name is invalid`, () => {
      // Arrange
      const firstName = 'Prinz'
      const lastName = 'Eugen1'
      const username = 'prnz_eugn'
      const email = 'prnz_eugen@gmail.com'
      const password = 'p@ssworD1'
      const confirmPassword = 'p@ssworD1'

      wrapper.setData({
        firstName, 
        lastName, 
        username, 
        email, 
        password, 
        confirmPassword
      })

      // Act
      const result = wrapper.vm.isValidRegistration

      // Assert
      expect(result).toBe(false)
    }),    
    
    it (`returns false if the username is invalid`, () => {
      // Arrange
      const firstName = 'Prinz1'
      const lastName = 'Eugen'
      const username = 'prnz_eugn'
      const email = 'prnz_eugen@gmail.com'
      const password = 'p@ssworD1'
      const confirmPassword = 'p@ssworD1'

      wrapper.setData({
        firstName, 
        lastName, 
        username, 
        email, 
        password, 
        confirmPassword
      })

      // Act
      const result = wrapper.vm.isValidRegistration

      // Assert
      expect(result).toBe(false)
    }),

    it (`returns false if the email is invalid`, () => {
      // Arrange
      const firstName = 'Prinz1'
      const lastName = 'Eugen'
      const username = 'prnz_eugn'
      const email = ''
      const password = 'p@ssworD1'
      const confirmPassword = 'p@ssworD1'

      wrapper.setData({
        firstName, 
        lastName, 
        username, 
        email, 
        password, 
        confirmPassword
      })

      // Act
      const result = wrapper.vm.isValidRegistration

      // Assert
      expect(result).toBe(false)
    }),

    it (`returns false if the password is invalid`, () => {
      // Arrange
      const firstName = 'Prinz1'
      const lastName = 'Eugen'
      const username = 'prnz_eugn'
      const email = 'prnz_eugen@gmail.com'
      const password = 'p@ssw'
      const confirmPassword = 'p@ssw'

      wrapper.setData({
        firstName, 
        lastName, 
        username, 
        email, 
        password, 
        confirmPassword
      })

      // Act
      const result = wrapper.vm.isValidRegistration

      // Assert
      expect(result).toBe(false)
    }),

    it (`returns false if the passwords don't match`, () => {
      // Arrange
      const firstName = 'Prinz1'
      const lastName = 'Eugen'
      const username = 'prnz_eugn'
      const email = 'prnz_eugen@gmail.com'
      const password = 'p@ssworD69'
      const confirmPassword = 'p@ssworD1'

      wrapper.setData({
        firstName, 
        lastName, 
        username, 
        email, 
        password, 
        confirmPassword
      })

      // Act
      const result = wrapper.vm.isValidRegistration

      // Assert
      expect(result).toBe(false)
    })
  })
})