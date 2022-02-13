<script setup>

  import { useStore } from 'vuex';
  import useSite  from '@/use/useSite';

  const store = useStore();
  const site = useSite();


</script>
<template>
  <div class="txt">
    Hello World!
  </div>

</template>

<style lang="scss"  scoped>

  .txt {
    width:100%;
    height: 100%;
  }

  .btn {
    resize:both;
    overflow:auto;
    border:1px solid #eee;
    width:inherit;
    height: fit-content;
  }

  .btn:hover {
    border: 2px solid #4286f4;
  }
</style>
