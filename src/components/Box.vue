<script setup>
  //import { defineProps } from 'vue';
  import { ref, onMounted, createApp } from 'vue';
  import Text from '@/components/Text.vue'


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
      default: '300px'
    },
    height: {
     type: String,
      default: '300px'
    }
  })

  const root = ref('');

  onMounted(() => {
    //console.log('root value', root.value)
  })



  let data = '';

  const onDrop = (e) => {
   //e.dataTransfer.getData("text");
   // console.log('drop', e);
   // console.log('data here', data);
   // console.log('wrapper', wrapper)
    const app = createApp(data)
    const wrapper = document.createElement("div")
    app.mount(wrapper)
    e.target.appendChild(wrapper);
  };

  const onDrag = (e, t) => {
    data = t;
  }


</script>

<template>
  <div 
    class="box" 
    :style="{ justifyItems: props.justifyItems, alignItems: props.alignItems }">
    <div 
      draggable
      @dragstart="onDrag($event, Text)"
      class="box__size" 
      :style="{ width: props.width, height: props.height }"> 
        resize me??
      <Text/>
    </div>
  </div>

  <div style="border:3px solid red;width:600px; height:600px" 
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