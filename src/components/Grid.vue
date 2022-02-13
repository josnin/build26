<script setup>
  const props = defineProps({
    colNum: {
      type: Number,
      default: 2
    },
    rowNum: {
      type: Number,
      default: 2
    },
  });
</script>

<template>
  <div 
    class="layout"
  >
    <template
      v-for="row of props.rowNum"
    >
      <div 
        v-for="col of props.colNum" 
        class="layout__box"
        :class="`ga${row}${col}`"
      ></div>
      
    </template>
  </div>
</template>

<style lang="scss" scoped>

  .layout {
    display: grid;
    grid-template-columns: repeat(v-bind('props.colNum'), auto) ;
    grid-template-rows: repeat(v-bind('props.rowNum'), auto) ;
    //grid-template-areas: ". . . ."
    //                     ". . . ."
    //                     "m1 m1 . .";
    justify-items:center;
    padding:.2rem;
    gap: 0.2rem;

//    .ga11 {
//      grid-column: 1 / span 2;
//`    }


    &__box {
      background-color: #e7feff;
      border: 2px dashed #4286f4;
      height:auto;
      width:100%;
      display: grid;
      padding: .2rem;
      grid-auto-flow: column;
    }
  }

</style>