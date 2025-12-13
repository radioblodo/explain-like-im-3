import { defineConfig } from 'vitepress'

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  title: 'Explain Like I’m 3',
  description: 'Docs translated into human language.',
  base: '/explain-like-im-3/',
  themeConfig: {
    nav: [
      { text: 'Start here', link: '/start' },
      { text: 'Topics', link: '/topics' },
      { text: 'Glossary', link: '/glossary' },
      {
        text: 'Languages',
        items: [
          { text: 'Python', link: '/python/' },
          { text: 'Java', link: '/java/' },
          { text: 'Web', link: '/web/' },
          { text: 'Linux', link: '/linux/' }
        ]
      },
      { text: 'About', link: '/about' }
    ]
  }
})
