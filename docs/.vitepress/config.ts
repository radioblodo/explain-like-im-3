import { defineConfig } from 'vitepress'

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  title: 'Explain Like I’m 3',
  description: 'Docs translated into human language.',
  base: '/explain-like-im-3/',
  themeConfig: {
    nav: [
      { text: 'Tooling', link: '/tooling/' },
      { text: 'CTF & Labs', link: '/topics/' },
      { text: 'About', link: '/about' }
    ],
    sidebar: {
      '/topics/': [
        {
          text: 'Hack The Box',
          items: [
            { text: 'HTB Overview', link: '/topics/htb/' },
            { text: 'Meow', link: '/topics/htb/meow' },
            { text: 'Fawn', link: '/topics/htb/fawn' },
            { text: 'Cicada', link: '/topics/htb/cicada' }
          ]
        },
        {
          text: 'picoCTF',
          items: [
            { text: 'picoCTF2026: Undo', link: '/topics/picoctf/picoCTF2026-Undo' },
            { text: 'picoCTF2026: MYGIT', link: '/topics/picoctf/picoCTF2026-MYGIT' },
            { text: 'picoCTF2026: bytemancy 1', link: '/topics/picoctf/picoCTF2026-bytemancy1' }
          ]
        },
        {
          text: 'OSCP Practice Labs',
          items: [
            { text: 'OSCP Overview', link: '/topics/oscp/' },
            { text: 'MedTech Challenge', link: '/topics/oscp/medtech' },
            { text: 'OSCP Lab Set A', link: '/topics/oscp/oscp-a' },
            { text: 'Public Exploits Practice', link: '/topics/oscp/public-exploits-practice' }
          ]
        }
      ],
      '/tooling/': [
        {
          text: 'Overview',
          items: [
            { text: 'Tooling Overview', link: '/tooling/' }
          ]
        },
        {
          text: 'Recon & Scanning',
          items: [
            { text: 'Nmap', link: '/tooling/recon/nmap' },
            { text: 'Amass', link: '/tooling/recon/amass' },
            { text: 'Nessus', link: '/tooling/scanning/nessus' }
          ]
        },
        {
          text: 'Web Security',
          items: [
            { text: 'SQL Injection', link: '/tooling/web/sql-injection' }
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
          text: 'Privilege Escalation',
          items: [
            { text: 'Windows PrivEsc', link: '/tooling/privilege_escalation/windows-privesc' }
          ]
        },
        {
          text: 'Post-exploitation',
          items: [
            { text: 'Overview', link: '/tooling/post_exploitation/' },
            { text: 'Ligolo-ng', link: '/tooling/post_exploitation/ligolo' }
          ]
        }
      ]
    }
  }
})
