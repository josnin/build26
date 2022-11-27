<script setup>
  import { ref, onMounted, createApp, computed } from 'vue';
  import Button from '@/components/Button.vue'
  import Grid from '@/views/Grid.vue'
  import Box from '@/components/Box.vue'
  import { dragComponent } from '@/store';

  const onDrop = (e) => {
    const app = createApp(dragComponent.value);
    const el = document.createElement("div")
    el.dataset.b26 = (+new Date).toString(36);
    app.mount(el)
    e.target.appendChild(el);


  };

  const onDrag = (e, t) => {
    dragComponent.value = t;
  }

  const unMerge = () => {
    document.querySelectorAll('.layout__box').forEach(
      e => { 
        console.log(e.classList.remove(classId.value)) 
      }
    )
  }

</script>

<template>
  <div class="container">
    <div class="sidebar">

      <!-- Layout -->
      <div
        draggable
        @dragstart="onDrag($event, Grid)"
        class="menu" 
        >
        Grid
      </div>
      <!-- Layout -->

      <!--Button-->
      <div 
        draggable
        @dragstart="onDrag($event, Button)"
        class="menu" 
        >
        Button
      </div>
      <!--Button-->

      <!--Box-->
      <div 
        draggable
        @dragstart="onDrag($event, Box)"
        class="menu" 
        >
        Box
      </div>
      <!--Box-->

      <!--Merge Grid-->
      <div 
        class="menu" 
        >
        Merge
      </div>
      <!--Merge Grid-->

      <!--Unmerge Grid-->
      <div 
        class="menu" 
        @click="unMerge()"
        >
        UnMerge
      </div>
      <!--Unmerge Grid-->
    </div>

    <div class="canvas"
      @drop="onDrop($event)"
      @dragover.prevent
      >
      Drop here
    </div>


  </div>

</template>

<style lang="scss" scoped>

  .container {
    display: grid;
    grid-template-columns: 50px auto;
    height:90vh;
    gap: 1rem;
  }

  .sidebar {
    grid-column : 1;
  }

  .canvas {
    grid-column: 2;
    border:2px solid red;
    width:100%;
    padding:1rem;
  }

  .menu {
    border:1px solid #CCC;
    width:100%
  }


</style>