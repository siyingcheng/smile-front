<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <div>
    <NavBar />
    <router-view></router-view>
  </div>
</template>

<style>
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

body {
  padding: 0px;
  margin: 0px;
  height: 100%;
  width: 100%;
}
</style>
