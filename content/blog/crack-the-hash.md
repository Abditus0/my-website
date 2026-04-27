---
title: "Crack the Hash"
date: 2026-04-27
category: "ctf"
excerpt: "Walkthrough of the TryHackMe Crack the Hash challenge - Cracking hashes challenges"
image: "/images/blog/100.png"
readtime: "20 min read"
draft: false
---

# Crack the Hash

This one is purely about hash cracking. I wanted to do this room specifically because I have been practicing with different tools like `john`, `hashcat`, and online crackers, and I wanted to see how far I could get with what I already know.

There are two tasks. Task 1 is the easier set and you could blast through all of them with an online tool in about two minutes. But that is not the point. I am going to use `john the ripper` for most of them to actually practice the workflow.

---

## Task 1

### Hash 1

`48bb6e862e54f2a795ffc4e541caed4d`

First thing is figuring out what type of hash this is. There is a tool for that called `hash-identifier`. It is just a python script. Grab it with:

```bash
wget https://gitlab.com/kalilinux/packages/hash-identifier/-/raw/kali/master/hash-id.py
```

Then run it:

```bash
python3 hash-id.py
```

It gives you a ranked list of the most likely hash types. The first ones at the top are the most probable.

![](/images/blog/crack-the-hash/1.png)

For this hash it comes back as MD5.

Now I need to know exactly how `john` wants to handle MD5. You can check all supported formats with:

```bash
john --list=formats | grep -iF "MD5"
```

![](/images/blog/crack-the-hash/2.png)

For a plain MD5 hash the format is `raw-md5`. This step feels like extra work when you are starting out but when hashes get more complex it saves you a lot of headaches. Just make it a habit.

Now put the hash in a file:

```bash
nano hash1.txt
```

Paste the hash in, save, and run:

```bash
john --format=raw-md5 --wordlist=/usr/share/wordlists/rockyou.txt hash1.txt
```

![](/images/blog/crack-the-hash/3.png)

Cracked. The answer is `easy`.

Quick note on the syntax since I am already here: the format flag tells john exactly what it is dealing with, the wordlist is the standard rockyou.txt which covers most common passwords, and at the end you feed it the file with the hash. I have a dedicated room walkthrough for john if you want to go deeper on how it works. Once you run a few hashes through it the pattern clicks.

### Hash 2

`CBFDAC6008F9CAB4083784CBD1874F76618D2A97`

Same process. Run hash-identifier and this one comes back as SHA-1.

![](/images/blog/crack-the-hash/4.png)

Find the format john wants:

```bash
john --list=formats | grep -iF "SHA1"
```

![](/images/blog/crack-the-hash/5.png)

I skipped the dash when searching because john is a bit funny about dashes in format names and it does not always match cleanly. The format comes back as `raw-sha1`.

Create a file, paste the hash in, run john:

```bash
john --format=raw-sha1 --wordlist=/usr/share/wordlists/rockyou.txt hash2.txt
```

![](/images/blog/crack-the-hash/6.png)

Answer is `password123`.

### Hash 3

`1C8BFE8F801D79745C4631D09FFF36C82AA37FC4CCE4FC946683D7B336B63032`

Same exact flow again. Hash-identifier says SHA-256. Check how john wants it formatted, it is `raw-sha256`. Create a file, run john, get the answer.

![](/images/blog/crack-the-hash/7.png)

Answer is `letmein`.

### Hash 4

`$2y$12$Dwt1BZj6pcyc3Dy1FWZ5ieeUznr71EeNkJkUlypTsgbX1H68wsRom`

This one is different. I ran hash-identifier and it could not find any matches.

![](/images/blog/crack-the-hash/8.png)

So I took it to [Hashes.com](https://hashes.com) which has a massive database and is pretty good at identifying formats. It came back as `bcrypt $2*$, Blowfish (Unix)`.

![](/images/blog/crack-the-hash/9.png)

I tried running john on it. I also tried hashcat. Both of them were very slow. Bcrypt is designed to be slow, that is the whole point of it, so brute forcing it locally on a VM without a GPU is not really practical.

Went back to Hashes.com, fed it the hash, got the answer in about a second.

![](/images/blog/crack-the-hash/10.png)

Answer is `bleh`.

### Hash 5

`279412f945939ba78ce0758d3fd83daa`

Threw this one at Hashes.com too since I was already there. Got a hit immediately.

![](/images/blog/crack-the-hash/11.png)

Answer is `Eternity22`.

---

**Task 1 answers:**

**48bb6e862e54f2a795ffc4e541caed4d** `easy`

**CBFDAC6008F9CAB4083784CBD1874F76618D2A97** `password123`

**1C8BFE8F801D79745C4631D09FFF36C82AA37FC4CCE4FC946683D7B336B63032** `letmein`

**$2y$12$Dwt1BZj6pcyc3Dy1FWZ5ieeUznr71EeNkJkUlypTsgbX1H68wsRom** `bleh`

**279412f945939ba78ce0758d3fd83daa** `Eternity22`

---

## Task 2

Difficulty goes up here. I assumed the online tools would stop working but the first two hashes went straight into Hashes.com and came back with hits no problem.

`F09EDCB1FCEFC6DFB23DC3505A882655FF77375ED8AA2D1C13F640FCCC2D0C85` cracked to `paule`

`1DFECA0C002AE40B8619ECF94819CC1B` cracked to `n63umy8lkf4i`

The last two are salted hashes and that is where it gets more interesting. Online tools can still handle these but you need to be careful. When searching on Hashes.com you do not include the salt separately because it is already embedded in the hash. Just paste the hash as is. Also worth noting: the fourth hash has a `.` at the end. That is not punctuation, that is part of the hash. Do not leave it out.

### Hash 3 (salted)

`$6$aReallyHardSalt$6WKUTqzq.UQQmrm0p/T7MPpMbGNnzXPMAXi4bJMl9be.cfi3/qxIf.hsGpS41BqMhSrHVXgMpdjS6xeKZAs02.`

Salt: `aReallyHardSalt`

For this one I used hashcat. The salt is already embedded inside the hash string so I just put the full hash into a file and ran:

```bash
hashcat -m 1800 hash.txt /usr/share/wordlists/rockyou.txt
```

Mode 1800 is for sha512crypt which is what this format is. Let it run and it came back with `waka99`.

### Hash 4 (salted)

`e5d8870e5bdd26602cab8dbe07a942c8669e56d6`

Salt: `tryhackme`

This one is different from the previous because the salt is not embedded in the hash. I have to manually combine them before feeding it to hashcat. The format hashcat expects is `hash:salt` so the file should contain:

```
e5d8870e5bdd26602cab8dbe07a942c8669e56d6:tryhackme
```

Then run:

```bash
hashcat -m 160 hash.txt /usr/share/wordlists/rockyou.txt
```

Mode 160 is HMAC-SHA1 with the salt appended. Got the answer `481616481616`.

---

**Task 2 answers:**

**F09EDCB1FCEFC6DFB23DC3505A882655FF77375ED8AA2D1C13F640FCCC2D0C85** `paule`

**1DFECA0C002AE40B8619ECF94819CC1B** `n63umy8lkf4i`

**$6$aReallyHardSalt$6WKUTqzq.UQQmrm0p/T7MPpMbGNnzXPMAXi4bJMl9be.cfi3/qxIf.hsGpS41BqMhSrHVXgMpdjS6xeKZAs02.** `waka99`

**e5d8870e5bdd26602cab8dbe07a942c8669e56d6** `481616481616`

---

## Takeaway

Good room for building the muscle memory around hash cracking. The workflow with john is pretty straightforward once you do it a few times: identify the hash, find the right format, create a file, run it. The format step feels annoying at first but it is worth doing properly.

The bcrypt hash was the one that reminded me that not everything is going to fall to a wordlist on your local machine. Some hashes are just slow by design and if you do not have a GPU you are better off checking a database than waiting for hours.

The difference between a salt being embedded versus having to add it manually is easy to miss if you are not paying attention, and hashcat will just give you nothing if you get it wrong.

Decent room overall.

---
