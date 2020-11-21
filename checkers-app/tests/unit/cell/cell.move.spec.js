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
  
  describe('Highlighting a piece', () => {
    // Arrange
    beforeEach(() => {
      getters = {
        getEntireBoard: () => Board.getBoard(),
        getFirstClick: () => null
      }
  
      actions = {
        aMoveForward: jest.fn(),
        aHighlight: jest.fn()
      }
  
      store = new Vuex.Store({ getters, actions })
    })

    it('dispatches aHighlight when onSquareClicked is called without a source square', () => {
      const wrapper = shallowMount(Cell, { 
        store, 
        localVue, 
        propsData: { row: 3, col: 3 }
      })

      // Act
      wrapper.find('.dark').trigger('click')

      // Assert
      expect(actions.aHighlight).toHaveBeenCalled()
    })
  })

  describe('Moving a piece', () => {
    // Arrange 
    beforeEach(() => {
      getters = {
        getEntireBoard: () => Board.getBoard(),
        getFirstClick: () => { 
          return { nRow: 1, nCol: 1 }
        }
      }
  
      actions = {
        aMoveForward: jest.fn()
      }
  
      store = new Vuex.Store({ getters, actions })
    })

    it('dispatches aMoveForward when onSquareClicked is called with an existing source square', () => {
      const wrapper = shallowMount(Cell, { 
        store, 
        localVue, 
        propsData: { row: 2, col: 2 }
      })
      
      wrapper.find('.dark').trigger('click')
      expect(actions.aMoveForward).toHaveBeenCalled()
    })
  }) 

  describe('Capturing a piece', () => {
    // Arrange 
    beforeEach(() => {
      getters = {
        getEntireBoard: () => Board.getBoard(),
        getFirstClick: () => { 
          return { nRow: 1, nCol: 1 }
        }
      }
  
      actions = {
        aCapturePiece: jest.fn()
      }
  
      store = new Vuex.Store({ getters, actions })
    })

    it('dispatches aMoveForward when onSquareClicked is called with an existing source square', () => {
      const wrapper = shallowMount(Cell, { 
        store, 
        localVue, 
        propsData: { row: 3, col: 3 }
      })
      
      // Act
      wrapper.find('.dark').trigger('click')

      // Assert
      expect(actions.aCapturePiece).toHaveBeenCalled()
    })
  }) 

})