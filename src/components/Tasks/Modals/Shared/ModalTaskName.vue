<template>
  <div class="row q-mb-sm">
    <q-input
      :model-value="name"
      @update:model-value="updateName"
      :rules="[val => !!val || 'Field is required']"
      autofocus
      v-select-all
      ref="name"
      class="col"
      label="Task name"
      outlined
    >
      <template v-slot:append>
        <q-icon v-if="name" @click="clearName" name="close" class="cursor-pointer" />
      </template>
    </q-input>
  </div>
</template>

<script>
import { SelectAll } from 'src/directives/directive-select-all'

export default {
  props: ['modelValue'],
  directives: {
    SelectAll
  },
  emits: ['update:modelValue'],
  computed: {
    name: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit('update:modelValue', newValue);
      }
    }
  },
  methods: {
    updateName(value) {
      this.name = value;
    },
    clearName() {
      this.name = '';
    }
  }
}
</script>

