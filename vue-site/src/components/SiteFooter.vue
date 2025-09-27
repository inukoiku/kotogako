<template>
  <footer class="mt-auto mt-5 footer-dark border-top border-secondary py-4">
    <div class="container d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
      <div class="small mb-2 mb-sm-0">&copy; {{ year }} 犬神高度育造高等學校</div>
      <div class="d-flex align-items-center gap-4 small footer-links">
        <a href="https://www.facebook.com/profile.php?id=61560013116714" target="_blank" rel="noopener" aria-label="Facebook" class="text-decoration-none">Facebook</a>
        <a href="https://line.me/R/ti/p/@950wjjeb" target="_blank" rel="noopener" aria-label="LINE" class="text-decoration-none">Line</a>
        <a href="https://www.instagram.com/inukoiku.tw/" target="_blank" rel="noopener" aria-label="IG" class="text-decoration-none">IG</a>

      </div>
    </div>
  </footer>
</template>
<script setup>
const year = new Date().getFullYear();
</script>
<style scoped>
.footer-dark { background: var(--brand-bg-dark); color:#d7d7d7; }
.footer-links .nav-link { color:#d7d7d7; }
.footer-links .nav-link.router-link-active, .footer-links .nav-link:hover { color: var(--brand-accent); }
.footer-links a { color:#d7d7d7; }
.footer-links a:hover { color: var(--brand-accent); }
</style>
