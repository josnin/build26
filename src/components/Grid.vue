<script setup>
  import { computed, onMounted, ref } from 'vue';
  import useGrid  from '@/use/useGrid';
  import store from '@/store';
  
  const gridCell = ref([]);
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

  const rowStart = computed( () =>  store.state.grid.grid.rowStart);
  const colStart = computed( () => store.state.grid.grid.colStart);
  const currentClassId = computed( () => store.state.grid.grid.classId);
  const selectedGridCell = computed( () => gridCell.value.filter(e => e.selected == true) );

  // @todo move to utils?
  const range = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);

  onMounted(() => {
    generateGridCell()
  })

  const generateGridCell = () => {
    const classId =  `b26-${(+new Date).toString(36)}`;
    const rowNumbers = range(1, props.rowNum);
    const colNumbers = range(1, props.colNum);
    rowNumbers.forEach(r => {
      colNumbers.forEach(c => {
        gridCell.value.push({
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
        //e.merged = true;
        e.selected = false;
      }
    )
  }

  const highlightSelectedCells = (argRowStart, argColStart) => {
    const rowNumbers = range(rowStart.value, argRowStart);
    const colNumbers = range(colStart.value, argColStart);

    clearActiveSelection();

    // highlight selected value
    rowNumbers.forEach(r => {
      colNumbers.forEach(c => {
        gridCell.value.filter(e => e.rowStart === r && e.colStart === c).map(
          e => e.selected = true
        )
      })
    })

  }

  const mergeCell = () => {

    const rowEnd = selectedGridCell.value.reduce((a,b)=>gridCell.value.rowEnd>b.rowEnd?a:b).rowEnd
    const colEnd = selectedGridCell.value.reduce((a,b)=>gridCell.value.colEnd>b.colEnd?a:b).colEnd

    selectedGridCell.value.map(e => {
      e.merged = true;
      e.mergedId = currentClassId.value;
    });

    mergedCells.value.push(
      { mergedId: currentClassId.value, gridArea: `${rowStart.value} / ${colStart.value} / ${rowEnd} / ${colEnd}`}
    )

    clearActiveSelection();

  }

  const setRowColEnd = (row1, row2, col1, col2) => {
    highlightSelectedCells(row1, col1);
    mergeCell();
  }





</script>

<template>
  <div 
    class="layout"
  >

    <!-- default grid cells -->
    <template
      v-for="g of gridCell"
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
      v-for="mc of mergedCells"
    >
      <div
        class="layout__box"
        :class="`mergedId-${mc.mergedId}`"
      >

      {{mc}}

      </div>
      <!-- display merged cells -->


    </template>

    <!-- generate style -->
    <component is="style">
      <template v-for="mc of mergedCells">
        .mergedId-{{mc.mergedId}} {
          grid-area: {{mc.gridArea}};
          justify-items: center;
          align-items: center;
          height: 100%;
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