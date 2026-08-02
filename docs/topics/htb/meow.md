---
title: "HTB: Meow"
description: "Hack The Box - Meow Writeup (Starting Point Tier 0 - Telnet)"
tags: [htb, starting-point, telnet, Linux, easy]
---

# Hack The Box: Meow

**Difficulty:** Very Easy  
**OS:** Linux  
**Category:** Starting Point (Tier 0)  
**Primary Vectors:** Unauthenticated Telnet Access (`23/tcp`)

---

## Overview

Meow is the first machine in Tier 0 of Hack The Box's Starting Point series. It introduces basic concepts such as VPN connectivity, ICMP testing, port scanning with Nmap, and connecting to exposed services like Telnet without authentication.

---

## Task Breakdown

### Task 1: Virtual Machines
**Question:** In cybersecurity, isolated environments—like Pwnbox or the vulnerable target machines—are often VMs. What does VM stand for?

::: details Answer
`Virtual Machine`
:::

---

### Task 2: Command Line Interface
**Question:** What tool do we use to interact with the operating system in order to issue commands via the command line, such as the one to start our VPN connection? It's also known as a console or shell.

::: details Answer
`terminal`
:::

---

### Task 3: VPN Connectivity
**Question:** What service do we use to form our VPN connection into HTB labs?

::: details Answer
`openvpn`
:::

---

### Task 4: Network Diagnostics
**Question:** What tool do we use to test our connection to the target with an ICMP echo request?

::: details Answer
`ping`
:::

---

### Task 5: Port Scanning
**Question:** What is the name of the most common tool for finding open ports on a target?

::: details Answer
`nmap`
:::

---

### Task 6: Service Identification
**Question:** What service do we identify on port 23/tcp during our scans?

::: details Answer
`telnet`
:::

---

### Task 7: Default Credentials
**Question:** What username is able to log into the target over telnet with a blank password?

::: details Answer
`root`
:::

---

### Task 8: Flag Retrieval
**Question:** Submit the root flag located on the target system.

**Walkthrough:**
1. Connect via Telnet:
   ```bash
   telnet <TARGET_IP> 23
   ```
2. When prompted for a login, enter `root` with no password.
3. Read the flag file:
   ```bash
   cat flag.txt
   ```

::: details Answer
`b40ae6ed1f765552897b424d34d66c5a`
:::

---

## Summary & Key Takeaways

- **Telnet Risks:** Telnet passes all data (including credentials) in plaintext and should never be used without authentication or on public networks.
- **Root Misconfigurations:** Allowing unauthenticated root access to interactive shells is a critical vulnerability.
