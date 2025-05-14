<template>
  <div class="min-h-screen flex items-center justify-center bg-black" @mousemove="handleMouseMove">
    <AlienClock :mouseX="mouseX" :mouseY="mouseY" />
  </div>
</template>

<script>
import AlienClock from './components/AlienClock.vue';

export default {
  components: { AlienClock },
  data() {
    return {
      mouseX: 0,
      mouseY: 0
    };
  },
  methods: {
    handleMouseMove(event) {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    }
  }
};
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
</style>