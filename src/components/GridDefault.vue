
<script setup>
  import { 
    refId, 
    isSelected, 
    isStarted,
    isEnded,
    defaultGridCell }  from '@/store'

  const emit = defineEmits([
    'mouseover', 
    'highlightcells', 
    'oncolresize', 
    'startcolresize', 
    'endcolresize',
    'setrowcolstart',
    'setrowcolend',
    'clickme'
])

</script>

<!-- default grid cells -->
<template>
    <!--<button @click="$emit('clickme', '1234')">click me</button>-->
  <template
    v-for="g of defaultGridCell"
    >
      <div
        :class="['grid-page__box', { selected: g.selected  }, g.class]"
        v-if="g.merged==false"
        :ref="(el) => refId[g.class] = el"
        @mouseover="$emit('highlightcells', g.rowStart, g.colStart)" 
        @mousemove.prevent="$emit('oncolresize', $event)" 
        @mouseup.prevent="$emit('endcolresize')"
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
            @mousedown="$emit('startcolresize', g.colStart)" 
            class="edit-grid-width" 
            title="Ëdit Grid Width"
        ><!--edit grid width --></span>
        <span class="edit-grid-height" title="Ëdit Grid Height"><!--edit grid height --></span>
        <span class="edit-gap-row" title="Ëdit Grid Gap row"><!--edit grid gap row--></span>
        <span class="edit-gap-column" title="Ëdit Grid Gap column"><!--edit grid gap column--></span>
    </div>
  </template>
</template>
<!-- default grid cells -->


<style lang="scss" scoped>


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