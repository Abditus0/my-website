---
title: "Cryptography Basics — TryHackMe Cyber Security 101"
date: 2026-04-23
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Cryptography Basics room — Learn what cryptography actually is, how encryption works, and the math hiding behind all of it."
image: "/images/blog/92.png"
readtime: "22 min read"
draft: false
---


# Cryptography Basics

Every time you open your bank app, send a message, or just browse a website with that little padlock icon in the address bar, cryptography is quietly doing its thing in the background. You never see it. It never asks for credit. It just makes sure nobody is reading your stuff or messing with it on the way.

This room is the first of three cryptography rooms on TryHackMe. No scary prerequisites, just basic Linux command line stuff. We are talking about the absolute fundamentals here: what cryptography is, why it matters, how basic ciphers work, and the math that makes modern encryption possible.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Importance of Cryptography](#task-2)
- [Task 3 — Plaintext to Ciphertext](#task-3)
- [Task 4 — Historical Ciphers](#task-4)
- [Task 5 — Types of Encryption](#task-5)
- [Task 6 — Basic Math](#task-6)
- [Task 7 — Summary](#task-7)

---

## Task 1 — Introduction {#task-1}

The room opens with a question that is actually worth thinking about. How do your messages stay private? How does your browser build a secure connection to a server without someone in the middle just reading everything? And how do you even know you are talking to the real server and not some imposter?

The answer to all three is cryptography. It is the foundation that makes the internet not a total disaster. Networking protocols let devices talk to each other across the globe. Cryptography is what makes that talking trustworthy.

This is the first of three introductory rooms:

- Cryptography Basics (this one)
- Public Key Cryptography Basics
- Hashing Basics

By the end of this room you will know the key terms, understand why cryptography matters in the real world, know how Caesar Cipher works, understand the difference between symmetric and asymmetric encryption, and have a handle on the basic math that shows up constantly in cryptography.

---

## Task 2 — Importance of Cryptography {#task-2}

Cryptography's whole job is to make communication secure even when there are adversaries trying to mess with it. Secure here means two things: confidentiality (nobody reads your stuff) and integrity (nobody changes your stuff in transit). It is the practice and study of techniques that make this possible even when you assume someone out there is actively trying to break it.

You use cryptography every single day and you probably never think about it. Some examples from the room that make it click:

When you log in to TryHackMe, your credentials get encrypted before they leave your machine. Anyone sniffing the network traffic sees garbage. When you connect over SSH, the client and server set up an encrypted tunnel immediately so even if someone is watching every packet, they get nothing useful. When you do online banking, your browser checks the server's certificate to confirm it is actually your bank's server, not some attacker who got in the middle. When you download a file, hash functions let you verify that what you downloaded is identical to the original, byte for byte.

There are also legal reasons cryptography is not optional. If a company handles credit card information, they have to comply with PCI DSS (Payment Card Industry Data Security Standard). That standard requires data to be encrypted both at rest (sitting in a database) and in motion (being sent somewhere). Medical records have their own set of rules depending on where you are. In the US there is HIPAA and HITECH. In the EU there is GDPR. In the UK there is DPA. The point is that cryptography is not just a good idea, it is often a legal requirement.

**Question: What is the standard required for handling credit card information?** `PCI DSS`

---

## Task 3 — Plaintext to Ciphertext {#task-3}

Before going any further, the room defines the core vocabulary. This stuff matters because every single resource you read about cryptography uses these terms and if you are fuzzy on them you will get confused fast.

Here is the basic flow. You start with plaintext. That is just the original data before anything happens to it. Could be a text message, a photo, a spreadsheet, whatever. You pass that plaintext through an encryption function along with a key. Out comes ciphertext, which is the scrambled unreadable version. To get the plaintext back, you pass the ciphertext and the key through the decryption function.

The terms properly defined:

**Plaintext** is the original readable message or data before encryption. It can be a document, an image, a multimedia file, anything.

**Ciphertext** is the scrambled unreadable version after encryption. Ideally you should not be able to get any useful information from it at all, except maybe a rough idea of how big the original was.

**Cipher** is the algorithm or method used to convert between plaintext and ciphertext. Ciphers are usually developed by mathematicians and in modern cryptography the cipher itself is public knowledge.

**Key** is a string of bits the cipher uses to do the encryption or decryption. The cipher being public is fine. The key must stay secret. If someone has the key, they can decrypt everything.

**Encryption** is the process of converting plaintext to ciphertext using a cipher and a key.

**Decryption** is the reverse. Ciphertext goes in with a key, plaintext comes out. Without the key, even knowing the exact cipher being used, getting the plaintext back should be practically impossible.

**Question: What do you call the encrypted plaintext?** `ciphertext`

**Question: What do you call the process that returns the plaintext?** `decryption`

---

## Task 4 — Historical Ciphers {#task-4}

Cryptography is not new. People have been trying to hide messages since at least 1900 BCE in ancient Egypt. But the most famous simple historical cipher is Caesar Cipher from around the first century BCE. Caesar Cipher is so straightforward that you can explain it in one sentence: shift every letter in your message by a fixed number.

The room walks through an example. Plaintext is `TRYHACKME`, the key is 3, meaning shift right by 3. So T becomes W, R becomes U, Y becomes B, and so on. When you hit Z you wrap back around to A. The result is `WUBKDFNPH`.

Decrypting is just as easy. You have `WUBKDFNPH`, you know the key is 3, you shift everything left by 3, and you get `TRYHACKME` back.

The problem with Caesar Cipher is obvious once you think about it. The English alphabet has 26 letters. Shifting by 26 gets you back where you started, so there are only 25 valid keys. If someone intercepts your ciphertext and knows you used Caesar Cipher, they just try all 25 keys. It takes maybe two minutes. This is called a brute force attack and it works here because the key space is tiny. By modern standards Caesar Cipher is not even slightly secure.

Other historical ciphers that come up in the room: the Vigenère cipher from the 16th century, the Enigma machine from World War II, and the one-time pad used during the Cold War. Each one tried to solve the weaknesses of what came before it.

The room links to the Cryptii website where you can play with Caesar Cipher shifts interactively. Honestly worth spending five minutes on just to see it working visually.

**Question: Knowing that `XRPCTCRGNEI` was encrypted using Caesar Cipher, what is the original plaintext?** `CRYPTOGRAPHY`

For this one I just tried shifting left by different amounts until something readable came out. Key was 5. Not exactly glamorous but it works.

---

## Task 5 — Types of Encryption {#task-5}

Here is where things get more relevant to the real world. Modern encryption splits into two main categories and understanding the difference matters for basically everything else in security.

**Symmetric Encryption**

Symmetric encryption uses the same key to encrypt and decrypt. You lock the data with the key, and the same key unlocks it. It is also called private key cryptography because that key has to stay private.

The obvious problem: if you encrypt something and send it to someone, how do you get them the key? You can not send it over the same channel as the encrypted data because if someone is intercepting your traffic they get both. The room uses a good example here. You password-protect a document and email it to a colleague. Fine. But you can not email them the password because anyone with access to their inbox now has both the document and the key. You have to find a completely different way to share the password, maybe call them, meet them in person, something like that.

The main symmetric encryption standards:

**DES** (Data Encryption Standard) was adopted as a standard in 1977. It uses a 56-bit key. By 1999 someone broke a DES key in under 24 hours. That was the end of DES being taken seriously.

**3DES** was the emergency fix. Just run DES three times. Key size jumps to 168 bits (though effective security is around 112 bits). It was always a bit of a band-aid solution and was deprecated in 2019. You might still find it in old legacy systems.

**AES** (Advanced Encryption Standard) was adopted in 2001. Key sizes of 128, 192, or 256 bits. This is what you want. This is what everything modern uses.

**Asymmetric Encryption**

Asymmetric encryption uses two different keys: a public key and a private key. What the public key encrypts, only the private key can decrypt. Your public key can be shared with literally everyone. Your private key never leaves your hands.

This solves the key distribution problem from symmetric encryption. If you want to send me something private, you encrypt it with my public key. I decrypt it with my private key. You never need to know my private key. I never need to send it to you. Problem solved.

The tradeoff is speed and key size. Asymmetric encryption is significantly slower than symmetric. The key sizes are also much larger. RSA uses 2048-bit keys at minimum, with 3072-bit and 4096-bit being common. Diffie-Hellman is similar. ECC (Elliptic Curve Cryptography) is more efficient and can get the same security level with shorter keys. A 256-bit ECC key is roughly equivalent in security to a 3072-bit RSA key.

Asymmetric encryption works because of math problems that are easy to do in one direction and practically impossible to reverse. The room does not go deep on the specific math here, that is the next room's job. For now the key takeaway is: public key is shareable, private key is sacred.

**Question: Should you trust DES? (Yea/Nay)** `Nay`

A key that gets cracked in under 24 hours with hardware from 1999. Hard no.

**Question: When was AES adopted as an encryption standard?** `2001`

---

## Task 6 — Basic Math {#task-6}

Okay, this section is where people sometimes check out. Do not do that. Neither of these operations is actually difficult once you see a few examples, and you will run into them constantly in cryptography.

**XOR Operation**

XOR stands for exclusive OR. It is a binary operation, meaning it works on bits. The rule is simple: if the two bits are the same, the result is 0. If they are different, the result is 1. That is it.

The truth table:

- 0 XOR 0 = 0
- 0 XOR 1 = 1
- 1 XOR 0 = 1
- 1 XOR 1 = 0

The symbol for XOR is ⊕. So `1010 ⊕ 1100` works like this: compare bit by bit from left to right. 1⊕1=0, 0⊕1=1, 1⊕0=1, 0⊕0=0. Result is `0110`.

Why does this matter for cryptography? XOR has some properties that make it genuinely useful. If you XOR something with itself you always get 0. If you XOR something with 0 you get it back unchanged. It is also commutative (A⊕B = B⊕A) and associative ((A⊕B)⊕C = A⊕(B⊕C)).

Here is the cool part. Those properties mean XOR can work as a basic symmetric encryption algorithm. Say P is your plaintext and K is your key. Your ciphertext is `C = P ⊕ K`. To decrypt, you compute `C ⊕ K`. That gives you `(P ⊕ K) ⊕ K`, which equals `P ⊕ (K ⊕ K)`, which equals `P ⊕ 0`, which equals P. You got your plaintext back.

In practice real XOR encryption needs a key as long as the plaintext and has to be truly random, which is hard to guarantee. But the core idea here shows up all over the place in real ciphers.

**Modulo Operation**

Modulo, written as % or mod, gives you the remainder after division. You probably learned this in school as the thing left over when division does not divide evenly.

Some examples:

- 25%5 = 0 (25 divided by 5 is 5 exactly, nothing left over)
- 23%6 = 5 (23 divided by 6 is 3, with 5 left over because 3×6=18 and 23-18=5)
- 23%7 = 2 (23 divided by 7 is 3, with 2 left over because 3×7=21 and 23-21=2)

One important thing about modulo: it is not reversible. If someone tells you `x%5 = 4`, there are infinite values of x that satisfy that. Could be 4, could be 9, could be 14, could be 5 million and 4. You cannot work backwards. This irreversibility is a feature in cryptography, not a bug. It is part of why certain operations are easy to compute but hard to reverse.

The result of `a%n` will always be somewhere between 0 and n-1. Never negative, never equal to or larger than the divisor.

For big number calculations the room suggests Python, which handles arbitrarily large integers natively. Handy to know.

**Question: What's 1001 ⊕ 1010?** `0011`

Work through it bit by bit: 1⊕1=0, 0⊕0=0, 0⊕1=1, 1⊕0=1.

**Question: What's 118613842%9091?** `3565`

Just punch that into Python: `118613842 % 9091`. Done.

**Question: What's 60%12?** `0`

60 divided by 12 is exactly 5. No remainder.

---

## Task 7 — Summary {#task-7}

That wraps up Cryptography Basics. It is genuinely a foundations room, not a deep dive, so do not expect to walk away being able to implement anything. What you should have now is a solid mental model of why cryptography exists, what the core vocabulary means, how the simplest ciphers work, and what the difference is between symmetric and asymmetric encryption.

The next room in the series is Public Key Cryptography Basics, which gets into the actual asymmetric cryptosystems like RSA, Diffie-Hellman, and ECC in detail. That is where it starts getting interesting.

Quick recap of everything covered:

- **Plaintext** is the original data before encryption
- **Ciphertext** is the scrambled result after encryption
- **Cipher** is the algorithm used to encrypt and decrypt
- **Key** is the secret value the cipher uses
- **Caesar Cipher** shifts letters by a fixed number, has only 25 possible keys, completely breakable
- **Symmetric encryption** uses one key for both encrypt and decrypt, same key must be shared securely (DES, 3DES, AES)
- **Asymmetric encryption** uses a public key to encrypt and a private key to decrypt, public key can be shared freely (RSA, Diffie-Hellman, ECC)
- **XOR** returns 1 when bits differ, 0 when they match, useful in cryptography because of its reversibility properties
- **Modulo** gives the remainder of division, irreversible, shows up constantly in cryptographic algorithms

---