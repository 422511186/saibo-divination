<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<style scoped>
.app {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #0c0c14 0%, #141428 100%);
  color: #00f0ff;
  min-height: 100vh;
}
</style>
