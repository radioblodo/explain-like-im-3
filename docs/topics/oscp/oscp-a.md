---
title: "OSCP Lab Set A Walkthrough"
description: "Walkthrough of OSCP Practice Network A - Enumeration, Web Exploitation, and Privilege Escalation"
tags: [oscp, network-a, lab, walkthrough, windows, linux]
---

# OSCP Lab Set A Walkthrough

**Target Range:** `192.168.174.141 - 192.168.174.145`  
**Network Overview:** Multi-host lab environment featuring Windows Apache/PHP servers, OpenSSH, MySQL, and Ubuntu Linux web servers.

---

## 1. Network Reconnaissance

```bash
nmap -sCV 192.168.174.141-145 -T4
```

### Key Target Findings:
- **Host `192.168.174.141` (Windows):**
  - Ports `22/tcp` (OpenSSH 8.1), `80/tcp` (Apache 2.4.51 / PHP 7.4.26), `81/tcp` (Attendance & Payroll System), `135/tcp`, `139/tcp`, `445/tcp`, `3306/tcp` (MySQL), `5985/tcp` (WinRM).
- **Host `192.168.174.143` (Ubuntu Linux):**
  - Ports `21/tcp` (vsftpd 3.0.3), `22/tcp` (OpenSSH 8.2p1), `80/tcp` (Apache 2.4.41), `81/tcp` (Nginx test page), `443/tcp` (HTTPS).

---

## 2. Web Application Analysis (`192.168.174.141:81`)

Enumeration of port 81 reveals an **Attendance and Payroll System**.

1. **Session & Cookie Audit:**
   - `PHPSESSID` cookie lacks the `HttpOnly` flag.
2. **Exploitation & Initial Access:**
   - Searchsploit query for the payroll portal components.
   - Credentials harvested from public exploits or default database dumps allow initial access.

---

## 3. Host Privilege Escalation

Once initial access is established:
- Run `whoami /priv` (Windows) or `sudo -l` (Linux).
- Audit service permissions and unquoted service paths.
