#picoCTF: bytemancy 1 

- Platform: picoCTF
- Category: General Skills 
- Date: 2026-03-31
- Tags: python, bash 

## Problem 
This problem provides us with a python file `app.py` and performing a simple check on the file, we can know that it is basically asking for an input from us to reveal flag for us. 

## Approach 
**Step 1:** Read the `app.py` file 
```bash 
cat app.py
```
From this, we know that the verification is basically checking whether the input is `\x65` * 1751. The `\x` is basically an escape sequence that is used in programming and data representation to indicate that the two characters following it (`65` in this case) should be interpreted as a hexadecimal number. In this case, `\x65` refers to the english letter `e`, and the program requires 1751 of the letter `e`. 

**Step 2:** Print 1751 'e' using python 
To print 1751 'e', we can do this using the following python command 
```bash 
python -c "print('e' * 1751)"
```

**Step 3:** Connect to the challenge instance and input the 1751 'e' 
```bash 
nc foggy-cliff.picoctf.net 52689
```

## Flag
At the end, we will get the flag `picoCTF{h0w_m4ny_e's???_b6277f00}`
