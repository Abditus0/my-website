---
title: "Cipher's Secret Message"
date: 2026-04-03
category: "ctf"
excerpt: "Walkthrough of TryHackMe Cipher's Secret Message challenge - Sharpen your cryptography skills by analyzing code to get the flag."
image: "/images/blog/58.png"
readtime: "8 min read"
draft: false
---

## What Are We Working With

We have two things. An encrypted message:
`a_up4qr_kaiaf0_bujktaz_qm_su4ux_cpbq_ETZ_rhrudm`
And the Python script that was used to encrypt it:

```python
from secret import FLAG

def enc(plaintext):
    return "".join(
        chr((ord(c) - (base := ord('A') if c.isupper() else ord('a')) + i) % 26 + base) 
        if c.isalpha() else c
        for i, c in enumerate(plaintext)
    )

with open("message.txt", "w") as f:
    f.write(enc(FLAG))
```

Pretty much ideal starting point. We know what the output looks like and we know exactly how it was made.

---

## Understanding the Encryption

The script looks a bit weird at first because it is all crammed into one line. I stared at it for a bit before I got it.

Here is what it is actually doing. For every character in the flag, if it is a letter, it shifts it forward in the alphabet by `i`. And `i` is just the position of that character starting from 0. So the first letter gets shifted by 0, the second by 1, the third by 2, and so on. Non-letter characters like numbers and underscores are left alone.

That is it. That is the whole thing.

---

## Finding a Tool

My first instinct was to search for an online decoder. This reminded me of a Vigenere cipher so I looked for Vigenere decryption tools. Found a bunch of them but none of them worked for this. Makes sense because this is not quite a standard Vigenere cipher. The key here is literally just the position index, not a repeated keyword.

So no online tool was going to save me here.

---

## Writing the Decryption Script

Since the encryption is just adding `i` to each letter's position, reversing it is straightforward. Just subtract `i` instead.

```python
def dec(ciphertext):
    return "".join(
        chr((ord(c) - (base := ord('A') if c.isupper() else ord('a')) - i) % 26 + base)
        if c.isalpha() else c
        for i, c in enumerate(ciphertext)
    )

cipher = "a_up4qr_kaiaf0_bujktaz_qm_su4ux_cpbq_ETZ_rhrudm"
print(dec(cipher))
```

Spot the difference? I literally just changed `+ i` to `- i`. That's it.

Run it and wrap the output in `THM{}`:

![](/images/blog/ciphers-secret-message/1.png)

`THM{a_sm4ll_crypt0_message_to_st4rt_with_THM_cracks}`
Done.

---

## Wrapping Up

This one was quick. Having the encryption script handed to you basically means the hard part is already done. All I had to do was read it, understand what it was doing, and flip it around.

The only small wall I hit was assuming there might be an online tool for it. There was not, but writing the fix took about two minutes so it did not matter.

---