---
title: "Hack The Box Writeups"
description: "Detailed walkthroughs and writeups for Hack The Box (HTB) machines and challenges."
---

# Hack The Box (HTB) Solutions

Welcome to the Hack The Box section of **Explain Like I'm 3**. Here you'll find structured, step-by-step walkthroughs for HTB machines, categorized by operating system and difficulty.

---

## Machine Walkthroughs

| Machine | OS | Difficulty | Primary Focus / Techniques | Writeup |
| :--- | :--- | :--- | :--- | :--- |
| **Meow** | Linux | Very Easy | Telnet, Unauthenticated Root Access | [Read Writeup](/topics/htb/meow) |
| **Fawn** | Linux | Very Easy | FTP, vsFTPd, Anonymous Login | [Read Writeup](/topics/htb/fawn) |
| **Cicada** | Windows | Easy | Active Directory, RID Brute, LDAP, SeBackupPrivilege, Secretsdump | [Read Writeup](/topics/htb/cicada) |
| **TwoMillion** | Linux | Easy | API enumeration, JavaScript deobfuscation, command injection, Linux privilege escalation | [Read Writeup](/topics/htb/twomillion) |
| **Connected** | Linux | Medium | FreePBX CVE-2025-57819, Asterisk, incron, DAHDI config abuse | [Read Writeup](/topics/htb/connected) |

---

## Key Methodology & Concepts

- **Reconnaissance & Enumeration:** Nmap service scans, Netexec (`nxc`), SMB share listings.
- **Active Directory Enumeration:** LDAP queries, RID brute forcing, credential harvesting.
- **Privilege Escalation:** Exploiting Windows privileges like `SeBackupPrivilege`, extracting SAM/SYSTEM hives, and abusing Linux service automation such as `incron.d`.
