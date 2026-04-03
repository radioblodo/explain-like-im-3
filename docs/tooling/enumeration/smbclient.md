# Smbclient 

## What is smbclient?
`smbclient` is a command-line tool to interact with SMB/CIFS network shares. It is commonly used to:

- list shares on a target machine 
- connect to a share 
- browse files and folders
- download or upload files 
- test anonymous or authenticated SMB access 

## Commonly used commands 

### List shares on a target machine 
```bash 
smbclient -L //host/ -U username
# smbclient -L //mysterious-sea.picoctf.net/ -U bob 
``` 

### List shares on a home NAS at 192.168.1.50 using username admin 
```bash 
smbclient -L //192.168.1.50/ -U admine 
``` 

### Connect directly to the share on a target as guest 
```bash 
smbclient -N //mysterious-sea.picoctf.net/shares 
```

### Connect directly to the public share on a local server using username 
```bash 
smbclient //192.168.1.20/public -U alice 
```

### Connect to the shares share on a custom SMB port used in a CTF 
```bash 
smbclient -N //mysterious-sea.picoctf.net/shares -p 59557
```
Once connected, you can use the `ls` command to get a list of files, `pwd` to print the current directory and `cd` to change directory just like how you normally would in a Linux shell. 

To download a file to your local machine, you can use the `get` command and to upload a file from the local machine to the target machine, you can use the `put` command. 

```bash 
get file.txt # download a file from target machine to local

put file.txt # upload a local file to target machine

more file.txt # display the contents of a file without downloading

mget * # download multiple files matching a pattern to local machine 

mput * upload multiple local files matching a pattern to the target machine 

recurse ON # turn on recursive traversal for batch transfers 

prompt OFF # turn off per-file confirmation prompts during mget

exit # exit the smbclient connection
```
A common workflow is

```bash
# List files
ls

# Turn on recursive downloads 
recurse ON 

# Turn off confirmation prompts
prompt OFF 

# Download everything reachable from the current folder 
mget *
```

The smbclient has its own built-in command interpreter, so shell commands like `cat` will not work. 
