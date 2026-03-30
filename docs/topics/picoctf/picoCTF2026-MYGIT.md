# picoCTF: MY GIT

- Platform: picoCTF
- Category: General Skills 
- Date: 2026-03-31
- Tags: git, git commands

## Problem
We are provided with a github repository to clone and follow the instructions after cleaning. The instructions are written in the README.md in the folder. 

## Approach
Step 1: Clone the repository 
```bash
git clone ssh://git@foggy-cliff.picoctf.net:57338/git/challenge.git
```

Step 2: Read the instructions in README.md 
```bash 
cat README.md
```

Step 3: Change the username
```bash 
git config user.name "root"
```

Step 4: Change the user email 
```bash 
git config user.email "root@picoctf"
```

Step 5: Create an empty flag.txt file 
```bash 
vim flag.txt
```

Step 6: Push the changes into the remote repository 
```bash 
git add flag.txt 
git commit -m "added flag.txt"
git push -force
```

After step 6, you will be able to see the flag in the terminal. 

## Flag
`picoCTF{1mp3rs0n4t4_g17_345y_220a9833}`
