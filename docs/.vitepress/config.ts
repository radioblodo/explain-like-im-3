import { defineConfig } from 'vitepress'

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  title: 'Explain Like I’m 3',
  description: 'Docs translated into human language.',
  base: '/explain-like-im-3/',
  themeConfig: {
    nav: [
      { text: 'Tooling', link: '/tooling/' },
      { text: 'CTF Solutions', link: '/topics' },
      { text: 'About', link: '/about' }
    ],
    sidebar: {
      '/tooling/': [
        {
          text: 'Tooling',
          items: [
            { text: 'Overview', link: '/tooling/' },
            { text: 'Recon and Enumeration', link: '/tooling/recon/' },
            { text: 'Exploitation', link: '/tooling/exploitation/' }
          ]
        },
        {
          text: 'Recon and Enumeration',
          items: [
            { text: 'Nmap', link: '/tooling/recon/nmap' },
            { text: 'Amass', link: '/tooling/recon/amass' }
          ]
        },
        {
          text: 'Exploitation',
          items: [
            { text: 'Metasploit', link: '/tooling/exploitation/metasploit' },
            { text: 'Searchsploit', link: '/tooling/exploitation/searchsploit' }
          ]
        },
        {
          text: 'Post-exploitation',
          items: [
            { text: 'Overview', link: '/tooling/post_exploitation/' },
            { text: 'Ligolo', link: '/tooling/post_exploitation/ligolo' }
          ]
        }
      ]
    }
  }
})
