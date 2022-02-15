<script setup>
  const props = defineProps({
    colNum: {
      type: Number,
      default: 4
    },
    rowNum: {
      type: Number,
      default: 5
    },
  });

  // @todo move to utils?
  const range = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);


  // @todo use store
  let merge1 = {};
  const setRowColStart = (e, r, c) => {
    merge1 = {
      r, c
    }
  }
  const setRowColEnd = (e, r1, r2, c1, c2) => {

    const rowNumbers = range(merge1.row, r1);
    const colNumbers = range(merge1.col, c1);

    // @todo how to make draggable component hash unique ?
    const classId = (+new Date).toString(36);

    rowNumbers.forEach(r => {
      colNumbers.forEach(c => {
        console.log(r, c)
        document.querySelector(`.ga${r}${c}`).classList.add(classId)
      })
    })
    
    let style = document.createElement('style');
    e.target.appendChild(style);

    style.innerHTML = `
      .${classId} {
        grid-area: ${merge1.r} / ${merge1.c} / ${r2} / ${c2};
      }
    `;

    console.log(style.innerHTML)
  }



</script>

<template>
  <div 
    class="layout"
  >
    <template
      v-for="r of props.rowNum"
    >
      <div 
        v-for="c of props.colNum" 
        class="layout__box"
        @mousedown="setRowColStart($event, r, c)"
        @mouseup="setRowColEnd($event, r, r+1, c, c+1)"
        :class="`ga${r}${c}`"
      ></div>
      
    </template>
  </div>
</template>

<style lang="scss" scoped>

  .layout {
    display: grid;
    grid-template-columns: repeat(v-bind('props.colNum'), auto) ;
    grid-template-rows: repeat(v-bind('props.rowNum'), auto) ;
    justify-items:center;
    padding:.2rem;
    gap: 0.2rem;

    &__box {
      background-color: #e7feff;
      border: 2px dashed #4286f4;
      height:auto;
      min-height: 50px;
      width:100%;
      display: grid;
      padding: .2rem;
      grid-auto-flow: column;
    }
  }


</style>