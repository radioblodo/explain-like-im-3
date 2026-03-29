---
title: Amass
level: intermediate
tags: [recon, enumeration]
---

# Amass

## What it is
Amass maps attack surfaces by gathering subdomains and related infrastructure.

## When to use it
Use Amass when you need a broad view of a target's external footprint. Only enumerate assets you are authorized to test.

## Quick start
Start with a single domain you control.

```bash
amass enum -d example.com
```

## Common pitfalls
- Treating passive results as verified live hosts
- Forgetting to scope subdomains and related assets

## References
- Official docs: https://github.com/owasp-amass/amass
