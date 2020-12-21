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

describe('Bad input tests on registration fields', () => {
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
    it ('returns false if the user-inputted name contains numbers', () => {
      // Arrange
      const name = 'Matthew1'
      
      // Act
      const result = cmp.vm.isValidName(name)
      
      // Assert
      expect(result).toBe(false)
    }),

    it ('checks if the user-inputted name contains special characters', () => {
      // Arrange
      const name = 'Lua*'
      
      // Act
      const result = cmp.vm.isValidName(name)
      
      // Assert
      expect(result).toBe(false)
    }),

    it ('checks if the user-inputted name contains numbers and special characters', () => {
      // Arrange
      const name = 'Lua2*'
      
      // Act
      const result = cmp.vm.isValidName(name)
      
      // Assert
      expect(result).toBe(false)
    }),

    it ('checks if the user-inputted name is empty', () => {
      // Arrange
      const name = ''
      
      // Act
      const result = cmp.vm.isValidName(name)
      
      // Assert
      expect(result).toBe(false)
    }),
    
    it ('checks if the user-inputted name contains only spaces', () => {
      // Arrange
      const name = '   '
      
      // Act
      const result = cmp.vm.isValidName(name)
      
      // Assert
      expect(result).toBe(false)
    }),

    it ('checks if the user-inputted name contains multiple spaces', () => {
      // Arrange
      const name = 'Abc   Def'
      
      // Act
      const result = cmp.vm.isValidName(name)
      
      // Assert
      expect(result).toBe(false)
    }),

    
    it ('checks if the user-inputted name contains spaces at the beginning', () => {
      // Arrange
      const name = '  Abc'
      
      // Act
      const result = cmp.vm.isValidName(name)
      
      // Assert
      expect(result).toBe(false)
    })
  }),

  describe('Username testing', () => {
    it('returns false if the username is empty', () => {
      // Arrange
      const username = ''

      // Act
      cmp.setData({ username })
      const result = cmp.vm.isValidUsername

      // Assert
      expect(result).toBe(false)
    }),

    it('returns false if the username is less than 8 characters long', () => {
      // Arrange
      const username = 'usernam'

      // Act
      cmp.setData({ username })
      const result = cmp.vm.isValidUsername

      // Assert
      expect(result).toBe(false)
    }),

    it('returns false if the username is greater than 20 characters long', () => {
      // Arrange
      const username = '012345678901234567890'

      // Act
      cmp.setData({ username })
      const result = cmp.vm.isValidUsername

      // Assert
      expect(result).toBe(false)
    }),

    it('returns false if the username contains special characters', () => {
      // Arrange
      const username = 'username_'

      // Act
      cmp.setData({ username })
      const result = cmp.vm.isValidUsername

      // Assert
      expect(result).toBe(false)
    })
  })
  
  describe('Email testing', () => {
    it ('returns false if an email is empty', () => {
      // Arrange
      const email = ""

      // Act
      cmp.setData({ email })

      // Assert
      expect(cmp.vm.isValidEmail).toBe(false)
    }),

    it ('returns false if an email contains leading or trailing spaces', () => {
      // Arrange
      const email = "   user@gmail.com   "

      // Act
      cmp.setData({ email })

      // Assert
      expect(cmp.vm.isValidEmail).toBe(false)
    }),

    it ('returns false if an email does not have an @ sign', () => {
      // Arrange
      const email = "useremail.com"

      // Act
      cmp.setData({ email })

      // Assert
      expect(cmp.vm.isValidEmail).toBe(false)
    }),

    it ('returns false if an email does not have an . sign', () => {
      // Arrange
      const email = "useremailcom"

      // Act
      cmp.setData({ email })

      // Assert
      expect(cmp.vm.isValidEmail).toBe(false)
    }),

    it ('returns false if an email has the . and @ signs reversed', () => {
      // Arrange
      const email = "user.email@com"

      // Act
      cmp.setData({ email })

      // Assert
      expect(cmp.vm.isValidEmail).toBe(false)
    }),

    it ('returns false if an email starts with the @ sign', () => {
      // Arrange
      const email = "@useremail.com"

      // Act
      cmp.setData({ email })

      // Assert
      expect(cmp.vm.isValidEmail).toBe(false)
    }),

    
    it ('returns false if an email starts with the . sign', () => {
      // Arrange
      const email = ".comemailuser"

      // Act
      cmp.setData({ email })

      // Assert
      expect(cmp.vm.isValidEmail).toBe(false)
    })
  }),

  describe('Password testing', () => {
    it ('returns false if a given password is empty', () => {
      // Arrange
      const password = ""

      // Act
      cmp.setData({ password })

      // Assert
      expect(cmp.vm.isValidPassword).toBe(false)
    }),

    it ('returns false if a given password is less than 8 characters long', () => {
      // Arrange
      const password = "abcdefg"

      // Act
      cmp.setData({ password })

      // Assert
      expect(cmp.vm.isValidPassword).toBe(false)
    }),

    it ('returns false if a given password has no special characters', () => {
      // Arrange
      const password = "ABCcdefg"

      // Act
      cmp.setData({ password })

      // Assert
      expect(cmp.vm.isValidPassword).toBe(false)
    }),

    it ('returns false if a given password has no special characters 2', () => {
      // Arrange
      const password = "Abcdefg1"

      // Act
      cmp.setData({ password })

      // Assert
      expect(cmp.vm.isValidPassword).toBe(false)
    }),

    it ('returns false if a given password has only special characters', () => {
      // Arrange
      const password = `~\`!@#$%^&*()_+-=[]\\;',./{}|:"<>?`

      // Act
      cmp.setData({ password })

      // Assert
      expect(cmp.vm.isValidPassword).toBe(false)
    }),

    it ('returns false if a given password has no uppercase letter', () => {
      // Arrange
      const password = "abcdefg@"

      // Act
      cmp.setData({ password })

      // Assert 
      expect(cmp.vm.isValidPassword).toBe(false)
    }),

    it ('returns false if a given password has no lowercase letter', () => {
      // Arrange
      const password = "ABCDEFG&"

      // Act
      cmp.setData({ password })

      // Assert
      expect(cmp.vm.isValidPassword).toBe(false)
    })
  })

  describe('Password matching', () => {
    it (`returns false when the password and its confirmation don't match`, () => {
      // Arrange
      const password = "p@ssworD1"
      const confirmPassword = "p@ssworD2"

      // Act
      cmp.setData({ password, confirmPassword })

      // Assert
      expect(cmp.vm.arePasswordsEqual).toBe(false)
    })
  })
})
