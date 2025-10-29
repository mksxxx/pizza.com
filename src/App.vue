<script setup>
import { useRoute } from 'vue-router';

const router = useRoute()
</script>


<template>
  <component :is="router.meta.layout">
  <router-view />
  </component>
</template>