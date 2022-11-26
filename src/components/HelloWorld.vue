<script setup>
import { ref, onMounted } from 'vue'
import useGrid  from '@/use/useGrid';

const grid = useGrid();


const count = ref(0)
  onMounted(() => {
    console.log( grid.testVar.value )
  })
</script>

<template>
  <h1>{{ grid.testVar }}</h1>

</template>
