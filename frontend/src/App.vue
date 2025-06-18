<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import navbar from './components/navbar.vue';
import HomeView from './views/HomeView.vue';
</script>

<template>
  <div id="app">
    <navbar></navbar>
    <router-view></router-view>
  </div>
</template>