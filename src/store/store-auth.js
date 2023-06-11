import { firebaseAuth } from "src/boot/firebase.js"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth"
import { LocalStorage, Loading } from "quasar"
import { showErrorMessage } from "src/functions/function-show-error-message"

const state = {
  loggedIn: false
}

const mutations = {
  setLoggedIn(state, value) {
    state.loggedIn = value
  }
}

const actions = {
  registerUser({}, payload) {
    Loading.show()
    createUserWithEmailAndPassword(firebaseAuth, payload.email, payload.password)
    .then(response => {
      console.log('response: ', response)
    })
    .catch(error => {
      showErrorMessage(error.message)
    })
  },
  loginUser({}, payload) {
    Loading.show()
    signInWithEmailAndPassword(firebaseAuth, payload.email, payload.password)
    .catch(error => {
      showErrorMessage(error.message)
    })
  },
  logoutUser() {
    signOut(firebaseAuth)
  },
  handleAuthStateChange({ commit, dispatch }) {
    onAuthStateChanged(firebaseAuth, user => {
      Loading.hide()
      if (user) {
        commit('setLoggedIn', true)
        LocalStorage.set('loggedIn', true)
        this.$router.push('/')
        dispatch('tasks/fbReadData', null, { root: true })
      } else {
        commit('tasks/clearTasks', null, { root: true })
        commit('tasks/setTasksDownloaded', false, { root: true })
        commit('setLoggedIn', false)
        LocalStorage.set('loggedIn', false)
        this.$router.replace('/auth')
      }
    });
  }
}

const getters = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
