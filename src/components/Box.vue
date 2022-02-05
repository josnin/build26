<script setup>
  //import { defineProps } from 'vue';

  const props = defineProps({
    justifyItems: {
      type: String,
      default: 'center'
    },
    alignItems: {
      type: String,
      default: 'baseline'
    },
    width: {
      type: String,
      default: '300px'
    },
    height: {
      type: String,
      default: '300px'
    }
  })

  console.log(`im  box ${props.width} ${props.height}`)
</script>

<template>
  <div 
    class="box" 
    :style="{ justifyItems: props.justifyItems, alignItems: props.alignItems }">
    <div 
      class="box__size" 
      :style="{ width: props.width, height: props.height }"> 
        resize me??
    </div>
  </div>
</template>

<style lang="scss" scoped>

  .box {

    display: grid;
    width: 100%;
    box-sizing: border-box;

    &__size {
      border: 2px solid #4286f4;
      resize: both;
      overflow: auto; /* required in order to resize */
    }
  }

</style>