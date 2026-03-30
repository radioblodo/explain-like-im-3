# picoCTF: strings-it

- Platform: picoCTF
- Category: General Skills
- Points: 100
- Date: 2026-03-29
- Tags: strings, string transformations

## Problem
When we start the instance on picoCTF, we are given an endpoint and a port to connect to. When connected, we are presented with a string and a hint text. The problem is designed to guide the player to crack for the flag in a step by step manner. 

## Approach
Step 1: Connect to the endpoint via the code provided using a terminal 
```bash
nc foggy-cliff.picoctf.net 60189
```

Step 2: Follow the hint at each step and enter the command only, do not include the string the command is applied on

For the first hint, we are asked to decode a base64 encoded string and there are several ways to do this. The most common method to decode a base64 encoded string would be to use the `base64 -d` command, which is part of the coreutils package that is commonly preinstalled on most linux distributions. The typical usages are below. 

### Decode a base64 encoded string with base64 utility 
```bash
echo "base64encodedstring" | base64 -d 
```

### Decode a base64 encoded file with base64 utility 
```bash
base64 -d encodedfile > decodedfile 
``` 

There is another way to decode base64 encoded strings and files using OpenSSL as well. The commands to decode a base64 encoded string and base64 encoded file are provided below. 

### Decode a base64 encoded string with OpenSSL 
```bash
echo "base64encodedstring" | openssl enc -base64 -d 
```

### Decode a base64 encoded file with OpenSSL 
```bash
openssl enc -base64 -d -in encodedfile -out decodedfile 
```

## Steps
```sh
strings strings | rg picoCTF
```
In this case for step 2, we enter the following command 
```bash
base64 -d 
```

Step 3: The second hint asks us to reverse the text
To reverse the text, there are also 2 ways to achieve this. 
The easiest and most straightforward method to achieve this is to pipe the string into the `rev` command, such as in the example below. 

## Method 1: Using rev command 
### Reverse a string using the rev command 
```bash
echo "somestring" | rev 
``` 

### Reverse string in a file using the rev command 
```bash 
rev filename.txt
```

## Method 2: Using awk command 
```bash 
echo "somestring" | awk '{for(i=length;i!=0;i--)x=x substr($0,i,1)}END{print x}'
```

## Method 3: Using sed command 
```bash 
echo "somestring" | sed '1!G;h;$!d' 
```

## Method 4: Using perl command 
```bash 
echo 'somestring' | perl -ne 'chomp; print scalar(reverse($_)),"\n"'
```

## Method 5: Using python 
```bash 
echo 'somestring' | python3 -c "import sys; print(sys.stdin.read().strip()[::-1])"
```
Thus for this step, the answer we input should be 
```bash 
rev 
```

Step 4: Replace '-' with '_' 
This is related to the hint provided on picoCTF site and we can use the `tr` command to achieve this easily. 
```bash
tr '-' '_' 
``` 

Step 5: Replace '(' with '{' and ')' with '}' 
Similar to before, this step is teaching us that the `tr` command can be applied on multiple characters in a single command, hence we input 
```bash 
tr '()' '{}' 
``` 

Step 6: Apply ROT13 to the letters 
Again, for this rotation, we can use the `tr` command to achieve that 
```bash 
tr 'A-Za-z' 'N-ZA-Mn-za-m'
```

## Flag
`picoCTF{Revers1ng_t3xt_Tr4nsf0rm@t10ns_72088a35}`
