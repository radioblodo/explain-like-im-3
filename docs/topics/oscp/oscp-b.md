---
title: "OSCP Lab Set B Walkthrough"
description: "Walkthrough of OSCP Practice Network B - High port discovery, public exploit customization, and reverse shells."
tags: [oscp, network-b, lab, walkthrough, python, searchsploit]
---

# OSCP Lab Set B Walkthrough

---

## 1. Port Scanning & Service Identification

Identify open ports across non-standard high ranges:

```bash
nmap <IP_ADDRESS> -p- -sCV -T4
```

---

## 2. Exploiting Authenticated Services (e.g., Apache James)

1. Search for public exploits:
   ```bash
   searchsploit JAMES
   ```
2. Mirror the authenticated exploit:
   ```bash
   searchsploit -m 50347
   ```
3. Inspect and edit socket connection settings:
   ```python
   # Modify target port and payload string in 50347.py to match the target environment
   ```

---

## 3. Post-Exploitation Flag Discovery

Search recursively for `flag.txt`:

```cmd
dir flag.txt /s /b
type flag.txt
```

```bash
find / -name "flag.txt" 2>/dev/null
cat flag.txt
```
