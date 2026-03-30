# picoCTF: strings-it

- Platform: picoCTF
- Category: Forensics
- Points: 100
- Date: 2026-03-29
- Tags: strings, file-analysis

## Problem
We are given a file named `strings` and asked to find the flag.

## Approach
Extract readable text from the file and search for the flag format.

## Steps
```sh
strings strings | rg picoCTF
```

## Flag
`picoCTF{example_flag}`
