import Auth from '@/store/modules/auth/index.js'

describe('Setting the logged in state', () => {
  it ('sets the logged in state of the current user', () => {
    // Arrange
    const state = {
      user: {
        isLoggedIn: false
      }
    }

    // Act
    Auth.mutations.setUserLoggedIn(state, true)

    // Assert
    expect(state.user.isLoggedIn).toBe(true)
  })
})