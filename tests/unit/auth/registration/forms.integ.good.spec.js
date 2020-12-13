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

describe ('Integration test on good form field inputs', () => {
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
    it (`returns true if first and last names contain letters only, email follows proper format
      passwords contain at least 8 characters and has at least one uppercase and lowercase letter and
      has at least one special character, and that a password and its confirmation match.`, () => {
        // Arrange
        const firstName = 'Prinz'
        const lastName = 'Eugen'
        const username = 'prnzeugn'
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
        expect(result).toBe(true)
      })
  })
})