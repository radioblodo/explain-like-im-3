---
title: "OSCP Challenge 1: MedTech"
description: "OSCP Challenge 1 MedTech Walkthrough - IIS, SQL Injection, and Windows Privilege Escalation with SeImpersonatePrivilege"
tags: [oscp, windows, iis, sqli, privilege-escalation, seimpersonate, potato-attack]
---

# OSCP Challenge 1: MedTech

**Target:** `192.168.107.121`  
**OS:** Windows  
**Services:** IIS 10.0 (`80/tcp`), RPC (`135/tcp`), SMB (`139/tcp`, `445/tcp`), WinRM (`5985/tcp`)

---

## 1. Initial Reconnaissance

```bash
nmap -sCV 192.168.107.121 -T4
```

**Nmap Scan Output:**
```text
PORT     STATE SERVICE       VERSION
80/tcp   open  http          Microsoft IIS httpd 10.0
|_http-title: MedTech
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp  open  microsoft-ds?
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows
```

---

## 2. Web Enumeration & SQL Injection

Visiting `http://192.168.107.121` presents the MedTech portal.

![MedTech Web Portal](/images/Pasted_image_20260613160502.png)

![MedTech SQL Injection Vulnerability](/images/Pasted_image_20260613160831.png)

Testing input fields reveals a SQL injection vulnerability allowing authentication bypass and database query execution.

---

## 3. Windows Privilege Escalation: `SeImpersonatePrivilege` & Potato Attacks

Once initial shell access is obtained as a service account (such as `iis apppool\defaultapppool` or `LOCAL SERVICE`), inspect account privileges:

```cmd
whoami /priv
```

If `SeImpersonatePrivilege` is enabled, the host is vulnerable to **Potato-style privilege escalation** (e.g. SweetPotato, JuicyPotatoNG, RoguePotato, GodPotato).

### Concept & Mechanics

1. **`SeImpersonatePrivilege`**: Allows a process to impersonate any user token for which it can obtain a handle.
2. **Impersonation Attack Vector**:
   - Force a high-privilege account (like `NT AUTHORITY\SYSTEM`) to authenticate to an attacker-controlled RPC/Named Pipe listener.
   - Capture the `SYSTEM` security token.
   - Spawn a new process using `CreateProcessWithTokenW` or `CreateProcessAsUserW` running as `SYSTEM`.

::: tip Mitigation & Defensive Note
To defend against Potato attacks, strip `SeImpersonatePrivilege` from service accounts whenever possible and ensure NT AUTHORITY\SYSTEM cannot be tricked into unauthenticated local NTLM authentication.
:::
