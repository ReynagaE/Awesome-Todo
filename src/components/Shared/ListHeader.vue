<template>
  <q-banner dense inline-actions :class="bgColor" class="text-white text-center list-header">
    <span class="text-bold text-subtitle1"><slot></slot></span>
  </q-banner>
</template>

<script>
  export default {
    props: ['bgColor']
  }
</script>

<style>
  .list-header {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
</style>
