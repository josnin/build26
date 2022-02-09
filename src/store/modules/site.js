import types from '@/store/types'

const site = {
  namespaced: true,
  state: {
    drag_component: {}
  },
  mutations: {
    [types.SET_DRAG_COMPONENT](state, val) {
        state.drag_component = val
    }
  }
}

export default site