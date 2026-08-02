<script setup>
import { onMounted, onUnmounted, watch, computed, ref } from 'vue'
import { useData, useRoute } from 'vitepress'

const { theme, frontmatter } = useData()
const route = useRoute()

const walineContainer = ref(null)
let walineInstance = null
let initFn = null

const serverURL = computed(() => {
  return theme.value.waline?.serverURL || 'https://personal-blog-comments.vercel.app'
})

const showComments = computed(() => {
  return frontmatter.value.layout !== 'home' && frontmatter.value.comments !== false
})

async function initWaline() {
  if (typeof window === 'undefined' || !showComments.value || !serverURL.value) return

  if (!initFn) {
    const walineModule = await import('@waline/client')
    initFn = walineModule.init
  }

  if (walineInstance) {
    walineInstance.update({
      path: route.path
    })
  } else {
    walineInstance = initFn({
      el: '#waline',
      serverURL: serverURL.value,
      path: route.path,
      meta: ['nick', 'mail', 'link'],
      requiredMeta: ['nick'],
      lang: 'en',
      emoji: ['https://cdn.jsdelivr.net/gh/walinejs/emojis/weibo'],
      dark: 'html.dark'
    })
  }
}

onMounted(() => {
  initWaline()
})

watch(() => route.path, () => {
  initWaline()
})

onUnmounted(() => {
  if (walineInstance && typeof walineInstance.destroy === 'function') {
    walineInstance.destroy()
    walineInstance = null
  }
})
</script>

<template>
  <div v-if="showComments" class="waline-container">
    <div id="waline" ref="walineContainer"></div>
  </div>
</template>

<style scoped>
.waline-container {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
