---
title: "OSCP Practice & Lab Walkthroughs"
description: "Walkthroughs, exam notes, and practice challenge writeups for OffSec Certified Professional (OSCP)."
---

# OSCP Practice & Lab Walkthroughs

This section contains lab walkthroughs, challenge machines, and notes taken during OffSec Certified Professional (OSCP) preparation.

---

## Challenge Labs & Walkthroughs

| Lab / Challenge | Target Focus | Key Techniques | Walkthrough |
| :--- | :--- | :--- | :--- |
| **Challenge 1: MedTech** | IIS, SQLi, WinRM | SQL Injection, `SeImpersonatePrivilege`, Potato Attacks | [Read Walkthrough](/topics/oscp/medtech) |
| **OSCP A Network** | Windows / Linux Dual | Multi-host recon, SSH key theft, web exploits | [Read Walkthrough](/topics/oscp/oscp-a) |
| **OSCP B Network** | Web, FTP, Privilege Escalation | Public exploit customization, service hijacking | [Read Walkthrough](/topics/oscp/oscp-b) |
| **Public Exploits Practice** | Apache 2.4.49, Apache James | Searchsploit workflow, Path Traversal, Reverse Shells | [Read Practice](/topics/oscp/public-exploits-practice) |

---

## OSCP Strategy Notes

- **Exam Focus:** Active Directory accounts for 40 marks. Focus heavily on AD enumeration and privilege escalation.
- **Password Cracking:** Stick to `rockyou.txt` on the host OS; do not spend hours on brute-forcing.
- **Reporting:** Keep clean evidence including `whoami`, `ipconfig` / `ifconfig`, and `local.txt` / `proof.txt` flags in every submission screenshot.
