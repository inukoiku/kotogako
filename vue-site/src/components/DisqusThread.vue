<template>
  <div id="disqus_thread"></div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  shortname: { type: String, required: true },
  identifier: { type: String, required: true },
  url: { type: String, required: true },
  title: { type: String, default: '' }
});

const SCRIPT_ID = 'disqus-embed-script';

function setConfig() {
  window.disqus_config = function () {
    this.page.url = props.url;
    this.page.identifier = props.identifier;
    if (props.title) this.page.title = props.title;
  };
}

function loadDisqus() {
  setConfig();

  if (window.DISQUS) {
    window.DISQUS.reset({
      reload: true,
      config: window.disqus_config
    });
    return;
  }

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = `https://${props.shortname}.disqus.com/embed.js`;
  script.setAttribute('data-timestamp', String(+new Date()));
  script.async = true;
  document.body.appendChild(script);
}

onMounted(loadDisqus);

watch(() => [props.identifier, props.url], loadDisqus);

onUnmounted(() => {
  const el = document.getElementById('disqus_thread');
  if (el) el.innerHTML = '';
});
</script>
