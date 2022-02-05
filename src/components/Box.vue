<script setup>
  //import { defineProps } from 'vue';
  import { ref, onMounted } from 'vue';

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
    console.log('root value', root.value)
  })


  const onDrop = (e) => {
    const data = e.dataTransfer.getData("text");
    console.log('drop', e);
    console.log('data here', data);
    e.target.appendChild(root.value);
  };

  const onDrag = (e) => {
    //e.dataTransfer.setData("text", e.target.id);
    console.log('onDrag', root.value)
  }


  console.log(`im  box ${props.width} ${props.height}`)
</script>

<template>
  <div 
    ref="root"
    class="box" 
    :style="{ justifyItems: props.justifyItems, alignItems: props.alignItems }">
    <div 
      draggable
      @dragstart="onDrag($event)"
      class="box__size" 
      :style="{ width: props.width, height: props.height }"> 
        resize me??
    </div>
  </div>

  <div style="border:3px solid red;width:600px; height:600px" 
    ref="root2"
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