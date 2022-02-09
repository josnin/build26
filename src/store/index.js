import { createStore } from 'vuex'
import site from '@/store/modules/site'

const store = createStore({
  strict: true,
  modules: {
    site: site,
  },
})

export default store;