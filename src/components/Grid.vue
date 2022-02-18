<script setup>
  import { computed, onMounted, ref } from 'vue';
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

  const root = ref(null);
  const rowStart = computed( () =>  store.state.grid.grid.rowStart);
  const colStart = computed( () => store.state.grid.grid.colStart);
  const classId = computed( () => store.state.grid.grid.classId);
  const dataset = computed( () => store.state.grid.grid.dataset);

  // @todo move to utils?
  const range = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);

  onMounted(() => {
    getDataset();
  })

  const getDataset = () => {
    for (const [key, value] of Object.entries(root.value.dataset)) {
      grid.setGrid({
          dataset: key
        })
    }
  }

  const setRowColStart = (e, row1, col1) => {
    grid.setGrid({
        rowStart: row1,
        colStart: col1,
        classId: (+new Date).toString(36)
    })
  }

  const highlightMergedCells = (e) => {
    e.target.style.backgroundColor = '#e7feff';
    e.target.style.border = 'thin solid #4286f4';
  }


  const highlightCells2Merge = (row1, col1) => {
    const rowNumbers = range(rowStart.value, row1);
    const colNumbers = range(colStart.value, col1);

    rowNumbers.forEach(r => {
      colNumbers.forEach(c => {
        document.querySelector(
          `.ga${r}${c}`
        ).style.backgroundColor = '#e7feff';
      })
    })
  }

  const addElementClass = (row1, col1) => {

    const rowNumbers = range(rowStart.value, row1);
    const colNumbers = range(colStart.value, col1);

    rowNumbers.forEach(r => {
      colNumbers.forEach(c => {
        document.querySelector(`.ga${r}${c}`).classList.add(classId.value)
      })
    })

  }

  const updateGridArea = (e, row2, col2) => {
    const style = document.createElement('style');
    e.target.parentElement.appendChild(style);
    style.innerHTML = `
      .${classId.value}[data-${dataset.value}] {
        grid-area: ${rowStart.value} / ${colStart.value} / ${row2} / ${col2};
        justify-items: center;
        align-items: center;
        height: 100%;
      }
    `;

  };

  const setRowColEnd = (e, row1, row2, col1, col2) => {
    //highlightCells2Merge(row1, col1);
    addElementClass(row1, col1);
    updateGridArea(e, row2, col2);
  }



</script>

<template>
  <div 
    class="layout"
    ref="root"
  >
    <template
      v-for="row1 of props.rowNum"
    >
      <div 
        v-for="col1 of props.colNum" 
        class="layout__box"
        @mousedown="setRowColStart($event, row1, col1)"
        @mouseup="setRowColEnd($event, row1, row1 + 1, col1, col1 + 1)"
        :class="`ga${row1}${col1}`"
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
    align-items:center;
    padding:.2rem;
    height:100%;
    gap: .2rem;

    &__box {
      //background-color: #e7feff;
      border: 2px dotted purple;
      height:100%;
      min-height: 50px;
      width:100%;
      display: grid;
      justify-items: center;
      align-items:center;
      padding: .2rem;
      grid-auto-flow: column;
    }

    &__box:hover {
      cursor:grab;
    }
  }


</style>