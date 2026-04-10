---
title: "Order"
date: 2026-04-04
category: "ctf"
excerpt: "Walkthrough of the TryHackMe Order challenge - Perform a known-plaintext attack to recover a repeating-key XOR key and decrypt a hidden message."
image: "/images/blog/59.png"
readtime: "8 min read"
draft: false
---

# Repeating Key XOR

This challenge gives us two XOR encrypted messages and tells us that every message always starts with the header `ORDER:`. That's our way in.

Here are the two encrypted strings:

```
1c1c01041963730f31352a3a386e24356b3d32392b6f6b0d323c22243f6373
1a0d0c302d3b2b1a292a3a38282c2f222d2a112d282c31202d2d2e24352e60

```

---

## Where Do I Even Start

Honestly I stared at this for a bit. Two hex strings and a known header. I knew it was XOR but I wasn't immediately sure where to begin. Then I remembered I had done XOR before and things started falling into place.

The header `ORDER:` is 6 bytes, and since the strings are hexadecimal, every byte is 2 characters. So the first 12 characters of each message correspond to `ORDER:` in the plaintext. That's the opening I needed.

---

## Finding the Key

I opened CyberChef and set it up like this:

- **Key:** first 12 characters of the first message
- **Input:** `ORDER:`

The output came back as `SNEAKY`.

![](/images/blog/order/1.png)

So the key is `SNEAKY`. Six characters, same length as our known header. Makes sense.

---

## But how?

Same reason as always with XOR. If you know part of the plaintext, you can XOR it against the ciphertext to recover part of the key. The attacker used a repeating key, which means `SNEAKY` just loops over and over for the entire message. So knowing the first 6 bytes of the plaintext gave us the entire key, because the key itself is only 6 bytes long. That's the mistake they made, and that's what the challenge description was hinting at with the word "repeating".

---

## Decrypting the First Message

Now here is where I had to think for a bit. I had the key `SNEAKY` but I wasn't sure what to do next. Then I re-read the challenge description and the word "repeating" finally registered properly.

I took the full first hex string and put it in the **Key** field in CyberChef, then put `SNEAKY` in the **Input** field. The output started with `ORDER:`, which confirmed I was going the right way.

![](/images/blog/order/2.png)

Since the key repeats for the whole message, I just kept adding `SNEAKY` to the input until the full message came out:

![](/images/blog/order/3.png)

**First message:** `ORDER: Attack at dawn. Target:`

---

## Decrypting the Second Message

For the second message I did the same thing but combined both hex strings together in the Key field. So I put the first string and the second string back to back as the key, and kept adding `SNEAKY` to the input until everything decrypted:

![](/images/blog/order/4.png)

**Second message:** `THM{the_hackfinity_highschool}`

The flag was split across both messages. First one gave me the beginning, second one gave me the flag.

**Flag:** `THM{the_hackfinity_highschool}`

---

## This challenge

A fixed header like `ORDER:` is basically handing you the key. Never use predictable plaintext with XOR

Repeating key XOR is easy to break once you figure out the key length, especially with a short key

Known plaintext attack sounds fancy but it's just XOR working against itself

Always re-read the challenge description. The word "repeating" was the whole hint and I almost missed it
