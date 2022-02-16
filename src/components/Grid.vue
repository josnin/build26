<script setup>
  import { computed } from 'vue';
  import useGrid  from '@/use/useGrid';
  import store from '@/store';

  const grid = useGrid();
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

  const rowStart = computed( () =>  store.state.grid.grid.rowStart);
  const colStart = computed( () => store.state.grid.grid.colStart);
  const classId = computed( () => store.state.grid.grid.classId);

  // @todo move to utils?
  const range = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);


  const setRowColStart = (e, r, c) => {
    grid.setGrid({
      rowStart: r,
      colStart: c,
      classId: (+new Date).toString(36)
    })
  }

  const highlightMergedCells = (e) => {
    e.target.style.backgroundColor = '#e7feff';
    e.target.style.border = 'thin solid #4286f4';
  }

  const addElementClass = (r1, c1) => {

    const rowNumbers = range(rowStart.value, r1);
    const colNumbers = range(colStart.value, c1);

    rowNumbers.forEach(r2 => {
      colNumbers.forEach(c2 => {
        document.querySelector(`.ga${r2}${c2}`).classList.add(classId.value)
      })
    })

  }

  const updateGridArea = (e, r2, c2) => {
    const style = document.createElement('style');
    e.target.appendChild(style);
    style.innerHTML = `
      .${classId.value} {
        grid-area: ${rowStart.value} / ${colStart.value} / ${r2} / ${c2};
      }
    `;

  };

  const setRowColEnd = (e, r1, r2, c1, c2) => {
    addElementClass(r1, c2);
    updateGridArea(e, r2, c2);
    highlightMergedCells(e);
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

    &__box {
      //background-color: #e7feff;
      border: 1px dashed gray;
      height:auto;
      min-height: 50px;
      width:100%;
      display: grid;
      padding: .2rem;
      grid-auto-flow: column;
    }

    &__box:hover {
      cursor:grab;
    }
  }


</style>