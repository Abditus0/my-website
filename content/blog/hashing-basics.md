---
title: "Hashing Basics — TryHackMe Cyber Security 101"
date: 2026-04-25
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Hashing Basics room — Learn about hashing functions and their uses in password verification and file integrity checking."
image: "/images/blog/94.png"
readtime: "32 min read"
draft: false
---

# Hashing Basics

This is the third and last cryptography room in the series. The previous two rooms kept talking about hashing without fully explaining it. Things like "the hash of a document" or "hash values" kept popping up and the rooms just moved on. This room finally fills that gap.

If you skipped the first two rooms, go back. This one assumes you know what symmetric encryption, asymmetric encryption, and digital signatures are.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Hash Functions](#task-2)
- [Task 3 — Insecure Password Storage for Authentication](#task-3)
- [Task 4 — Using Hashing for Secure Password Storage](#task-4)
- [Task 5 — Recognising Password Hashes](#task-5)
- [Task 6 — Password Cracking](#task-6)
- [Task 7 — Hashing for Integrity Checking](#task-7)
- [Task 8 — Conclusion](#task-8)

---

## Task 1 — Introduction {#task-1}

The room opens with a pretty practical scenario. You just downloaded a 6 GB file. How do you know the copy you got is exactly the same as the original, bit for bit? What if someone handed you that file on a USB drive? How do you know nothing was changed or swapped out?

The answer is hash values. You compare the hash of what you have to the hash of the original. If they match, you can say with very high confidence the files are identical.

A hash value is a fixed-size string of characters produced by a hash function. You feed the hash function any input, any size at all, and it spits out an output of fixed length every time. That output is the hash value.

One small terminology note the room makes: hash function and hash value are the preferred terms, but you will also see hash used as a verb (to hash something) and as a noun on its own meaning the hash value. Just something to keep in mind so you don't get confused when reading other stuff.

---

## Task 2 — Hash Functions {#task-2}

**What is a Hash Function?**

Hashing is not encryption. That is probably the most important thing to get straight right away. There is no key. There is no way to reverse the process and get back to the original input from the output. You go in one direction only.

A hash function takes input data of any size and produces a fixed-size summary of that data, sometimes called a digest. A good hash function has a few properties. It should be fast to compute. It should be practically impossible to reverse. Any tiny change in the input, even flipping a single bit, should cause a completely different output. And the same input should always produce the same output.

The room shows a really clean example of that last point. Two files, one containing the letter T and one containing the letter U. T is `54` in hex and U is `55` in hex. They differ by exactly one bit. But if you run MD5, SHA1, or SHA-256 on both files, the hashes look completely different. Not slightly different. Completely. That is the whole point.

```bash
strategos@g5000 ~> md5sum *.txt
b9ece18c950afbfa6b0fdbfa4ff731d3  file1.txt
4c614360da93c0a041b22e537de151eb  file2.txt
strategos@g5000 ~> sha1sum *.txt
c2c53d66948214258a26ca9ca845d7ac0c17f8e7  file1.txt
b2c7c0caa10a0cca5ea7d69e54018ae0c0389dd6  file2.txt
strategos@g5000 ~> sha256sum *.txt
e632b7095b0bf32c260fa4c539e9fd7b852d0de454e9be26f24d0d6f91d069d3  file1.txt
a25513c7e0f6eaa80a3337ee18081b9e2ed09e00af8531c8f7bb2542764027e7  file2.txt
```

One bit difference in the input. Completely different outputs. That behavior is called the avalanche effect and it matters a lot for security.

The output of a hash function is raw bytes, which then get encoded so you can actually read and write them. The most common encoding you will see is hexadecimal, which is what `md5sum`, `sha1sum`, `sha256sum`, and `sha512sum` all use. Each raw byte becomes two hex digits, so a 16-byte MD5 output becomes 32 hex characters.

**Why Is Hashing Important?**

More than you probably realize. Every time you log into a website, hashing is involved. A properly built server never actually stores your password. It stores the hash of your password. When you log in, it hashes what you typed and compares it to the stored hash. If they match, you're in. The actual password never has to be stored anywhere.

Same thing when you log into your computer. Hashing is happening quietly in the background constantly.

**What is a Hash Collision?**

A hash collision is when two different inputs produce the same output. This is something hash functions are specifically designed to avoid and make as hard as possible to engineer intentionally.

But here is the unavoidable math problem. Hash functions produce a fixed number of possible outputs. You can feed them an unlimited number of different inputs. So at some point, two different inputs have to land on the same output. This is called the pigeonhole effect. If you have 21 pigeons and only 16 pigeonholes, some pigeons are sharing. There is no way around it.

A 4-bit hash only has 16 possible outputs. A real hash function producing 256 bits has 2^256 possible outputs, which is an astronomically large number, so collisions are still theoretically possible but practically irrelevant for a good algorithm.

MD5 and SHA1 are no longer good algorithms for this. Both have been broken in the sense that researchers figured out how to engineer collisions on purpose. You can see an MD5 collision example on the MD5 Collision Demo page and read about the SHA1 collision attack at Shattered. The takeaway is do not use either of these for hashing passwords or sensitive data.

**Question: What is the SHA256 hash of the passport.jpg file in ~/Hashing-Basics/Task-2?** `77148c6f605a8df855f2b764bcc3be749d7db814f5f79134d2aa539a64b61f02`

**Question: What is the output size in bytes of the MD5 hash function?** `16`

**Question: If you have an 8-bit hash output, how many possible hash values are there?** `256`

---

## Task 3 — Insecure Password Storage for Authentication {#task-3}

This task is specifically about passwords used for logging in, not password managers. The distinction matters. A password manager needs to give you back your actual password in plain text. An authentication system just needs to verify that you know the password. Those are two completely different problems.

**Storing Passwords in Plaintext**

This is as bad as it sounds. If your database leaks, every single password is just sitting there readable. No effort required from an attacker at all.

The famous example here is RockYou. They were a company that made social media widgets and stored their user passwords in plaintext. They had a data breach. The result is the `rockyou.txt` file that now ships with Kali Linux and basically every offensive security toolkit. Over 14 million passwords in a plain text file. If you have done any CTF work at all, you have already used this file without necessarily knowing the story behind it.

```bash
strategos@g5000 /usr/share/wordlists> wc -l rockyou.txt 
14344392 rockyou.txt
strategos@g5000 /usr/share/wordlists> head rockyou.txt 
123456
12345
123456789
password
iloveyou
princess
1234567
rockyou
12345678
abc123
```

**Using an Insecure Encryption Algorithm**

Adobe did something different and somehow managed to make it worse. Instead of hashing passwords, they encrypted them using a deprecated algorithm. On top of that, they stored password hints in plain text, and some users had just put their actual password as the hint. So the hints gave away the passwords directly. Genuinely impressive failure.

**Using an Insecure Hash Function**

LinkedIn got hit in 2012. They were hashing passwords with SHA-1, which as we just covered is not collision-resistant anymore. They also were not salting the passwords, which is a separate problem the next task explains. The combination of a weak algorithm and no salting meant the breach was very recoverable for attackers.

**Question: What is the 20th password in `rockyou.txt`?** `qwerty`

---

## Task 4 — Using Hashing for Secure Password Storage {#task-4}

So you hash the password instead of storing it. Great. But there is a problem that comes up immediately. What happens when two users pick the same password? Their hashes will be identical. If an attacker cracks one, they crack both. And if they have a pre-built lookup table of hashes to passwords, they can skip the cracking part entirely.

That lookup table is called a Rainbow Table. It trades disk space for speed. Instead of computing hashes on the fly, you just look up the hash you have and find the matching password in the table. Sites like CrackStation and Hashes.com do exactly this with enormous pre-built tables. If the hash has no salt, these sites will often crack it in seconds.

**Salting**

The fix is a salt. A salt is a random value that gets added to the password before hashing. It is stored in the database alongside the hash. It does not need to be secret.

The point of the salt is not secrecy. The point is uniqueness. Even if two users have the exact same password, their salts will be different, so their hashes will be different. That kills rainbow tables entirely because any pre-computed table would need to be rebuilt from scratch for every individual salt value.

Modern hashing algorithms like Bcrypt, Scrypt, Argon2, and PBKDF2 handle salting automatically. If you are implementing something from scratch, you should be using one of these rather than trying to implement salting yourself on top of SHA-256 or something.

A secure password storage flow looks like this. Pick a secure algorithm like Argon2 or Bcrypt. Generate a unique random salt for each user. Concatenate the password and the salt. Hash the combined string. Store the hash and the salt together.

The reason you cannot just encrypt passwords instead of hashing them is that encryption requires storing a key. If someone gets the key, they decrypt everything. Hashing avoids that problem entirely since there is nothing to reverse.

**Question: Manually check the hash “4c5923b6a6fac7b7355f53bfe2b8f8c1” using the rainbow table above.** `inS3CyourP4$$`

**Question: Crack the hash “5b31f93c09ad1d065c0491b764d04933” using an online tool.** `tryhackme`

**Question: Should you encrypt passwords in password-verification systems? Yea/Nay** `Nay`

---

## Task 5 — Recognising Password Hashes {#task-5}

Now we flip to the offensive side. If you find a hash somewhere, how do you figure out what type it is so you can try to crack it?

There are automated tools like hashID that try to identify hash types but the room is pretty honest about them: they are unreliable for a lot of formats. The smarter approach is context plus tools. If you pulled a hash from a web application database, it is more likely MD5 than NTLM. If you pulled it from a Windows machine, NTLM is more likely. Context matters more than the tool's guess.

**Linux Passwords**

On Linux, password hashes live in `/etc/shadow`, which is only readable by root. They used to be in `/etc/passwd` which anyone could read, but that got fixed a long time ago.

Each line in the shadow file has nine colon-separated fields. The first field is the username, the second is the hashed password. The hash field has four parts separated by `$` signs in the format `$prefix$options$salt$hash`.

The prefix tells you exactly which algorithm was used. The room lists these in order from strongest to weakest:

- `$y$` is yescrypt, the current default on modern Linux systems
- `$gy$` is gost-yescrypt
- `$7$` is scrypt
- `$2b$`, `$2y$`, `$2a$`, `$2x$` are all bcrypt variants
- `$6$` is sha512crypt, still very common on older Linux systems
- `$md5` is SunMD5 from Solaris
- `$1$` is md5crypt, very old

A real example from a modern shadow file looks like this:

```bash
strategos:$y$j9T$76UzfgEM5PnymhQ7TlJey1$/OOSg64dhfF.TigVPdzqiFang6uZA4QA1pzzegKdVm4:19965:0:99999:7:::
```

Breaking down that second field: `y` is the algorithm (yescrypt), `j9T` is a parameter passed to it, `76UzfgEM5PnymhQ7TlJey1` is the salt, and `/OOSg64dhfF.TigVPdzqiFang6uZA4QA1pzzegKdVm4` is the actual hash value.

**Windows Passwords**

Windows hashes passwords with NTLM, which is a variant of MD4. The annoying thing is that NTLM hashes look exactly like MD4 and MD5 hashes visually. Same format, same length. You have to rely on context to tell them apart. Automated tools get this wrong a lot.

Windows stores these hashes in the SAM (Security Accounts Manager). Windows does try to block access to it, but tools like mimikatz exist specifically to get around that. The hashes in the SAM are split into NT hashes and LM hashes.

For finding more hash formats and their prefixes, the Hashcat Example Hashes page is the best reference. It has basically everything with mode numbers ready to go. You will use this site a lot.

**Question: What is the hash size in yescrypt?** `256`

**Question: What's the Hash-Mode listed for Cisco-ASA MD5?** `2410`

**Question: What hashing algorithm is used in Cisco-IOS if it starts with `$9$`?** `scrypt`

---

## Task 6 — Password Cracking {#task-6}

Rainbow tables are off the table once salts are involved. So how do you crack a salted hash?

The answer is you just hash a lot of guesses. You take a wordlist, hash each word with the same algorithm and the same salt if one exists, and compare the result to your target hash. When they match, you found the password. That is it. Brute force, but smart brute force with a good wordlist.

The two main tools for this are Hashcat and John the Ripper.

**GPUs vs CPUs**

Modern GPUs have thousands of cores designed for parallel math operations, which makes them very good at calculating hashes fast. Cracking on a GPU is massively faster than on a CPU for most hash types. Some algorithms like Bcrypt are specifically designed to get no speed benefit from GPU cracking, which is part of why they are recommended for passwords.

The catch is Virtual Machines. They usually cannot access the host's GPU. You can sometimes set it up but it is a pain. If you are using Hashcat, run it on your host OS directly if you can. John the Ripper uses the CPU by default and works fine inside a VM, though you will still get better performance on bare metal.

**Hashcat Syntax**

The basic format is:

```bash
hashcat -m <hash_type> -a <attack_mode> hashfile wordlist
```

Where `-m` is the hash type as a number (check the Hashcat example hashes page for these), `-a 0` is the straight attack mode which just tries each word in the list one by one, `hashfile` is a text file containing your target hash, and `wordlist` is your password list.

For example:

```bash
hashcat -m 3200 -a 0 hash.txt /usr/share/wordlists/rockyou.txt
```

That runs a Bcrypt crack against rockyou.txt. You will spend a lot of time looking up those `-m` numbers. Bookmarking the Hashcat example hashes page saves a lot of frustration.

**Question: Use `hashcat` to crack the hash, `$2a$06$7yoU3Ng8dHTXphAg913cyO6Bjs3K5lBnwq5FJyA6d01pMSrddr1ZG`, saved in `~/Hashing-Basics/Task-6/hash1.txt`.** `85208520`

**Question: Use `hashcat` to crack the SHA2-256 hash, `9eb7ee7f551d2f0ac684981bd1f1e2fa4a37590199636753efe614d4db30e8e1`, saved in saved in `~/Hashing-Basics/Task-6/hash2.txt`.** `halloween`

**Question: Use `hashcat` to crack the hash, `$6$GQXVvW4EuM$ehD6jWiMsfNorxy5SINsgdlxmAEl3.yif0/c3NqzGLa0P.S7KRDYjycw5bnYkF5ZtB8wQy8KnskuWQS3Yr1wQ0`, saved in `~/Hashing-Basics/Task-6/hash3.txt`.** `spaceman`

**Question: Crack the hash, `b6b0d451bbf6fed658659a9e7e5598fe`, saved in `~/Hashing-Basics/Task-6/hash4.txt`.** `funforyou`

---

## Task 7 — Hashing for Integrity Checking {#task-7}

Passwords are only one use case. The other big one is verifying that a file is exactly what it claims to be and has not been tampered with.

Because the same input always produces the same hash, and any change to the input produces a completely different hash, you can use hashing to verify files. Download a Linux ISO, run `sha256sum` on it, compare it to the hash the project posted on their website. If they match, the file is genuine. If they don't, something went wrong, either a corrupted download or something more concerning.

This is exactly what the Fedora checksum files do:

```bash
root@AttackBox# head Fedora-Workstation-40-1.14-x86_64-CHECKSUM
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

SHA256 (Fedora-Workstation-Live-x86_64-40-1.14.iso) = dd1faca950d1a8c3d169adf2df4c3644ebb62f8aac04c401f2393e521395d613
```

You can also use hashing to find duplicate files. Two files with the same hash are the same file. Useful if you are trying to clean up a drive full of copies.

**HMACs**

HMAC stands for Keyed-Hash Message Authentication Code. It is a way to use hashing to verify both the integrity and the authenticity of a message, not just the integrity.

A regular hash tells you the file has not changed. But it does not tell you who made the hash. Anyone could have hashed that file. HMAC fixes that by mixing a secret key into the process. If you and a server share a secret key, the server can create an HMAC of a message and send it along. You recalculate the HMAC on your end with the same key. If they match, you know the message came from someone who has the key and it was not modified in transit.

The formula behind it is:

```
HMAC(K, M) = H((K ⊕ opad) || H((K ⊕ ipad) || M))
```

Which looks intimidating but the idea is straightforward. The key gets mixed in twice using XOR operations with constants, wrapping the hash of the message. The result is a fixed-size authentication code that is meaningless to anyone who does not have the key.

**Question: What is SHA256 hash of libgcrypt-1.11.0.tar.bz2 found in `~/Hashing-Basics/Task-7`?** `09120c9867ce7f2081d6aaa1775386b98c2f2f246135761aae47d81f58685b9c`

**Question: What’s the hashcat mode number for `HMAC-SHA512 (key = $pass)`?** `1750`

---

## Task 8 — Conclusion {#task-8}

Last task, and it does something useful: it distinguishes between three things that people confuse constantly.

**Hashing** is one-way. You put data in, you get a fixed-size digest out, and there is no going back. Same input always gives the same output. Any change to the input gives a completely different output. Used for integrity verification and password storage.

**Encoding** is not one-way and it is not for security. It converts data from one format to another so different systems can handle it. ASCII, UTF-8, Base64, all of these are encoding. Anyone with the right tool can reverse it instantly. There is no key, no secret, nothing protecting it. Do not confuse encoding with encryption.

**Encryption** is two-way and is for security. You need a cipher and a key to encrypt and to decrypt. It protects confidentiality. Without the key, you cannot reverse it. That is the whole point.

The room shows a quick example of Base64, which is probably the encoding you will see most in CTFs:

```bash
strategos@g5000 ~> base64
TryHackMe
VHJ5SGFja01lCg==
strategos@g5000 ~> base64 -d
VHJ5SGFja01lCg==
TryHackMe
```

See that `==` at the end? That padding is a common giveaway that something is Base64 encoded. Whenever you see it in a CTF, just run `base64 -d` on it.

**Question: Use base64 to decode RU5jb2RlREVjb2RlCg==, saved as `decode-this.txt` in `~/Hashing-Basics/Task-8`. What is the original word?** `ENcodeDEcode` (You have to use online tool for this one)

---

That is the whole room done. The short version: hashing is one-way, encryption is two-way, encoding is neither. Hash passwords with something modern like Bcrypt or Argon2 and always use salts. MD5 and SHA1 are broken for security purposes, stop using them. Hashcat and John the Ripper are your main cracking tools and rockyou.txt is your best friend for wordlist attacks. And whenever you download something important, check the hash.

Next up is John the Ripper, which goes much deeper on the actual cracking side of things.

---