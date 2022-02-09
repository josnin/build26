<script setup>
  //import { defineProps } from 'vue';
  import { ref, onMounted, createApp, computed } from 'vue';
  import Text from '@/components/Text.vue'
  import useSite  from '@/use/useSite';
  import store from '@/store';

  import { useStore } from 'vuex';

  const site = useSite();
  const store1 = useStore();
  const dragComponent = computed(() => store1.state.site.drag_component)

  const props = defineProps({
    justifyItems: {
      type: String,
      default: 'center'
    },
    alignItems: {
      type: String,
      default: 'baseline'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
     type: String,
      default: '200px'
    }
  })


  const onDrop = (e) => {
    console.log('data here', store1.state.site.drag_component );
    const app = createApp(store1.state.site.drag_component);
    const wrapper = document.createElement("div")
    app.use(store).mount(wrapper)
    e.target.appendChild(wrapper);
  };


  const onDrag = (e, t) => {
    site.set(t) ;
  }



</script>

<template>
  <div 
    draggable
    @dragstart="onDrag($event, Text)"
    class="box" 
    :style="{ justifyItems: props.justifyItems, alignItems: props.alignItems }">
    <div 
      class="box__size" 
      :style="{ width: props.width, height: props.height }"> 
        resize me??
      <Text/>
    </div>
  </div>

  <div style="border:3px solid red;width:300px; height:300px" 
    @drop="onDrop($event)"
    @dragover.prevent
    >
    Drop here
  </div>


</template>

<style lang="scss" scoped>

  .box {

    display: grid;
    width: 100%;
    box-sizing: border-box;

    &__size {
      border: 2px solid #4286f4;
      resize: both;
      overflow: auto; /* required in order to resize */
    }
  }

</style>