<script setup>
  import { ref, onMounted, createApp, computed } from 'vue';
  import Button from '@/components/Button.vue'
  import Grid from '@/components/Grid.vue'
  import Box from '@/components/Box.vue'
  import useSite  from '@/use/useSite';
  import store from '@/store';

  import { useStore } from 'vuex';

  const site = useSite();
  const store1 = useStore();

  const onDrop = (e) => {
    const app = createApp(store1.state.site.drag_component);
    const el = document.createElement("div")
    el.dataset.b26 = (+new Date).toString(36);
    app.use(store).mount(el)
    e.target.appendChild(el);


    //document.querySelectorAll('[data-b26]').forEach(el2 => { 
    //  console.log(el2.dataset.b26);
    //  console.log(el2.getBoundingClientRect().y);
    //})

  };

  const onDrag = (e, t) => {
    site.setDragComponent(t) ;
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