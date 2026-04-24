---
title: "Public Key Cryptography Basics — TryHackMe Cyber Security 101"
date: 2026-04-24
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Public Key Cryptography Basics room — Discover how public key ciphers such as RSA work and explore their role in applications such as SSH."
image: "/images/blog/93.png"
readtime: "25 min read"
draft: false
---

# Public Key Cryptography Basics

This is where things actually start connecting to stuff you use every day. SSH keys, HTTPS, encrypted emails, all of that runs on what this room covers.

The room is the second of three cryptography rooms. It picks up right where the last one left off, so if you skipped that one, go back and do it first. Seriously.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Common Use of Asymmetric Encryption](#task-2)
- [Task 3 — RSA](#task-3)
- [Task 4 — Diffie-Hellman Key Exchange](#task-4)
- [Task 5 — SSH](#task-5)
- [Task 6 — Digital Signatures and Certificates](#task-6)
- [Task 7 — PGP and GPG](#task-7)
- [Task 8 — Conclusion](#task-8)

---

## Task 1 — Introduction {#task-1}

The room opens with a pretty relatable scenario. You are sitting across from a business partner at a coffee shop, talking about confidential stuff. Think about what makes that conversation secure.

You can see the person, so you know they are actually your business partner and not someone pretending. That is **authentication**. You can hear the words coming out of their mouth, so you know nothing is changing those words mid-air between them and you. That is **integrity**. And you picked a quiet corner table and lowered your voice so the guy next to you cannot hear anything. That is **confidentiality**.

Now take that same conversation and move it online. Suddenly all three of those things become actual problems you have to solve. How do you know the person messaging you is who they say they are? How do you know the message was not changed somewhere between their phone and yours? How do you keep it private when it is travelling across a bunch of servers you have never heard of?

This is the whole reason public key cryptography exists. Symmetric encryption from the last room is great for keeping things confidential, but it does not do much for authentication or integrity. Asymmetric cryptography fills that gap.

This room covers RSA, Diffie-Hellman, SSH, TLS certificates, and GPG. That is a lot, but each piece fits into the others by the end.

---

## Task 2 — Common Use of Asymmetric Encryption {#task-2}

Here is something that might surprise you. Asymmetric encryption is actually kind of slow. Like, noticeably slow compared to symmetric encryption. So the internet does not just use asymmetric encryption for everything. That would be painful.

What it does instead is use asymmetric encryption to solve one specific problem: how do two strangers agree on a secret key without anyone watching being able to figure out what that key is? Once they have agreed on that key, they switch to symmetric encryption for the actual data because it is much faster.

The room uses a physical analogy. Say you want to send secret instructions to a friend but you do not want anyone else reading them. Your friend sends you a padlock that only they have the key for. You put the instructions in a box, lock it with that padlock, and send it over. Your friend unlocks it on their end. Done. Nobody intercepting that box can open it without the key, and your friend never had to send the key anywhere.

In crypto terms, the padlock is the server's public key and the key to open it is the server's private key. You encrypt your message with their public key, only they can decrypt it with their private key.

The catch the room mentions is that this still does not prove you are actually talking to the right person. What if someone intercepted the connection and sent you their padlock while pretending to be your friend? That is where digital signatures and certificates come in, which get covered later in the room.

**Question: In the analogy presented, what real object is analogous to the public key?** `lock`

---

## Task 3 — RSA {#task-3}

RSA is probably the most famous public key encryption algorithm and for good reason. It has been around since 1977 and it still holds up.

The whole security of RSA comes down to one math problem: factoring large numbers is hard. Multiplying two big prime numbers together is easy, even on paper. But if someone gives you the result and asks you to figure out which two primes were multiplied together, good luck. A computer can crack small examples instantly but once those prime numbers get big enough, like 300 digits each, even the most powerful computers alive today cannot factor the product in any reasonable amount of time.

The room walks through a simplified numerical example to show how RSA actually works step by step. If you don't understand the math here, don't worry, there are tools made for those calculations, just be familiar with the process because it comes up constantly in cybersecurity.

Bob picks two prime numbers, p = 157 and q = 199, and multiplies them to get n = 31243. He then calculates phi(n) which comes out to 30888, picks e = 163 as his public exponent, and figures out d = 379 as the private exponent. The public key is the pair (31243, 163) and the private key is (31243, 379).

Now Alice wants to send Bob the value 13. She calculates 13 to the power of 163, takes the modulo of 31243, and gets 16341. She sends that over. Bob takes 16341 to the power of 379, takes the modulo of 31243, and gets back 13. The original value. It works.

The math behind why this works gets into modular arithmetic which the room does not go deep on here. You do not need to fully understand the proof to use RSA or understand it conceptually.

For CTFs, RSA comes up pretty often. The key variables you need to know are p and q (the two prime numbers), n (their product), e (public exponent), d (private exponent), m (plaintext message), and c (ciphertext). CTF challenges usually give you some of these and ask you to figure out the rest or decrypt something. The room recommends RsaCtfTool for these challenges which is worth bookmarking.

**Question: Knowing that p = 4391 and q = 6659. What is n?** `29239669`

**Question: Knowing that p = 4391 and q = 6659. What is ϕ(n)?** `29228620`

---

## Task 4 — Diffie-Hellman Key Exchange {#task-4}

Okay so RSA is great but there is a specific problem it does not solve on its own. How do Alice and Bob agree on a shared secret when they have never talked before and everything they send each other can be seen by anyone watching?

Diffie-Hellman solves exactly that. It lets two parties independently generate a shared secret over a completely public channel without ever actually sending that secret across the channel. Someone watching every single message exchanged still cannot figure out the shared secret. It sounds like magic the first time you hear it and honestly it kind of is.

The room walks through the math with small numbers to make it followable.

Alice and Bob first agree publicly on two numbers: a large prime p = 29 and a generator g = 3. These are public, anyone can know them.

Alice picks her private number a = 13 and calculates her public key: A = 3 to the power of 13, mod 29, which equals 19. Bob picks his private number b = 15 and calculates his public key: B = 3 to the power of 15, mod 29, which equals 26. They send these public keys to each other.

Now here is where it gets clever. Alice takes Bob's public key and raises it to her private number: 26 to the power of 13, mod 29, which equals 10. Bob takes Alice's public key and raises it to his private number: 19 to the power of 15, mod 29, which also equals 10. Both of them landed on the same number 10 without ever sending it. That is the shared secret.

Someone watching the whole thing saw p, g, A, and B. But figuring out a or b from that information is the discrete logarithm problem, which is computationally brutal for large numbers.

In practice, Diffie-Hellman is often paired with RSA. Diffie-Hellman handles the key agreement part and RSA handles digital signatures to make sure you are actually talking to who you think you are. Together they cover the bases.

**Question: Consider p = 29, g = 5, a = 12. What is A?** `7`

**Question: Consider p = 29, g = 5, b = 17. What is B?** `9`

**Question: Knowing that p = 29, a = 12, and you have B from the second question, what is the key calculated by Bob? (key = Ba mod p)** `24`

**Question: Knowing that p = 29, b = 17, and you have A from the first question, what is the key calculated by Alice? (key = Ab mod p)** `24`

---

## Task 5 — SSH {#task-5}

If you have ever connected to a remote machine over SSH, you have already been using asymmetric cryptography without thinking about it much. This task explains what is happening under the hood.

**Authenticating the Server**

The first thing SSH does when you connect somewhere new is show you something like this:

```bash
root@TryHackMe# ssh 10.10.244.173
The authenticity of host '10.10.244.173 (10.10.244.173)' can't be established.
ED25519 key fingerprint is SHA256:lLzhZc7YzRBDchm02qTX0qsLqeeiTCJg5ipOT0E/YM8.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.10.244.173' (ED25519) to the list of known hosts.
```

Most people just type yes and move on without reading it. But what this is actually doing is asking you to verify the server's public key fingerprint. The reason it asks is that a man-in-the-middle could have intercepted your connection and be pretending to be the server. If you confirm the fingerprint and say yes, your SSH client saves that key. Next time you connect, it will check automatically and warn you if the key has changed, which would be a big red flag.

**Authenticating the Client**

Once the server is verified, you need to prove you are allowed in. Most people are familiar with password login but SSH key authentication is way better from a security standpoint.

With key authentication, you generate a key pair on your own machine. The public key goes onto the server in a file called `authorized_keys`. The private key never leaves your machine. When you connect, the server challenges you in a way that only someone with the matching private key can answer correctly. No password ever gets sent.

You generate keys with `ssh-keygen`. The room covers the different key types: DSA, ECDSA, ECDSA-SK, Ed25519, and Ed25519-SK. You do not need to memorise all of them right now, just know they exist and have different properties.

One thing the room is pretty firm about: treat your private key like a password. Actually treat it better than most passwords. If someone gets your private key they can log in to any server that has your public key, unless you set a passphrase on the key itself. The passphrase never leaves your machine and just decrypts the key locally, it is not sent to the server.

File permissions matter too. Your private key file needs to be set to 600 or stricter. If the permissions are too open, SSH will refuse to use it and just sit there with a warning.

**Question: Check the SSH Private Key in ~/Public-Crypto-Basics/Task-5. What algorithm does the key use?** `RSA`

---

## Task 6 — Digital Signatures and Certificates {#task-6}

You know how when you sign a paper document, it proves you agreed to something or that the document came from you? Digital signatures do the same thing but in a way that is verifiable and cannot be faked by just copying and pasting an image of your signature.

Here is how a digital signature works. Bob wants to send Alice a document and prove it came from him. He takes a hash of the document (a short fingerprint of its contents, more on hashing in the next room) and encrypts that hash with his private key. He sends Alice both the document and the encrypted hash. Alice decrypts the hash with Bob's public key and compares it to a hash she calculates herself from the document. If they match, two things are confirmed: the document came from Bob because only he has his private key, and the document was not changed in transit because any change would alter the hash.

This is where integrity and authenticity both come from in practice.

**Certificates**

Now the question is, how does your browser know that the public key it received actually belongs to the real tryhackme.com and not some attacker who got in the middle?

The answer is certificates. When you visit a website over HTTPS, the server presents a certificate that says who it is and contains its public key. That certificate was signed by a Certificate Authority (CA). Your browser comes pre-loaded with a list of CAs it trusts. If the certificate was signed by one of those trusted CAs, and the signature checks out, your browser trusts the certificate and therefore the server.

It is a chain. The website trusts the CA, your browser trusts the CA, so your browser trusts the website. If anything in that chain breaks or gets tampered with, your browser throws a warning.

If you have a domain and want HTTPS, you can get a free TLS certificate from Let's Encrypt. No reason not to at this point.

**Question: What does a remote web server use to prove itself to the client?** `certificate`

**Question: What would you use to get a free TLS certificate for your website?** `Let's Encrypt`

---

## Task 7 — PGP and GPG {#task-7}

PGP stands for Pretty Good Privacy which is one of the best names for a piece of software. It is used for encrypting files and doing digital signatures. GPG (GnuPG) is the open source version that implements the same standard and is what you will actually be running on Linux.

GPG comes up a lot with email encryption. You generate a key pair, share your public key with whoever wants to send you stuff, and they encrypt their messages to you with it. Only your private key can decrypt them. You can also sign messages with your private key so recipients can verify the message actually came from you.

Generating a GPG key pair looks like this:

```bash
gpg --full-gen-key
```

It walks you through choosing an algorithm (ECC with Curve 25519 is the default and a solid choice), setting an expiry date, and adding your name and email to the key so people know it belongs to you.

For CTFs, the most common scenario is that you get a GPG encrypted file and either a key file or have to crack the passphrase with John the Ripper using `gpg2john`. The room's practical example skips the passphrase, which makes the decryption straightforward.

To import a key and decrypt a file:

```bash
gpg --import backup.key
gpg --decrypt confidential_message.gpg
```

That is it. If the key is already in your keyring and matches the file, it just decrypts.

**Question: Use GPG to decrypt the message in ~/Public-Crypto-Basics/Task-7. What secret word does the message hold?** `Pineapple`

---

## Task 8 — Conclusion {#task-8}

That is the room done. It covered a lot of ground but it all fits together into one picture. Asymmetric encryption lets strangers share secrets safely. RSA and Diffie-Hellman are the two big algorithms that make that work. SSH uses all of this under the hood for both server and client authentication. Certificates solve the problem of proving identity over the web. And GPG brings all of this to files and emails.

The room also quietly introduces two terms worth knowing for later. Cryptanalysis is the study of breaking or bypassing cryptographic systems. A brute force attack tries every possible key or password. A dictionary attack is smarter and just tries words from a wordlist since most people use real words as passwords anyway.

Quick recap of everything:

- **RSA** is based on the difficulty of factoring large numbers, uses a public key for encryption and private key for decryption
- **Diffie-Hellman** lets two parties create a shared secret over a public channel without ever sending the secret itself
- **SSH** uses asymmetric crypto to verify the server and optionally to authenticate the client with key pairs instead of passwords
- **Certificates** are signed by Certificate Authorities and let browsers verify they are talking to the real server
- **GPG** is the open source tool for encrypting files and signing things with public key cryptography
- **Cryptanalysis** is breaking crypto, brute force tries everything, dictionary attacks try likely passwords

Next up is Hashing Basics, which fills in the last missing piece since hashes kept coming up throughout this room without being fully explained yet.

---