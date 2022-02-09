<script setup>

  import Text2 from '@/components/Text2.vue';
  import { useStore } from 'vuex';
  import useSite  from '@/use/useSite';

  const store = useStore();
  const site = useSite();

  const changeVal = () => {
    site.set({
      b: 2
    })
  }


</script>
<template>
  <div style="resize:both; overflow:auto;border:3px solid red;width:300px; height:100px" >
    <button @click="changeVal()">click Text?? </button>
    {{store.state.site.drag_component}}
  </div>

</template>
