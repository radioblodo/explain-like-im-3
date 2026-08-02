---
title: "Nessus Vulnerability Scanner Guide"
description: "Overview of Nessus vulnerability scanner, templates, scan configurations, and result analysis."
tags: [nessus, scanning, vulnerability-scanner, audit]
---

# Nessus Vulnerability Scanner Guide

Nessus is an automated vulnerability scanner that identifies security flaws by probing network assets, scanning ports, and analyzing software configurations against a database of over 70,000 plugins.

---

## 1. Key Functionalities

- **Host Discovery & Port Scanning**
- **Service Detection**
- **Vulnerability Assessment** (> 70,000 plugins)
- **Credentialed Scanning** (WMI / SSH authenticated checks)
- **Reporting & Remediation Guidance**

---

## 2. Common Workflow

1. **Create New Scan:** Click **New Scan** from the Scans dashboard.
2. **Select Scan Template:**
   - **Basic Network Scan:** General-purpose scan suitable for most network environments.
   - **Advanced Scan:** Granular control over plugin selection and tuning.
   - **Credentialed Patch Audit:** Checks for missing OS and application patches using local login credentials.
   - **Web Application Tests:** Evaluates web application vulnerabilities (XSS, SQLi, CSRF).
3. **Configure Settings:**
   - **Name:** Label for the scan.
   - **Targets:** Hostnames, single IP addresses, or CIDR blocks (`192.168.1.0/24`).
   - **Credentials:** Provide SSH or Windows WMI/SMB credentials for deeper visibility.
   - **Schedule:** Set periodic scan schedules.
4. **Launch & Export:** Save and launch the scan. Export results to PDF, HTML, or CSV.

---

## 3. Interpreting Severity Ratings

Findings are color-coded by CVSS severity score:

| Color | Severity | Description |
| :--- | :--- | :--- |
| 🔴 **Red** | Critical | High exploit probability / remote code execution. Immediate action required. |
| 🟠 **Orange** | High | Significant security flaw; high potential impact. |
| 🟡 **Yellow** | Medium | Moderate vulnerability; requires authentication or specific conditions. |
| 🔵 **Blue** | Low | Low security impact / informational configuration issue. |
| ⚪ **Grey** | Info | System information, exposed ports, and service banners. |

::: warning Exam Notice
Nessus and other automated vulnerability scanners are **strictly forbidden** during the OSCP exam.
:::
