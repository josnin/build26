<script setup>




</script>
<template>
  <div 
    class="btn">
    <button>Click Me</button>
  </div>

</template>

<style lang="scss"  scoped>

  button {
    width:100%;
    height: 100%;
  }

  .btn {
    margin: .2rem;
    resize:both;
    overflow:auto;
    width:inherit;
    height: fit-content;
  }

  .btn:hover {
    border: 2px dashed #4286f4;
  }
</style>
