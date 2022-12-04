
<script setup>
  import { 
    refId, 
    isSelected, 
    isStarted,
    isEnded,
    gColNum,
    gRowNum,
    defaultGridCell }  from '@/store'

  const emit = defineEmits([
    'highlightcells', 
    'oncolresize', 
    'startcolresize', 
    'endcolresize',
    'setrowcolstart',
    'setrowcolend',
    'onrowresize', 
    'startrowresize', 
    'endrowresize',
])

const displayColResize = (col) => {
  return col != gColNum.value
}

const displayRowResize = (row) => {
  return row != gRowNum.value
}

</script>

<!-- default grid cells -->
<template>

  <template
    v-for="g of defaultGridCell"
    >
      <div
        :class="['grid-page__box', { selected: g.selected  }, g.class]"
        v-if="g.merged==false"
        :ref="(el) => refId[g.class] = el"
        @mouseover="$emit('highlightcells', g.rowStart, g.colStart)" 
        @mousemove.prevent="$emit('oncolresize', $event);$emit('onrowresize', $event)" 
        @mouseup.prevent="$emit('endcolresize'); $emit('endrowresize')"
       >
        {{g}}
        <button 
          v-if="isStarted" 
          @click="$emit('setrowcolstart', g.rowStart, g.colStart); isSelected=true">
          Start <!-- start selection -->
        </button>
        <button 
          v-if="isEnded" 
          @click="$emit('setrowcolend', g.rowStart, g.rowEnd, g.colStart, g.colEnd); isSelected=false">
          End  <!--end selection -->
        </button>
        <span 
            v-if="displayColResize(g.colStart)"
            @mousedown="$emit('startcolresize', g.colStart)" 
            class="edit-grid-width" 
            title="Ëdit Grid Width"
        ><!--edit grid width --></span>
        <span 
            v-if="displayRowResize(g.rowStart)"
            @mousedown="$emit('startrowresize', g.rowStart)" 
            class="edit-grid-height" 
            title="Ëdit Grid Height">
        <!--edit grid height --></span>
    </div>
  </template>
</template>
<!-- default grid cells -->


<style lang="scss" scoped>


  .selected {
    border:1px solid rgb(26, 115, 232);
  }

  .drag-handler-circle {
    border: 1px solid rgb(26, 115, 232);
    pointer-events: auto;
    background: white; 
    position: absolute;
    border-radius: 50%;
    z-index: 1000;
    opacity: 0.6;
    width:5px;
    height:5px;
  }

  .edit-grid-height {
    @extend .drag-handler-circle;
    cursor: row-resize;
    left: 45%;
    top: 99%;
  }

  .edit-grid-width {
    @extend .drag-handler-circle;
    cursor: col-resize;
    left: 99.6%;
    top: 50%;
  }


</style>