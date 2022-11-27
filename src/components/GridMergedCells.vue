<script setup>
    import { mergedCells } from '@/store';
    const emit = defineEmits(['unmerge'])
</script>
<template>

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
          @click="$emit('unmerge', merged.mergedId)">
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
</template>