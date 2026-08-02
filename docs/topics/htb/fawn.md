---
title: "HTB: Fawn"
description: "Hack The Box - Fawn Writeup (Starting Point Tier 0 - Anonymous FTP Access)"
tags: [htb, starting-point, ftp, vsftpd, anonymous-login, Linux, easy]
---

# Hack The Box: Fawn

**Difficulty:** Very Easy  
**OS:** Linux  
**Category:** Starting Point (Tier 0)  
**Primary Vectors:** Anonymous FTP Access (`21/tcp`)

---

## Overview

Fawn is the second machine in Tier 0 of Hack The Box's Starting Point series. It focuses on enumerating File Transfer Protocol (FTP) services, identifying vsFTPd software versions, utilizing anonymous logins, and retrieving sensitive files via command line FTP client.

---

## Task Breakdown

### Task 1: FTP Definition
**Question:** What does the 3-letter acronym FTP stand for?

::: details Answer
`File Transfer Protocol`
:::

---

### Task 2: Standard Ports
**Question:** Which port does the FTP service listen on usually?

::: details Answer
`21`
:::

---

### Task 3: Secure Alternatives
**Question:** FTP sends data in the clear, without any encryption. What acronym is used for a later protocol designed to provide similar functionality to FTP but securely, as an extension of the SSH protocol?

::: details Answer
`SFTP` (Secure File Transfer Protocol)
:::

---

### Task 4: ICMP Echo
**Question:** What is the command we can use to send an ICMP echo request to test our connection to the target?

::: details Answer
`ping`
:::

---

### Task 5: Service Scanning
**Question:** From your scans, what version is FTP running on the target?

```bash
nmap -sV 10.129.75.115 -T4
```

```text
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
```

::: details Answer
`vsftpd 3.0.3`
:::

---

### Task 6: Operating System Detection
**Question:** From your scans, what OS type is running on the target?

::: details Answer
`Unix`
:::

---

### Task 7: Client Help Options
**Question:** What is the command we need to run in order to display the 'ftp' client help menu?

::: details Answer
`ftp -?`
:::

---

### Task 8: Anonymous Login Username
**Question:** What is the username that is used over FTP when you want to log in without having an account?

::: details Answer
`anonymous`
:::

---

### Task 9: FTP Response Codes
**Question:** What is the response code we get for the FTP message 'Login successful'?

::: details Answer
`230`
:::

---

### Task 10: Listing Directory Contents
**Question:** There are a couple of commands we can use to list the files and directories available on the FTP server. One is `dir`. What is the other that is a common way to list files on a Linux system?

::: details Answer
`ls`
:::

---

### Task 11: File Download Command
**Question:** What is the command used to download the file we found on the FTP server?

::: details Answer
`get`
:::

---

## Flag Capture Walkthrough

1. **Connect to FTP Server:**
   ```bash
   ftp 10.129.75.115
   ```
2. **Authenticate Anonymously:**
   - **Name:** `anonymous`
   - **Password:** *(Leave blank / press Enter)*
   ```text
   331 Please specify the password.
   230 Login successful.
   ```
3. **List Files:**
   ```text
   ftp> ls
   150 Here comes the directory listing.
   -rw-r--r--    1 0        0              32 Jun 04  2021 flag.txt
   226 Directory send OK.
   ```
4. **Download & Read Flag:**
   ```text
   ftp> get flag.txt
   226 Transfer complete.
   ftp> exit
   ```
   ```bash
   cat flag.txt
   ```

::: details Flag
`035db21c881520061c53e0536e44f815`
:::

---

## Summary & Key Takeaways

- **Disable Anonymous FTP:** Unless required for public downloads, anonymous FTP login should be disabled on internal and production servers.
- **Enforce Encryption:** Plaintext FTP exposes sensitive content and credentials; prefer SFTP or FTPS.
