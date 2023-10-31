<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

const sendMessage = () => {
  ElMessage.success('Element-plus component import as on-demand success')
}
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
