import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Cell from '@/components/cell'
import Board from '@/store/modules/board' 

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Cell.vue normal piece movement', () => {
  let getters, actions, store
  let board = Board.getBoard()
  
  beforeEach(() => {
    getters = {
      getEntireBoard: () => board,
      getFirstClick: () => { 
        return { row: 3, col: 3 }
      }
    }

    actions = {
      aMoveForward: jest.fn(),
      aHighlight: jest.fn()
    }

    store = new Vuex.Store({ getters, actions })
  })

  describe('Legal square highlighting', () => {
    it('highlights the legal squares a piece can move to when clicked', () => {

    }) 
  }),
  
  describe('Moving a piece', () => {
    beforeEach(() => {
      getters = {
        getEntireBoard: () => board,
        getFirstClick: () => { 
          return { row: 3, col: 3 }
        }
      }
  
      actions = {
        aMoveForward: jest.fn(),
        aHighlight: jest.fn()
      }
  
      store = new Vuex.Store({ getters, actions })
    })

    it('dispatches aMoveForward when moveDiagonally is called with a source', () => {
      const wrapper = shallowMount(Cell, { 
        store, 
        localVue, 
        propsData: {row: 3, col: 3}
      })
      
      wrapper.find('.dark').trigger('click')
      expect(actions.aMoveForward).toHaveBeenCalled()
    })
  }),

  describe('Highlighting a piece', () => {
    beforeEach(() => {
      getters = {
        getEntireBoard: () => board,
        getFirstClick: () => null
      }
  
      actions = {
        aMoveForward: jest.fn(),
        aHighlight: jest.fn()
      }
  
      store = new Vuex.Store({ getters, actions })
    })

    it('dispatches aHighlight when moveDiagonally is called without a source', () => {
      const wrapper = shallowMount(Cell, { 
        store, 
        localVue, 
        propsData: {row: 3, col: 3}
      })

      wrapper.find('.dark').trigger('click')
      expect(actions.aHighlight).toHaveBeenCalled()
    })
  })
})