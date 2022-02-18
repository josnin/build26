import { useStore } from 'vuex'
import types from '@/store/types'

export default function useGrid() {

      const store = useStore()

      const setGrid = (data) => {
        data =  {
          ...store.state.grid.grid,
          ...data
        }
        store.commit(`grid/${types.SET_GRID_OK}`, data)
      }


      return {
        setGrid,
      }

}