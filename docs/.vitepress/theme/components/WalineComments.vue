<script setup>
import { nextTick, onMounted, onUnmounted, watch, computed, ref } from 'vue'
import { useData, useRoute } from 'vitepress'

const { theme, frontmatter } = useData()
const route = useRoute()

const walineContainer = ref(null)
let walineInstance = null
let initFn = null

const walineOptions = computed(() => ({
  serverURL: 'https://personal-blog-comments.vercel.app',
  meta: ['nick', 'mail', 'link'],
  requiredMeta: ['nick'],
  lang: 'en',
  emoji: ['https://cdn.jsdelivr.net/gh/walinejs/emojis/weibo'],
  wordLimit: 0,
  pageSize: 10,
  dark: 'html.dark',
  ...theme.value.waline
}))

const showComments = computed(() => {
  if (frontmatter.value.comments === true) return true
  if (frontmatter.value.comments === false || frontmatter.value.layout === 'home') return false

  return !route.path.endsWith('/') && route.path !== '/about'
})

const walinePath = () => window.location.pathname

function destroyWaline() {
  if (walineInstance && typeof walineInstance.destroy === 'function') {
    walineInstance.destroy()
  }

  walineInstance = null
}

async function initWaline() {
  if (typeof window === 'undefined') return

  if (!showComments.value || !walineOptions.value.serverURL) {
    destroyWaline()
    return
  }

  await nextTick()
  if (!walineContainer.value) return

  if (!initFn) {
    const walineModule = await import('@waline/client')
    initFn = walineModule.init
  }

  if (walineInstance) {
    walineInstance.update({
      path: walinePath()
    })
  } else {
    walineInstance = initFn({
      ...walineOptions.value,
      el: walineContainer.value,
      path: walinePath()
    })
  }
}

onMounted(() => {
  initWaline()
})

watch(() => route.path, initWaline)
watch(showComments, initWaline)

onUnmounted(() => {
  destroyWaline()
})
</script>

<template>
  <div v-if="showComments" class="waline-container">
    <div ref="walineContainer"></div>
  </div>
</template>

<style scoped>
.waline-container {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
