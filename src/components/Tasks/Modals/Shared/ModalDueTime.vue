<template>
  <div class="row q-mb-sm">
    <q-input class="col" outlined label="Due time" :model-value="dueTime" @update:model-value="updateDueTime">
      <template v-slot:append>
        <q-icon v-if="dueTime" @click="clearDueTime" name="close" class="cursor-pointer" />
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qTimeProxy" cover transition-show="scale" transition-hide="scale">
            <q-time :model-value="dueTime" @update:model-value="updateDueTime">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-time>
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
      dueTime: {
        get() {
          return this.modelValue;
        },
        set(newValue) {
          this.$emit('update:modelValue', newValue);
        }
      }
    },
    methods: {
      updateDueTime(value) {
        this.dueTime = value;
      },
      clearDueTime() {
        this.dueTime = '';
      }
    }
  }
</script>
