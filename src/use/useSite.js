import { useStore } from 'vuex'
import types from '@/store/types'

export default function useSite() {

      const store = useStore()

      const set = (cmp) => {
        store.commit(`site/${types.SET_DRAG_COMPONENT}`, cmp)
      }

      return {
        set
      }

}