import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Cell from '@/components/cell'
import Board from '@/store/modules/board' 

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Cell.vue square colors', () => {
  let getters
  let store

  beforeEach(() => {
    let board = Board.getBoard()

    getters = {
      getEntireBoard: () => board
    }

    store = new Vuex.Store({ getters })
  })

  it('shows dark squares for odd rows and odd columns', () => {
    const wrapper = shallowMount(Cell, {
      store,
      localVue,
      propsData: { row: 1, col: 1 }
    })
    expect(wrapper.vm.isDark).toBe(true)
  }),

  it('shows dark squares for even rows and even columns', () => {
    const wrapper = shallowMount(Cell, {
      store,
      localVue,
      propsData: { row: 2, col: 2 }
    })
    expect(wrapper.vm.isDark).toBe(true)
  }),

  it('shows light squares for odd rows and even columns', () => {
    const wrapper = shallowMount(Cell, {
      store,
      localVue,
      propsData: { row: 3, col: 6 }
    })
    expect(wrapper.vm.isDark).toBe(false)
  }),

  it('shows light squares for even rows and odd columns', () => {
    const wrapper = shallowMount(Cell, {
      store,
      localVue,
      propsData: { row: 4, col: 7 }
    })
    expect(wrapper.vm.isDark).toBe(false)
  })
})

