<script setup>
  import { computed, onMounted, ref } from 'vue';
  import useGrid  from '@/use/useGrid';
  import store from '@/store';
  
  const defaultGridCell = ref([]);
  const mergedCells = ref([]);
  const grid = useGrid();

  const props = defineProps({
    colNum: {
      type: Number,
      default: 2
    },
    rowNum: {
      type: Number,
      default: 5
    },
  });

  const currentRowStart = computed( () =>  store.state.grid.grid.rowStart);
  const currentColStart = computed( () => store.state.grid.grid.colStart);
  const currentRowEnd = computed( () =>  store.state.grid.grid.rowEnd);
  const currentColEnd = computed( () => store.state.grid.grid.colEnd);
  const currentClassId = computed( () => store.state.grid.grid.classId);
  const selectedGridCell = computed( () => defaultGridCell.value.filter(e => e.selected == true) );

  // @todo move to utils?
  const range = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);

  onMounted(() => {
    genDefaultGridCell()
  })

  const genDefaultGridCell = () => {
    const classId =  (+new Date).toString(36);
    const rowNumbers = range(1, props.rowNum);
    const colNumbers = range(1, props.colNum);
    rowNumbers.forEach(r => {
      colNumbers.forEach(c => {
        defaultGridCell.value.push({
          class: classId,
          rowStart: r,
          colStart: c,
          rowEnd: r + 1,
          colEnd: c + 1,
          selected: false,
          merged: false,
          mergedId: null
        })
      })
    })

  }

  const setRowColStart = (rowStart, colStart) => {
    console.log(rowStart, colStart)
    grid.setGrid({
        rowStart,
        colStart,
        classId: (+new Date).toString(36)
    })
  }


  const clearActiveSelection = () => {
    // clear active selection
    selectedGridCell.value.map(
      e => {
        e.selected = false;
      }
    )
  }

  const highlightSelectedCells = (rowStart, colStart) => {
    const rowNumbers = range(currentRowStart.value, rowStart);
    const colNumbers = range(currentColStart.value, colStart);

    clearActiveSelection();

    // highlight selected value
    rowNumbers.forEach(r => {
      colNumbers.forEach(c => {
        defaultGridCell.value.filter(e => e.rowStart === r && e.colStart === c).map(
          e => e.selected = true
        )
      })
    })

  }

  const mergeCell = () => {

    //const rowEnd = selectedGridCell.value.reduce((a,b)=>defaultGridCell.value.rowEnd>b.rowEnd?a:b).rowEnd
    //const colEnd = selectedGridCell.value.reduce((a,b)=>defaultGridCell.value.colEnd>b.colEnd?a:b).colEnd

    selectedGridCell.value.map(e => {
      e.merged = true;
      e.selected = false;
      e.mergedId = currentClassId.value;
    });

    mergedCells.value.push(
      { 
        mergedId: currentClassId.value, 
        gridArea: `${currentRowStart.value} / ${currentColStart.value} / ${currentRowEnd.value} / ${currentColEnd.value}`,
        justifyItems: 'center',
        alignItems: 'center',
        height: '100%'
      }
    )

  }

  const setRowColEnd = (rowStart, rowEnd, colStart, colEnd) => {
    grid.setGrid({
      rowEnd,
      colEnd
    })
    highlightSelectedCells(rowStart, colStart);
    mergeCell();
  }





</script>

<template>
  <div 
    class="layout"
  >

    <!-- default grid cells -->
    <template
      v-for="g of defaultGridCell"
    >
      <div
        class="layout__box"
        :class="{ selected: g.selected }"
        @mousedown="setRowColStart(g.rowStart, g.colStart)"
        @mouseup="setRowColEnd(g.rowStart, g.rowEnd, g.colStart, g.colEnd)"
        v-if="g.merged==false"
      >
      {{g}}
      </div>
    </template>
    <!-- default grid cells -->

    <!-- display merged cells -->
    <template
      v-for="merged of mergedCells"
    >
      <div
        class="layout__box"
        :class="merged.mergedId"
      >
      {{merged}}
      </div>
    </template>
    <!-- display merged cells -->

    <!-- generate style -->
    <component is="style">
      <template v-for="style of mergedCells">
        .{{style.mergedId}} {
          grid-area: {{style.gridArea}};
          justify-items: {{style.justifyItems}};
          align-items: {{style.alignItems}};
          height: {{style.height}};
        }

      </template>
    </component>
    <!-- generate style -->

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

  .selected {
    background-color: red;
  }


</style>