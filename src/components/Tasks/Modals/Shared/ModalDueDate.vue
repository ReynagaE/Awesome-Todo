<template>
  <div class="row q-mb-sm">
    <q-input class="col" outlined label="Due date" :model-value="dueDate" @update:model-value="updateDueDate">
      <template v-slot:append>
        <q-icon v-if="dueDate" @click="clearDueDate" name="close" class="cursor-pointer" />
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
            <q-date :model-value="dueDate" @update:model-value="updateDueDate">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
  export default {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    computed: {
      dueDate: {
        get() {
          return this.modelValue;
        },
        set(newValue) {
          this.$emit('update:modelValue', newValue);
        }
      }
    },
    methods: {
      updateDueDate(value) {
        this.dueDate = value;
      },
      clearDueDate() {
        this.dueDate = '';
      }
    }
  }
</script>
