<template>
  <div id="app-shell">
    <SiteHeader />
    <main>
      <RouterView />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup>
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';
</script>

<style scoped>
#app-shell { min-height:100vh; display:flex; flex-direction:column; }
main { flex:1; }
</style>
