import types from '@/store/types'

const grid = {
  namespaced: true,
  state: {
    grid: {}
  },
  mutations: {
    [types.SET_GRID_OK](state, val) {
        state.grid = val;
    }
  }
}

export default grid