<template>
  <transition
  appear
  enter-active-class="animated zoomIn"
  leave-active-class="animated zoomOut"
  >
    <q-banner :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
      <template v-slot:avatar>
        <q-icon name="check" color="primary" />
      </template>
      You have no tasks to do today!.
      <template v-slot:action>
        <q-btn @click="$emit('showAddTask')" flat color="primary" label="Add task" />
      </template>
    </q-banner>
  </transition>
</template>

<script>
export default {

}
</script>


