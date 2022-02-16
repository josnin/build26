import { createStore } from 'vuex'
import site from '@/store/modules/site'
import grid from '@/store/modules/grid'

const store = createStore({
  strict: true,
  modules: {
    site,
    grid
  },
})

export default store;