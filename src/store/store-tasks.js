import { ref, onChildAdded, onChildChanged, onChildRemoved, set, update, remove, onValue } from "firebase/database"
import { uid, Notify } from "quasar"
import { firebaseDb, firebaseAuth } from "src/boot/firebase"
import { showErrorMessage } from "src/functions/function-show-error-message"


const state = {
  tasks: {
    // 'ID1': {
    //   name: 'Go to shop',
    //   completed: false,
    //   dueDate: '2023/05/27',
    //   dueTime: '18:30',
    // },
    // 'ID2': {
    //   name: 'Get banans',
    //   completed: false,
    //   dueDate: '2023/05/28',
    //   dueTime: '16:00',
    // },
    // 'ID3': {
    //   name: 'Get apples',
    //   completed: false,
    //   dueDate: '2023/05/29',
    //   dueTime: '14:00',
    // }
  },
  search: '',
  sort: 'name',
  tasksDownloaded: false
}

const mutations = {
  updateTask(state, payload) {
    Object.assign(state.tasks[payload.id], payload.updates)
  },
  deleteTask(state, id) {
    delete state.tasks[id]
  },
  addTask(state, payload) {
    state.tasks = { ...state.tasks, [payload.id]: payload.task };
  },
  clearTasks(state) {
    state.tasks = {}
  },
  setSearch(state, value) {
    state.search = value
  },
  setSort(state, value) {
    state.sort = value
  },
  setTasksDownloaded(state, value) {
    state.tasksDownloaded = value
  }
}

const actions = {
  updateTask({ dispatch }, payload) {
    dispatch('fbUpdateTask', payload)
  },
  deleteTask({ dispatch }, id) {
    dispatch('fbDeleteTask', id)
  },
  addTask({ dispatch }, task) {
    let taskId = uid()
    let payload = {
      id: taskId,
      task: task
    }
    dispatch('fbAddTask', payload)
  },
  setSearch({ commit }, value) {
    commit('setSearch', value)
  },
  setSort({ commit }, value) {
    commit('setSort', value)
  },
  fbReadData({ commit }) {
    let userId = firebaseAuth.currentUser.uid
    let userTasks = ref(firebaseDb, 'tasks/' + userId)

    // initil check for data
    onValue(userTasks, (snapshot) => {
        commit('setTasksDownloaded', true)
    }, error => {
      showErrorMessage(error.message)
      setTimeout(() => {
        this.$router.replace('/auth')
      }, 2000)
    })


    // child added
    onChildAdded(userTasks, (childSnapshot) => {
      const taskId = childSnapshot.key
      const task = childSnapshot.val()
      let payload = {
        id: taskId,
        task: task
      }
      commit('addTask', payload)
    })

    // child changed
    onChildChanged(userTasks, (childSnapshot) => {
      const taskId = childSnapshot.key
      const task = childSnapshot.val()
      let payload = {
        id: taskId,
        updates: task
      }
      commit('updateTask', payload)
    })

    // child removed
    onChildRemoved(userTasks, (childSnapshot) => {
      const taskId = childSnapshot.key
      commit('deleteTask', taskId)
    })
  },
  fbAddTask({}, payload) {
    let userId = firebaseAuth.currentUser.uid
    let taskRef = ref(firebaseDb, 'tasks/' + userId + '/' + payload.id)
    set(taskRef, payload.task)
    .then(() => {
      Notify.create({
        message: 'Task added!',
        color: 'positive',
        icon: 'done'
      })
    })
    .catch(error => {
        showErrorMessage(error.message)
    })
  },
  fbUpdateTask({}, payload) {
    let userId = firebaseAuth.currentUser.uid
    let taskRef = ref(firebaseDb, 'tasks/' + userId + '/' + payload.id)
    update(taskRef, payload.updates)
    .then(() => {
      let keys = Object.keys(payload.updates)
      if (!(keys.includes('completed') && keys.length == 1)) {
        Notify.create({
          message: 'Task updated!',
          color: 'info',
          icon: 'update'
        })
      }
    })
    .catch(error => {
        showErrorMessage(error.message)
    })
  },
  fbDeleteTask({}, taskId) {
    let userId = firebaseAuth.currentUser.uid
    let taskRef = ref(firebaseDb, 'tasks/' + userId + '/' + taskId)
    remove(taskRef)
    .then(() => {
        Notify.create({
          message: 'Task deleted!',
          color: 'negative',
          icon: 'delete_sweep'
        })
    })
    .catch(error => {
        showErrorMessage(error.message)
    })
  }
}

const getters = {
  tasksSorted: (state) => {
    let tasksSorted = {},
    keysOrdered = Object.keys(state.tasks)
    keysOrdered.sort((a,b) => {
      let taskAProp = state.tasks[a][state.sort].toLowerCase(),
          taskBProp = state.tasks[b][state.sort].toLowerCase()
      if (taskAProp > taskBProp) return 1
      else if (taskAProp < taskBProp) return -1
      else return 0
    })
    keysOrdered.forEach((key) => {
      tasksSorted[key] = state.tasks[key]
    })
    return tasksSorted
  },
  tasksFiltered: (state, getters) => {
    let tasksSorted = getters.tasksSorted,
        tasksFiltered = {}
    if (state.search) {
      Object.keys(tasksSorted).forEach(function(key) {
        let task = tasksSorted[key],
        taskNameLowerCase = task.name.toLowerCase(),
        searchLowerCase = state.search.toLowerCase()
        if (taskNameLowerCase.includes(searchLowerCase)) {
          tasksFiltered[key] = task
        }
      })
      return tasksFiltered
    }
    return tasksSorted
  },
  tasksTodo: (state, getters) => {
    let tasksFiltered = getters.tasksFiltered
    let tasks = {}
    Object.keys(tasksFiltered).forEach(function(key) {
      let task = tasksFiltered[key]
      if(!task.completed) {
        tasks[key] = task
      }
    })
    return tasks
  },
  tasksCompleted: (state, getters) => {
    let tasksFiltered = getters.tasksFiltered
    let tasks = {}
    Object.keys(tasksFiltered).forEach(function(key) {
      let task = tasksFiltered[key]
      if(task.completed) {
        tasks[key] = task
      }
    })
    return tasks
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
