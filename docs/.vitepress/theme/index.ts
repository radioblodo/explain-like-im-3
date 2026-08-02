import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import WalineComments from './components/WalineComments.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(WalineComments)
    })
  }
}
