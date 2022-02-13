<script setup>
  const props = defineProps({
    gridAutoFlow: {
      type: String,
      default: 'column'
    },
    justifyItems: {
      type: String,
      default: 'right'
    }
  });
</script>

<template>
  <div 
    class="box">
    <!-- drop here? -->
  </div>
</template>

<style lang="scss" scoped>

  .box {
    display: grid;
    grid-auto-flow: column;
    justify-items:v-bind('props.justifyItems');
    padding:.2rem;
    gap: 0.2rem;
    background-color: #e7feff;
    border: 2px dashed #4286f4;

  }

</style>