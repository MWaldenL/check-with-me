import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Cell from '@/components/cell'
import { getBoard } from '@/store/modules/board' 

const localVue = createLocalVue()
localVue.use(Vuex)


describe('Cell.vue initial piece placement', () => {
  let getters
  let store

  beforeEach(() => {
    let board = getBoard()

    getters = {
      getEntireBoard: () => board
    }

    store = new Vuex.Store({ getters })
  })

  describe('Black piece locations', () => {
    it('initially places black pieces only on even columns of row 6', () => {
      const wrapper = shallowMount(Cell, {
        store,
        localVue,
        propsData: { row: 6, col: 4 }
      })
  
      expect(wrapper.vm.hasBlackChip).toBe(true)
    }),
  
    it('places black pieces only on even columns of row 8', () => {
      const wrapper = shallowMount(Cell, {
        store,
        localVue,
        propsData: { row: 8, col: 2 }
      })
  
      expect(wrapper.vm.hasBlackChip).toBe(true)
    }),
  
    it('initially places black pieces only on odd columns of row 7', () => {
      const wrapper = shallowMount(Cell, {
        store,
        localVue,
        propsData: { row: 7, col: 5 }
      })
  
      expect(wrapper.vm.hasBlackChip).toBe(true)
    })
  }),

  describe('White piece locations', () => {
    it('initially places white pieces only on even columns of row 2', () => {
      const wrapper = shallowMount(Cell, {
        store,
        localVue,
        propsData: { row: 2, col: 4 }
      })
  
      expect(wrapper.vm.hasWhiteChip).toBe(true)
    }),
  
    it('initially places white pieces only on odd columns of row 1', () => {
      const wrapper = shallowMount(Cell, {
        store,
        localVue,
        propsData: { row: 1, col: 7 }
      })
  
      expect(wrapper.vm.hasWhiteChip).toBe(true)
    }),
  
    it('initially places white pieces only on odd columns of row 3', () => {
      const wrapper = shallowMount(Cell, {
        store,
        localVue,
        propsData: { row: 3, col: 5 }
      })
  
      expect(wrapper.vm.hasWhiteChip).toBe(true)
    })
  })
})
