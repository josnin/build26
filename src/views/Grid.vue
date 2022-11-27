<script setup>
  import { computed, onMounted, ref } from 'vue';
  import GridDefault from '@/components/GridDefault.vue'
  import GridMergedCells from '@/components/GridMergedCells.vue'
  import { 
    refId, 
    gColNum, 
    gRowNum, 
    isSelected, 
    isStarted,
    isEnded,
    mergedCells, 
    currentRowStart,
    currentColStart,
    currentClassId,
    defaultGridCell }  from '@/store'
  
  const gridTemplateColumns = ref(null)
  const gridPage = ref();

  // start & end resize heigh / width
  const isResize = ref(false)
  const resizeColNum = ref(0);

  const selectedGridCell = computed( () => defaultGridCell.value.filter(e => e.selected === true) );

  // @todo move to utils?
  const range = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);

  onMounted(() => {
    genDefaultGridCell();
    getGridTemplateColumns();
  })

  const genDefaultGridCell = () => {
    // @todo move to store
    const rowNumbers = range(1, gRowNum.value);
    const colNumbers = range(1, gColNum.value);
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
    console.log(selectedGridCell.value)
    selectedGridCell.value.map(e => {
      e.merged = true;
      e.selected = false;
      e.mergedId = currentClassId.value;
    });
    console.log(selectedGridCell.value)

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
    gridTemplateColumns.value = Array(gColNum.value).fill('1fr').join(' ');
  }

  const startColGridResize = (colNum) => {
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
      const colNums = range(1, gColNum.value);
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

    <GridDefault 
      @highlightcells="highlightSelectedCells" 
      @startcolresize="startColGridResize" 
      @oncolresize="onColGridResize" 
      @endcolresize="endColGridResize"
      @setrowcolstart="setRowColStart"
      @setrowcolend="setRowColEnd"
    />

    <GridMergedCells
      @unmerge="unMerge"
    />

  </div>
</template>

<style lang="scss" >


  .grid-page {
    display: grid;
    grid-template-columns: v-bind('gridTemplateColumns'); 
    grid-template-rows: repeat(v-bind('gRowNum'), 1fr) ;
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


</style>