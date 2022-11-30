<script setup>
  import { ref, onMounted, createApp, computed } from 'vue';
  import {MDCList} from "@material/list";
  import {MDCDrawer} from "@material/drawer";
  import {MDCTopAppBar} from '@material/top-app-bar';
  import {MDCRipple} from '@material/ripple';
  import Button from '@/components/Button.vue'
  import Grid from '@/views/Grid.vue'
  import Box from '@/components/Box.vue'
  import { dragComponent } from '@/store';

  onMounted( () => {
    const iconButtonRipple = new MDCRipple(document.querySelector('.mdc-icon-button'));
    iconButtonRipple.unbounded = true;
    const list = MDCList.attachTo(document.querySelector('.mdc-deprecated-list'));
    list.wrapFocus = true;
    const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
    const topAppBarElement = document.querySelector('.mdc-top-app-bar');
    const topAppBar = new MDCTopAppBar(topAppBarElement);

    topAppBar.setScrollTarget(document.getElementById('main-content'));
    topAppBar.listen('MDCTopAppBar:nav', () => {
      drawer.open = !drawer.open;
    });

  })

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
  <aside class="mdc-drawer mdc-drawer--dismissible">
    <div class="mdc-drawer__content">
      <div class="mdc-deprecated-list">
        <a class="mdc-deprecated-list-item mdc-deprecated-list-item--activated" href="#" aria-current="page"
          draggable
          @dragstart="onDrag($event, Grid)"
        >
          <span class="mdc-deprecated-list-item__ripple"></span>
          <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">grid_on</i>
          <span class="mdc-deprecated-list-item__text">Grid</span>
        </a>
        <a class="mdc-deprecated-list-item" href="#"
          draggable
          @dragstart="onDrag($event, Box)"
        >
          <span class="mdc-deprecated-list-item__ripple"></span>
          <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">check_box_outline_blank</i>
          <span class="mdc-deprecated-list-item__text">Box</span>
        </a>
        <a class="mdc-deprecated-list-item" href="#"
          draggable
          @dragstart="onDrag($event, Button)"
        >
          <span class="mdc-deprecated-list-item__ripple"></span>
          <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">smart_button</i>
          <span class="mdc-deprecated-list-item__text">Button</span>
        </a>
      </div>
    </div>
  </aside>

  <div class="mdc-drawer-app-content">
    <header class="mdc-top-app-bar app-bar mdc-elevation--z6" id="app-bar" >
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button">menu</button>
          <span class="mdc-top-app-bar__title">Drag & Drop</span>
        </section>
      </div>
    </header>

    <main class="main-content" id="main-content">
      <div class="mdc-top-app-bar--fixed-adjust">
        <div class="canvas"
          @drop="onDrop($event)"
          @dragover.prevent
          >
          Drop here 1
        </div>
      </div>
    </main>
  </div>


</template>

<style lang="scss" scoped>

   .mdc-top-app-bar--fixed-adjust {
    padding:4.5rem .5rem .5rem .5rem;
   }

  .canvas {
    background-color: white;
    padding:1rem;
    height: auto;
  }


</style>