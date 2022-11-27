
<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { refId }  from '@/store'

  const props = defineProps({
    defaultCells: {
        type: Object,
        default(rawProps) {
            return [];
        }
    },
    isStarted: {
        type: Boolean,
        default: false
    },
    isEnded: {
        type: Boolean,
        default: false
    },
    isSelected: {
        type: Boolean,
        default: false
    }
  });

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
  <div
    v-for="g of defaultCells"
    class="grid-page__box">
      <div
        :class="[{ selected: g.selected  }, g.class]"
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
  </div>
</template>
<!-- default grid cells -->

