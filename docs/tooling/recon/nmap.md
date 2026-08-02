---
title: "Nmap Cheat Sheet & Command Guide"
description: "Comprehensive Nmap cheat sheet covering target specification, port scanning, service detection, NSE scripts, and firewall evasion."
tags: [nmap, recon, enumeration, scanning, cheat-sheet]
---

# Nmap Command Guide & Cheat Sheet

Nmap (Network Mapper) is an open-source tool for network discovery, security auditing, and port scanning.

---

## 1. Target Specification

```bash
nmap 192.168.1.1                  # Single IP
nmap 192.168.1.1-50               # IP range
nmap 192.168.1.0/24               # Subnet
nmap -iL targets.txt              # Input from file
nmap --exclude 192.168.1.5        # Exclude a host
```

---

## 2. Port Specification

```bash
nmap -p 80                        # Single port
nmap -p 80,443,8080               # Multiple ports
nmap -p 1-1000                    # Port range
nmap -p-                          # All 65,535 ports
nmap --top-ports 100              # Top 100 most common ports
nmap -F                           # Fast scan (top 100 ports)
```

---

## 3. Scan Types

```bash
nmap -sS <target>                 # SYN scan (stealth, default with root)
nmap -sT <target>                 # TCP connect scan (no root needed)
nmap -sU <target>                 # UDP scan
nmap -sN <target>                 # TCP Null scan
nmap -sF <target>                 # FIN scan
nmap -sX <target>                 # Xmas scan
nmap -sA <target>                 # ACK scan (firewall detection)
```

---

## 4. Service & OS Detection

```bash
nmap -sV <target>                 # Detect service versions
nmap -sV --version-intensity 9   # Max version detection intensity
nmap -O <target>                  # OS detection
nmap -A <target>                  # Aggressive scan (OS + version + scripts + traceroute)
```

---

## 5. Timing & Performance

```bash
nmap -T0 <target>                 # Paranoid (slowest, IDS evasion)
nmap -T1 <target>                 # Sneaky
nmap -T2 <target>                 # Polite
nmap -T3 <target>                 # Normal (default)
nmap -T4 <target>                 # Aggressive (faster, recommended for labs)
nmap -T5 <target>                 # Insane (fastest, may miss results)
```

---

## 6. Nmap Script Engine (NSE)

```bash
nmap -sC <target>                         # Run default scripts
nmap --script=banner <target>             # Run specific script
nmap --script=vuln <target>               # Run all vuln scripts
nmap --script=http-enum <target>          # Web directory enumeration
nmap --script=smb-vuln-ms17-010 <target>  # Check for EternalBlue
nmap --script=ftp-anon <target>           # Check anonymous FTP
nmap --script=ssh-brute <target>          # SSH brute force
nmap --script "not intrusive"             # Skip intrusive scripts
```

---

## 7. Firewall / IDS Evasion

```bash
nmap -f <target>                  # Fragment packets
nmap -D RND:10 <target>           # Decoy scan (random IPs)
nmap -S <spoofed_ip> <target>     # Spoof source IP
nmap --source-port 53 <target>    # Spoof source port (DNS port)
nmap --data-length 25 <target>    # Append random data to packets
nmap --randomize-hosts <target>   # Randomize scan order
```

---

## 8. Output Formats

```bash
nmap -oN output.txt               # Normal text output
nmap -oX output.xml               # XML output
nmap -oG output.gnmap             # Grepable output
nmap -oA output                   # All formats at once (recommended)
nmap -v <target>                  # Verbose output
```

---

## 9. Common Workflows

```bash
# 1. Fast live host ping sweep
nmap -sn 192.168.1.0/24

# 2. Recommended initial scan (all ports + version + default scripts)
nmap -T4 -p- -sC -sV -oA scan 192.168.1.1

# 3. Quick top-ports scan
nmap -T4 -F 192.168.1.1

# 4. Common UDP scan
nmap -sU --top-ports 20 192.168.1.1
```
