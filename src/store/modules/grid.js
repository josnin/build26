import types from '@/store/types'

const grid = {
  namespaced: true,
  state: {
    grid: {},
  },
  mutations: {
    [types.SET_GRID_OK](state, val) {
        state.grid = val;
        console.log(val)
    },
    [types.CREATE_GRID_OK](state, { status, data }) {
      console.log('CREATE GRID OK', data)
      state.grid.push(data)
      console.log(state.grid)
    },
    [types.UPDATE_GRID_OK](state, { status, data }) {
      state.grid = state.grid.filter(r => r.id != data.id)
      state.grid.push(data)
    },
    [types.FETCH_GRID_OK](state, { status, data} ) {
      state.grid = data;
    },
    [types.REMOVE_GRID_OK](state, { status, id } ) {
      state.grid = state.grid.filter(res => res.id !== id)
    },
  },
  actions: {
    async [types.CREATE_GRID]({ commit, rootState }, obj) {
      //obj.created_by_id = rootState.auth.user.id;
      //const response = await fetch(import.meta.env.VITE_GRID_CREATE_URL, {
      //  method: 'POST',
      //  headers: {
      //    'Content-Type': 'application/json',
      //    'Authorization': `Bearer ${rootState.auth.token.access_token}`
      //  },
      //  body: JSON.stringify(obj)
      //});
      //const status = response.status;
      //const data = await response.json();
      //if (response.ok) {
      //  commit(types.CREATE_GRID_OK, { status, data })
      //} else {
      //  // TODO: ??
      //}

      // TODO: get from db??
      console.log('xxxxxx', obj)
      const data = obj
      const status = 'SUCCESS';
      commit(types.CREATE_GRID_OK, { status, data })
      return { status, data };
    },
    async [types.UPDATE_GRID]({ commit, rootState }, { obj_id, obj }) {

      //const response = await fetch(`${import.meta.env.VITE_GRID_URL}/${obj_id}`, {
      //  method: 'PUT',
      //  headers: {
      //    'Content-Type': 'application/json',
      //    'Authorization': `Bearer ${rootState.auth.token.access_token}`
      //  },
      //  body: JSON.stringify(obj)
      //});
      //const status = response.status;
      //const data = await response.json();
      //if (response.ok) {
      //  commit(types.UPDATE_GRID_OK, { status, data })
      //} else {
      //  console.log(response)
      //  console.log(obj)
      //  // TODO: ??
      //}
      const status = 'SUCCESS';
      const data = obj
      commit(types.UPDATE_GRID_OK, { status, data })
      return { status, data };
    },
    async [types.FETCH_GRID]({ commit, rootState } ) {
      //const response = await fetch(import.meta.env.VITE_GRID_LIST_URL, {
      //  headers: {
      //    'Content-Type': 'application/json',
      //    'Authorization': `Bearer ${rootState.auth.token.access_token}`
      //  },
      //})
      //const status = response.status;
      //const data = await response.json();
      //if (response.ok) {
      //  commit(types.FETCH_GRID_OK, { status, data })
      //} else {
      //  // TODO: ??
      //}
      const status = 'SUCCESS';
      const data = obj
      commit(types.FETCH_GRID_OK, { status, data })
      return { status, data };
    },
    async [types.REMOVE_GRID]({ commit, rootState }, obj_id ) {
      //const response = await fetch(`${import.meta.env.VITE_GRID_URL}/${obj_id}`, {
      //  method: 'DELETE',
      //  headers: {
      //    'Content-Type': 'application/json',
      //    'Authorization': `Bearer ${rootState.auth.token.access_token}`
      //  },
      //});
      //const status = response.status;
      ////const data = await response.json();
      //if (response.ok) {
      //  commit(types.REMOVE_GRID_OK, { status, obj_id } )
      //} else {
      //  // TODO: ??
      //}
      const status = 'SUCCESS';
      commit(types.REMOVE_GRID_OK, { status, obj_id } )
      return { status, obj_id };
    }
  }
}

export default grid