---
title: "Dark Matter"
date: 2026-03-29
category: "ctf"
excerpt: "Walkthrough of the TryHackMe Dark Matter challenge - Practice how to exploit a weak RSA implementation to recover the private key and decrypt a ransomware-encrypted files."
image: "/images/blog/40.png"
readtime: "6 min read"
draft: false
---

## What Is Going On Here

So the machine got hit by ransomware. Great. The description gives us one hint though: the ransomware was sloppy enough to leave some data sitting in the `/tmp` directory. That is our starting point.

The goal is to find the RSA key, use it to decrypt whatever the ransomware locked up, and get the machine back.

![](/images/blog/dark-matter/1.png)

---

## Poking Around in /tmp

First thing, open the terminal and head over to the tmp directory:
```bash
cd /tmp
```

Here is what is there:

![](/images/blog/dark-matter/2.png)

- `public_key.txt` - the RSA public key, just two values: `n` and `e`
- `encrypted_aes_key.bin` - the AES key, encrypted with the RSA key
- `dock-replace.log` - Nothing useful

So the flow here is: RSA was used to lock the AES key, and the AES key was used to encrypt the actual files on the machine. To get anything back we need to break the RSA key first.

---

## The Weak Link

![](/images/blog/dark-matter/3.png)

I opened `public_key.txt` and looked at the `n` value. This is where things got interesting.

The `n` value is only **128 bits**.

That is... bad. Real RSA uses 2048 bits minimum, usually 4096 for anything serious. A 128-bit modulus means whoever wrote this ransomware either had no idea what they were doing or just did not care. Either way, that is our way in.

The formula to recover the private key is:
```
d = e⁻¹ mod (p-1)(q-1)
```

We already have `e` from the public key. What we need is `p` and `q`, which are the two prime numbers that were multiplied together to make `n`. Normally with proper RSA you would never be able to factor `n` back into `p` and `q`, that is literally the whole point. But with 128 bits? Yeah, we can factor that.

---

## Factoring `n`

I took the `n` value and threw it into [factordb.com](https://factordb.com/), which is basically a database of factored numbers. For a weak modulus like this it spits the answer out instantly.

![](/images/blog/dark-matter/4.png)

Got `p` and `q` right there. Now it is just math.

---

## Writing the Script

With `p`, `q`, and `e` in hand, I wrote a quick Python one-liner to calculate `d`:
```python
python3 -c "
p = 18446744073709551533
q = 18446744073709551557
e = 65537
d = pow(e, -1, (p-1)*(q-1))
print('d =', d)
"
```

![](/images/blog/dark-matter/5.png)

It ran, printed `d`, and the machine unlocked. That was it.

![](/images/blog/dark-matter/6.png)

---

## Getting the Flag

Once the machine was unlocked, I opened `student_grades.docx` and the flag was there.

**Flag:** `THM{d0nt_l34k_y0ur_w34k_m0dulu5}`

The flag name says it all honestly. Do not leak your weak modulus.
