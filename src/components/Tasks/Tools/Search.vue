<template>
  <q-input outlined class="col" v-select-all v-model="searchField" @keyup.esc="searchField = ''" label="Search">

    <template v-slot:append>
      <q-icon v-if="searchField !== ''" name="close" @click="searchField = ''" class="cursor-pointer" />
      <q-icon name="search" />
    </template>

  </q-input>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import { SelectAll } from 'src/directives/directive-select-all';

  export default {
    computed: {
      ...mapState('tasks', ['search']),
      searchField: {
        get() {
          return this.search
        },
        set(value) {
          this.setSearch(value)
        }
      }
    },
    methods: {
      ...mapActions('tasks', ['setSearch'])
    },
    directives: {
      SelectAll
    }
  }
</script>
