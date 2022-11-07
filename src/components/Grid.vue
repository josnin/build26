<script setup>
  import { computed, onMounted, ref } from 'vue';
  import useGrid  from '@/use/useGrid';
  import store from '@/store';
  
  const defaultGridCell = ref([]);
  const mergedCells = ref([]);
  const grid = useGrid();

  const isSelected = ref(false);

  // start & end cells selection
  const isStarted = ref(true)
  const isEnded = ref(false)

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
    //const classId =  (+new Date).toString(36);
    const rowNumbers = range(1, props.rowNum);
    const colNumbers = range(1, props.colNum);
    rowNumbers.forEach(r => {
      colNumbers.forEach(c => {
        defaultGridCell.value.push({
          class: `gc-${r}${c}`,
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



  const setRowColStart = (...args) => {
    const [rowStart, colStart] = args;
    console.log(rowStart, colStart)
    grid.setGrid({
        rowStart,
        colStart,
        classId: (+new Date).toString(36)
    })
    displayEndBtn();
  }


  const clearActiveSelection = () => {
    // clear active selection
    defaultGridCell.value.map(
      e => {
        e.selected = false;
      }
    )
  }

  const getRowNums = (rowStart) => {
      // range is broken when start value is greater than end value
      return currentRowStart.value > rowStart ? range(rowStart, currentColStart.value) : range(currentRowStart.value, rowStart);
  }

  const getColNums = (colStart) => {
      // range is broken when start value is greater than end value
      return currentColStart.value > colStart ? range(colStart, currentColStart.value) : range(currentColStart.value, colStart);
  }

  const setGridSelection = (rowNums, colNums) => {
      // highlight selected value
      rowNums.forEach(r => {
        colNums.forEach(c => {
          defaultGridCell.value.filter(e => e.rowStart === r && e.colStart === c).map(
            e => e.selected = true
          )
        })
      })
  }

  const highlightSelectedCells = (...args) => {
    if (isSelected.value) {
      const [rowStart, colStart] = args;

      const rowNums = getRowNums(rowStart)
      const colNums = getColNums(colStart)

      clearActiveSelection();
      setGridSelection(rowNums, colNums)

    }
  }

  const getGridArea = (selectedGridCell) => {
    const rowStart = selectedGridCell.value.reduce(
        (previousVal, currentVal) => 
          previousVal.rowStart > currentVal.rowStart ? currentVal : previousVal 
      ).rowStart
    const colStart = selectedGridCell.value.reduce(
        (previousVal, currentVal) => 
          previousVal.colStart > currentVal.colStart ? currentVal : previousVal 
      ).colStart
    const rowEnd = selectedGridCell.value.reduce(
        (previousVal, currentVal) => 
          previousVal.rowEnd > currentVal.rowEnd ? previousVal : currentVal
      ).rowEnd
    const colEnd = selectedGridCell.value.reduce(
        (previousVal, currentVal) => 
          previousVal.colEnd > currentVal.colEnd ? previousVal : currentVal
      ).colEnd

    //console.log(`${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}`);

    return `${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}`;

  }

  const unSelectGridSelection = () => {
    // this will unselect grid in the defaultGridCell
    selectedGridCell.value.map(e => {
      e.merged = true;
      e.selected = false;
      e.mergedId = currentClassId.value;
    });

  }

  const mergeCell = () => {

    const gridArea = getGridArea(selectedGridCell);
    unSelectGridSelection()

    mergedCells.value.push(
      { 
        mergedId: currentClassId.value, 
        gridArea,
        justifyItems: 'center',
        alignItems: 'center',
        height: '100%'
      }
    )

  }

  const displayStartBtn = () => {
    isStarted.value = true;
    isEnded.value = false;
  }

  const displayEndBtn = () => {
    isStarted.value = false;
    isEnded.value = true;
  }

  const setRowColEnd = (...args) => {
    const [rowStart, rowEnd, colStart, colEnd] = args;
    grid.setGrid({
      rowEnd,
      colEnd
    })
    mergeCell();
    displayStartBtn();
  }

  const unMerge = (...args) => {
    const [mergedId] = args;
    mergedCells.value = mergedCells.value.filter(e => e.mergedId != mergedId);
    defaultGridCell.value.filter(e => e.mergedId === mergedId).map(e => {
      e.merged = false;
      //e.selected = true;
      e.mergedId = null;
    });
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
        :class="[{ selected: g.selected  }, g.class]"
        v-if="g.merged==false"
        @mouseover="highlightSelectedCells(g.rowStart, g.colStart)" 
      >
         {{g}} {{isStarted}} {{g.selected}} 
        <button 
          v-if="isStarted" 
          @click="setRowColStart(g.rowStart, g.colStart); isSelected=true">
          Start <!-- start selection -->
        </button>
        <button 
          v-if="isEnded" 
          @click="setRowColEnd(g.rowStart, g.rowEnd, g.colStart, g.colEnd); isSelected=false">
          End  <!--end selection -->
        </button>
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
        <button 
          @click="unMerge(merged.mergedId)">
          Un Merge?
        </button>
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
    grid-template-columns: repeat(v-bind('props.colNum'), 1fr) ;
    grid-template-rows: repeat(v-bind('props.rowNum'), 1fr) ;
    justify-items:center;
    align-items:center;
    padding:.2rem;
    height:100%;
    //gap: .1rem;

    &__box {
      border:1px dotted rgb(26, 115, 232);
      height:100%;
      min-height: 50px;
      width:100%;
      display: grid;
      justify-items: center;
      align-items:center;
      padding: .2rem;
      grid-auto-flow: row;
    }

  }

  .selected {
    border:1px solid rgb(26, 115, 232);
  }


</style>