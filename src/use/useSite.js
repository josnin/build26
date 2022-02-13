import { useStore } from 'vuex'
import types from '@/store/types'

export default function useSite() {

      const store = useStore()

      const setDragComponent = (cmp) => {
        store.commit(`site/${types.SET_DRAG_COMPONENT}`, cmp)
      }

      const setNextSibling = (next) => {
        store.commit(`site/${types.SET_NEXT_SIBLING}`, next);
      }

      return {
        setDragComponent,
        setNextSibling
      }

}