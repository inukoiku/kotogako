<template>
  <div id="app-shell">
    <template v-if="!isAdminRoute">
      <SiteHeader />
      <main>
        <RouterView />
      </main>
      <SiteFooter />
    </template>
    <template v-else>
      <RouterView />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';

const route = useRoute();
const isAdminRoute = computed(() => route.path.startsWith('/admin'));
</script>

<style scoped>
#app-shell { min-height:100vh; display:flex; flex-direction:column; }
main { flex:1; }
</style>
