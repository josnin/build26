<script setup>
  import { computed, onMounted, ref } from 'vue';
  import useGrid  from '@/use/useGrid';
  
  const defaultGridCell = ref([]);
  const mergedCells = ref([]);
  const grid = useGrid();
  const gridTemplateColumns = ref('1fr 1fr')
  const refId = ref([])
  const gridPage = ref();

  const isSelected = ref(false);

  // start & end cells selection
  const isStarted = ref(true)
  const isEnded = ref(false)

  // start & end resize heigh / width
  const isResize = ref(false)
  const resizeColNum = ref(0);

  const props = defineProps({
    colNum: {
      type: Number,
      default: 3
    },
    rowNum: {
      type: Number,
      default: 5
    },
  });

  const currentRowStart = ref(null)
  const currentColStart = ref(null)
  const currentClassId = ref(null)
  const selectedGridCell = computed( () => defaultGridCell.value.filter(e => e.selected == true) );

  // @todo move to utils?
  const range = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);

  onMounted(() => {
    genDefaultGridCell();
    getGridTemplateColumns();
  })

  const genDefaultGridCell = () => {
    // @todo move to store
    const rowNumbers = range(1, props.rowNum);
    const colNumbers = range(1, props.colNum);
    rowNumbers.forEach(r => {
      colNumbers.forEach(c => {
        defaultGridCell.value.push({
          class: `gc${r}${c}`,
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
    currentRowStart.value = rowStart;
    currentColStart.value = colStart
    currentClassId.value = (+new Date).toString(36)
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
    //const [rowStart, rowEnd, colStart, colEnd] = args;
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


  const getGridTemplateColumns = () => {
    gridTemplateColumns.value = Array(props.colNum).fill('1fr').join(' ');
  }

  const startColGridResize = (evt, colNum) => {
    isResize.value = true;
    resizeColNum.value = colNum;
    gridPage.value.style.cursor = 'col-resize'; // horizontal drag
  }

  const endColGridResize = () => {
    isResize.value = false;
    resizeColNum.value = 0;
    gridPage.value.style.cursor = 'auto';
  }

  const getColWidths = () => {
      const colWidths = []; // @todo use store
      const colNums = range(1, props.colNum);
      colNums.forEach( (c, index) => {
        colWidths[index] = refId.value[`gc1${c}`].clientWidth;
      })

      return colWidths;

  }

  const updateGridTemplateColumns = (evt, colWidths) => {
    const colNum = resizeColNum.value;
    let newColWidth = evt.clientX - 89;
    if (colNum > 1) {
      const colRange = [...Array(colNum - 1).keys()];
      colRange.forEach( e => {
        newColWidth -= colWidths[e];
      })
    }

    const newVal = gridTemplateColumns.value.split(' ');
    newVal[colNum - 1] = `${newColWidth}px`
    gridTemplateColumns.value = newVal.join(' '); // `1fr ${leftColWidth}px 1fr`;


  }

  const onColGridResize = (evt) => {
    if (isResize.value) {

      const colWidths = getColWidths(); // @todo use store

      updateGridTemplateColumns(evt, colWidths);


    }

  }

</script>

<template>
  <div 
    class="grid-page"
    ref="gridPage"
  >

    <!-- default grid cells -->
    <template
      v-for="g of defaultGridCell"
    >
      <div
        class="grid-page__box"
        :class="[{ selected: g.selected  }, g.class]"
        v-if="g.merged==false"
        @mouseover="highlightSelectedCells(g.rowStart, g.colStart)" 
        @mousemove.prevent="onColGridResize($event)" 
        @mouseup.prevent="endColGridResize()"
        :ref="(el) => refId[g.class] = el"
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
        <span 
            @mousedown.prevent="startColGridResize($event, g.colStart)" 
            class="edit-grid-width" 
            title="Ëdit Grid Width"
        ><!--edit grid width --></span>
        <span class="edit-grid-height" title="Ëdit Grid Height"><!--edit grid height --></span>
        <span class="edit-gap-row" title="Ëdit Grid Gap row"><!--edit grid gap row--></span>
        <span class="edit-gap-column" title="Ëdit Grid Gap column"><!--edit grid gap column--></span>
      </div>
    </template>
    <!-- default grid cells -->

    <!-- display merged cells -->
    <template
      v-for="merged of mergedCells"
    >
      <div
        class="grid-page__box"
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

  .grid-page {
    display: grid;
    grid-template-columns: v-bind('gridTemplateColumns'); // repeat(v-bind('props.colNum'), 1fr) ;
    grid-template-rows: repeat(v-bind('props.rowNum'), 1fr) ;
    justify-items:center;
    align-items:center;
    //padding:.2rem; -->> @todo this have effect in page clientWidth when resizing
    height:100%;
    //gap: 1rem;

    &__box {
      border:.5px solid rgb(26, 115, 232);
      height:100%;
      min-height: 50px;
      width:100%;
      display: grid;
      justify-items: center;
      align-items:center;
      //padding: .2rem;
      grid-auto-flow: row;
      position: relative;
    }

  }

  .selected {
    border:1px solid rgb(26, 115, 232);
  }

  .drag-handler-circle {
    pointer-events: auto;
    background: white; 
    position: absolute;
    border-radius: 50%;
    z-index: 1000;
    opacity: 0.6;
    width:7px;
    height:7px;
  }

  .edit-grid-height {
    border: 2px solid rgb(26, 115, 232);
    @extend .drag-handler-circle;
    cursor: row-resize;
    left: 45%;
    top: 95%;
    width:7px;
    height:7px;
  }

  .edit-grid-width {
    border: 2px solid rgb(26, 115, 232);
    @extend .drag-handler-circle;
    cursor: col-resize;
    left: 99.6%;
    top: 30%;
    width:7px;
    height:7px;
  }

  .edit-gap-row {
    border: 1px solid rgb(26, 115, 232);
    @extend .drag-handler-circle;
    cursor: row-resize;
    left: 25%;
    top: 97%;
  }

  .edit-gap-column {
    border: 1px solid rgb(26, 115, 232);
    @extend .drag-handler-circle;
    cursor: col-resize;
    left: 99.6%;
    top: 70%;
  }


</style>