---
title: Nmap
level: beginner
tags: [recon, enumeration]
---

# Nmap

## What it is
Nmap is a network scanner that discovers hosts, open ports, and basic service details.

## When to use it
Use Nmap early in an assessment to understand what is exposed. Only scan systems you own or have permission to test.

## Quick start
Start small on a local target to confirm your setup.

```bash
nmap 127.0.0.1
```

## Common pitfalls
- Scanning too broadly without permission
- Interpreting closed or filtered ports as "safe"

## References
- Official docs: https://nmap.org/docs.html
