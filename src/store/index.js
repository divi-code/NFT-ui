import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    flipped: false,
  },
  mutations: {},
  actions: {
    flip({ state }) {
      console.log('flip flap')
      state.flipped = !state.flipped
    },
  },
  getters: {},
  modules: {},
})
