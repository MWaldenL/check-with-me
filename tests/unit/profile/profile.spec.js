import { shallowMount, RouterLinkStub, createLocalVue } from '@vue/test-utils'
import { 
  BRow, 
  BCol
} from 'bootstrap-vue'
import Profile from '@/views/Profile'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe ('Method tests on profile statistics (with wins, loss, draw)', () => {
  let store
  let wrapper
  beforeEach(() => {
    const user = {
      isLoggedIn: true,
      data: {
        email: 'sample.email@gmail.com',
        wins_white: 72,
        wins_black: 60,
        loss_white: 48,
        loss_black: 36,
        draw_white: 24,
        draw_black: 12
      }
    }
 
    const getters = {
      getCurrentUser: () => user
    }
 
    store = new Vuex.Store({ getters })
 
    wrapper = shallowMount(Profile, {
      stubs: {
        'b-row': BRow,
        'b-col': BCol,
        RouterLink: RouterLinkStub
      },
      store, 
      localVue
    })
  })

  it('returns hashed value of email', () => {
    const expected = 'sa*****************com'
    const result = wrapper.vm.getEmail

    expect(expected).toEqual(result)
  })

  it('returns total number of wins', () => {
    const expected = 132
    const result = wrapper.vm.getTotalWins

    expect(expected).toEqual(result)
  })

  it('returns total number of games', () => {
    const expected = 252
    const result = wrapper.vm.getTotalGames

    expect(expected).toEqual(result)
  })

  it('returns win rate given by number of wins over number of wins and losses', () => {
    const expected = "61.11%"
    const result = wrapper.vm.getWinRate

    expect(expected).toEqual(result)
  })

  it('returns points given by wins * 1 + draws * 0.5 + losses * -0.5', () => {
    const expected = 108
    const result = wrapper.vm.getPoints

    expect(expected).toEqual(result)
  })
})

describe ('Method tests on profile statistics (no wins, loss, with draw)', () => {
  let store
  let wrapper
  beforeEach(() => {
    const user = {
      isLoggedIn: true,
      data: {
        email: 'sample.email@gmail.com',
        wins_white: 0,
        wins_black: 0,
        loss_white: 0,
        loss_black: 0,
        draw_white: 24,
        draw_black: 12
      }
    }
 
    const getters = {
      getCurrentUser: () => user
    }
 
    store = new Vuex.Store({ getters })
 
    wrapper = shallowMount(Profile, {
      stubs: {
        'b-row': BRow,
        'b-col': BCol,
        RouterLink: RouterLinkStub
      },
      store, 
      localVue
    })
  })

  it('returns 0.00% for a player with all games completed as draws', () => {
    const expected = "0.00%"
    const result = wrapper.vm.getWinRate

    expect(expected).toEqual(result)
  })
})

describe ('Method tests on profile statistics (no games completed)', () => {
  let store
  let wrapper
  beforeEach(() => {
    const user = {
      isLoggedIn: true,
      data: {
        email: 'sample.email@gmail.com',
        wins_white: 0,
        wins_black: 0,
        loss_white: 0,
        loss_black: 0,
        draw_white: 0,
        draw_black: 0
      }
    }
 
    const getters = {
      getCurrentUser: () => user
    }
 
    store = new Vuex.Store({ getters })
 
    wrapper = shallowMount(Profile, {
      stubs: {
        'b-row': BRow,
        'b-col': BCol,
        RouterLink: RouterLinkStub
      },
      store, 
      localVue
    })
  })

  it('returns N/A for a player with no games completed', () => {
    const expected = "N/A"
    const result = wrapper.vm.getWinRate

    expect(expected).toEqual(result)
  })
})