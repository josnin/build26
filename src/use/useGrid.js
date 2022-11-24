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

  const create = async (obj) => await store.dispatch(`grid/${types.CREATE_GRID}`, obj);
  const update = async (obj_id, obj) => await store.dispatch(`grid/${types.UPDATE_GRID}`, { obj_id, obj } );
  const fetch = async() => await store.dispatch(`grid/${types.FETCH_GRID}`);
  const remove = async (obj_id) => await store.dispatch(`grid/${types.REMOVE_GRID}`, obj_id);

  const get = async (id) => {
    return await store.state.grid.filter(res => res.id === id);
  }


  return {
    setGrid,
    get,
    create,
    update,
    fetch,
    remove
  }

}