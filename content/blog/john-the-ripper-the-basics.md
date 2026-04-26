---
title: "John the Ripper: The Basics — TryHackMe Cyber Security 101"
date: 2026-04-26
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's John the Ripper room — Learn how to use John the Ripper, a powerful and adaptable hash-cracking tool."
image: "/images/blog/95.png"
readtime: "45 min read"
draft: false
---

# John the Ripper: The Basics

If you went through the cryptography series before this, you already know what hashing is, and why MD5 and SHA1 are basically retired at this point. This room is where that knowledge becomes useful. We are not just learning what hashes are anymore. We are cracking them.

John the Ripper is the tool for this. It has been around forever, it supports a ridiculous number of hash types, and it is fast. If you have done any CTF work before, you have probably already heard the name.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Basic Terms](#task-2)
- [Task 3 — Setting Up Your System](#task-3)
- [Task 4 — Cracking Basic Hashes](#task-4)
- [Task 5 — Cracking Windows Authentication Hashes](#task-5)
- [Task 6 — Cracking /etc/shadow Hashes](#task-6)
- [Task 7 — Single Crack Mode](#task-7)
- [Task 8 — Custom Rules](#task-8)
- [Task 9 — Cracking Password Protected Zip Files](#task-9)
- [Task 10 — Cracking Password Protected RAR Archives](#task-10)
- [Task 11 — Cracking SSH Keys with John](#task-11)
- [Task 12 — Further Reading](#task-12)

---

## Task 1 — Introduction {#task-1}

The room is straightforward about what it covers. You are going to learn how to use John the Ripper to crack:

- Windows authentication hashes
- `/etc/shadow` hashes from Linux
- Password-protected Zip files
- Password-protected RAR files
- SSH private keys

Starting from Task 4 onward you need an actual machine to work on. You can use the attached VM, the AttackBox, or your own setup. The room also lets you download all the task files as a single zip if you want to work locally.

---

## Task 2 — Basic Terms {#task-2}

The room does a quick review of hashing before getting into anything practical, since it is the foundation of everything John does.

**What are Hashes?**

A hash takes data of any length and produces a fixed-length output. The original value gets masked in the process. Common algorithms include MD4, MD5, SHA1, and NTLM.

The room gives two examples with MD5. The string "polo" hashes to `b53759f3ce692de7aff1b5779d3964da`. The string "polomints" hashes to `584b6e4f4586e136bc280f27f9c64f3b`. Different lengths going in, same length coming out. That is the point.

**What Makes Hashes Secure?**

Hash functions are designed to only go one way. It is easy to compute the hash of a given input, but working backwards from the hash to find the original input is computationally hard. The room brings up P vs NP here, which is a whole mathematical rabbit hole. The short version is that hashing is in the "P" category, meaning it is fast and solvable. Reversing it would be "NP", meaning nobody has found a fast way to do it and we do not know if one exists.

You do not need to deeply understand P vs NP to use John. Just know that you cannot reverse a hash directly.

**Where John Comes In**

You cannot reverse a hash, but you can guess. If you have a hash and you know the algorithm that produced it, you can hash a massive list of words and compare each result to your target. When one matches, you have found the original password. This is a dictionary attack, and it is exactly what John the Ripper does at speed.

**Question: What is the most popular extended version of John the Ripper?** `Jumbo John`

---

## Task 3 — Setting Up Your System {#task-3}

The room covers installation across different setups. If you are on the AttackBox, the attached VM, or Kali, John is already installed and you can skip ahead. To verify, just type `john` in the terminal and you should see a usage guide with a version line mentioning "jumbo-1".

For other Linux distros, you can install through the package manager with something like `sudo apt install john` on Ubuntu or `sudo dnf install john` on Fedora. The catch is that package manager versions often only include the core version, not Jumbo John. If you need tools like `zip2john` and `rar2john`, which you will later in this room, you might need to build from source. The official install guide on GitHub has the full instructions.

For Windows, you download the zipped binary for either 64-bit or 32-bit from the Openwall site and extract it.

**Wordlists**

John needs something to compare hashes against, and that something is a wordlist. The room uses `rockyou.txt` for everything. It lives at `/usr/share/wordlists/rockyou.txt` on both the AttackBox and Kali. If you are on something else, you can grab it from the SecLists repository under `/Passwords/Leaked-Databases`. It might be compressed as `.tar.gz`, so extract it with `tar xvzf rockyou.txt.tar.gz`.

The story behind rockyou.txt is worth knowing. RockYou was a company that made social media widgets. In 2009 they had a data breach, and their passwords were stored in plain text, so the whole list just... leaked. Over 14 million real passwords in a text file. It is now the default wordlist for practically everything in offensive security.

**Question: Which website’s breach was the `rockyou.txt` wordlist created from?** `rockyou.com`

---

## Task 4 — Cracking Basic Hashes {#task-4}

Now things get practical.

**Basic Syntax**

```bash
john [options] [file path]
```

That is it. You point John at a file containing a hash and tell it what to do with it.

**Automatic Cracking**

John can try to figure out the hash type on its own. It does not always get it right, but if you are stuck on what format you are dealing with, it is worth a shot.

```bash
john --wordlist=/usr/share/wordlists/rockyou.txt hash_to_crack.txt
```

`--wordlist=` tells John to use wordlist mode and points it at your list. No format flag means John is guessing.

**Identifying Hashes**

When auto-detection fails or you want to be sure, use a hash identifier. The room recommends hash-identifier, a Python tool. You can grab it with wget:

```bash
wget https://gitlab.com/kalilinux/packages/hash-identifier/-/raw/kali/master/hash-id.py
python3 hash-id.py
```

Paste your hash in and it gives you a list of what it probably is. You can also use online tools like hashes.com if you prefer.

**Format-Specific Cracking**

Once you know the format, tell John explicitly:

```bash
john --format=[format] --wordlist=[path to wordlist] [path to file]
```

For standard hash types like MD5, you need to prefix it with `raw-`:

```bash
john --format=raw-md5 --wordlist=/usr/share/wordlists/rockyou.txt hash_to_crack.txt
```

Not sure if you need the prefix? List all formats John knows and grep for yours:

```bash
john --list=formats | grep -iF "md5"
```

The task files are in `~/John-the-Ripper-The-Basics/Task04/`.

**Question: What type of hash is hash1.txt?** `md5`

**Question: What is the cracked value of hash1.txt?** `biscuit`

**Question: What type of hash is hash2.txt?** `sha1`

**Question: What is the cracked value of hash2.txt?** `kangeroo`

**Question: What type of hash is hash3.txt?** `sha256`

**Question: What is the cracked value of hash3.txt?** `microphone`

**Question: What type of hash is hash4.txt?** `whirlpool`

**Question: What is the cracked value of hash4.txt?** `colossal`

---

## Task 5 — Cracking Windows Authentication Hashes {#task-5}

NTHash, also called NTLM, is the format Windows uses to store passwords for user accounts and services. If you are on a penetration test and you manage to get access to a Windows machine with enough privileges, pulling these hashes is one of the first things you would try.

**NTHash / NTLM**

The NT in NTLM stands for New Technology, from back when Microsoft was releasing Windows NT as a new product line separate from MS-DOS. The name stuck around even after NT became the standard.

Windows stores these hashes in the SAM database, which stands for Security Account Manager. Tools like Mimikatz can dump them, or you can pull them from the Active Directory database file `NTDS.dit` if you are dealing with a domain environment.

One thing the room flags here: you do not always need to crack the hash to move forward. Sometimes you can do a "pass the hash" attack, which sends the hash directly without ever knowing the plain text password. But if the password is weak, cracking is absolutely viable.

The file for this task is `ntlm.txt` in `~/John-the-Ripper-The-Basics/Task05/`.

**Question: What do we need to set the `--format` flag to in order to crack this hash?** `nt`

**Question: What is the cracked value of this password?** `mushroom`

---

## Task 6 — Cracking /etc/shadow Hashes {#task-6}

On Linux, password hashes live in `/etc/shadow`. The file has one line per user and also stores things like when the password was last changed and when it expires. You need root or equivalent access to read it, but if you have that, there is a real chance you can crack what is inside.

**Unshadowing**

John needs the data in a specific format to work with shadow hashes. It cannot just take the shadow file on its own. It needs the `/etc/passwd` file combined with it, and you do that with a tool called `unshadow`.

```bash
unshadow [path to passwd] [path to shadow]
```

In practice:

```bash
unshadow local_passwd local_shadow > unshadowed.txt
```

You do not need the full files if you only care about one user. You can just put the relevant lines from each file into separate text files and run unshadow on those. For example, if you only want the root user, pull just the root lines from `/etc/passwd` and `/etc/shadow` into their own files.

**Cracking**

Then feed the output straight into John:

```bash
john --wordlist=/usr/share/wordlists/rockyou.txt --format=sha512crypt unshadowed.txt
```

The `--format=sha512crypt` flag might be necessary depending on the hash type in the shadow file.

The files for this task are in `~/John-the-Ripper-The-Basics/Task06/`. The file is called `etchashes.txt`.

**Question: What is the root password?** `1234`

---

## Task 7 — Single Crack Mode {#task-7}

Wordlist mode is great when the password is something a real human would use and it happens to be in rockyou.txt. But what about passwords that are based on the username? That is where Single Crack mode comes in.

**Word Mangling**

Single Crack mode does not use a wordlist at all. Instead, John takes the username you give it and generates guesses by slightly mutating it. If the username is "Markus", John will try things like Markus1, Markus2, MArkus, MARKus, Markus!, Markus$, and so on. This is called word mangling.

The idea behind it is that people are lazy. A very common pattern is to just take your name or username, maybe capitalize it, add a number, and call it a day. Single Crack mode exploits that.

**GECOS**

John also knows about the GECOS field in UNIX systems. In `/etc/passwd`, fields are separated by colons. The fifth field is GECOS, which can store things like a user's full name, office number, and phone number. John can read that information and add it to the wordlist it generates, so if someone used their full name as part of their password, there is a decent chance Single Crack mode finds it.

**Using Single Crack Mode**

```bash
john --single --format=[format] [path to file]
```

One important thing: the file format changes for Single Crack mode. You need to prepend the hash with the username followed by a colon. So if your file contains just the hash:

```bash
1efee03cdcb96d90ad48ccc7b8666033
```

You need to change it to:

```bash
mike:1efee03cdcb96d90ad48ccc7b8666033
```

Otherwise John has nothing to mangle from and the mode is useless.

For this task the user is called Joker. The file is in `~/John-the-Ripper-The-Basics/Task07/`. Edit the hash file to prepend `joker:` before the hash, then run it in single mode.

**Question: What is Joker's password?** `Jok3r`

---

## Task 8 — Custom Rules {#task-8}

This task is one of the more interesting ones because it is less about using a tool and more about thinking like the person who set the password.

**The Problem with Password Complexity Requirements**

Most organizations force users to include an uppercase letter, a number, and a symbol. The intention is good. The result is that almost everyone does the exact same thing: capitalize the first letter, write the word, then stick a number and a symbol on the end.

`Polopassword1!`

That pattern is incredibly predictable. As an attacker, if you know the target follows a complexity policy, you can build a rule that applies exactly that transformation to every word in your wordlist and dramatically increase your chances.

**How to Write Custom Rules**

Custom rules go in John's config file. On the AttackBox it is at `/opt/john/john.conf`. On a package manager install it is usually `/etc/john/john.conf`.

A rule definition looks like this:

```bash
[List.Rules:PoloPassword]
cAz"[0-9][!£$%@]"
```

Breaking that down:

- `[List.Rules:PoloPassword]` is the name of the rule, which is what you pass to the `--rule=` flag later
- `c` capitalizes the first character
- `Az` appends to the end of the word
- `[0-9]` means one digit from 0 to 9
- `[!£$%@]` means one of those symbols

So for every word in your wordlist, John will capitalize the first letter and try appending every combination of a digit and one of those symbols to the end. If `polopassword` is in your list, it will generate `Polopassword1!`, `Polopassword2@`, and so on.

Some other useful modifiers:

- `A0`: prepends instead of appends
- `[A-z]`: any upper or lowercase letter
- `[A-Z]`: uppercase only
- `[a-z]`: lowercase only
- `[a]`: only the letter a

**Using a Custom Rule**

```bash
john --wordlist=[path to wordlist] --rule=PoloPassword [path to file]
```

If you get stuck on syntax, Jumbo John ships with a huge list of existing custom rules in the config file around line 678. Looking at those is a good way to understand how the patterns work.

**Question: What do custom rules allow us to exploit?** `password complexity predictability`

**Question: What rule would we use to add all capital letters to the end of the word?** `Az"[A-Z]"`

**Question: What flag would we use to call a custom rule called `THMRules`?** `--rule=THMRules`

---

## Task 9 — Cracking Password Protected Zip Files {#task-9}

This one is useful in CTFs. Someone password-protects a zip file and you need to get into it. John handles this.

**zip2john**

Same pattern as unshadow. Before John can crack the zip password, you need to convert it into a hash format John understands. That is what `zip2john` does.

```bash
zip2john [zip file] > [output file]
```

Example:

```bash
zip2john zipfile.zip > zip_hash.txt
```

**Cracking**

Then pass that output file straight into John:

```bash
john --wordlist=/usr/share/wordlists/rockyou.txt zip_hash.txt
```

No need to specify a format here. John figures it out from the zip2john output.

The file for this task is in `~/John-the-Ripper-The-Basics/Task09/`. The zip is called `secure.zip`.

**Question: What is the password for the secure.zip file?** `pass123`

**Question: What is the contents of the flag inside the zip file?** `THM{w3ll_d0n3_h4sh_r0y4l}`

---

## Task 10 — Cracking Password Protected RAR Archives {#task-10}

Exact same idea as the zip task, just for RAR files. RAR is the format WinRAR uses. If you have never heard of WinRAR, it is compression software from the 90s that technically requires a license but has been showing the same "your trial has expired" popup for about 25 years while still working fine.

**rar2john**

```bash
rar2john [rar file] > [output file]
```

Example:

```bash
/opt/john/rar2john rarfile.rar > rar_hash.txt
```

**Cracking**

```bash
john --wordlist=/usr/share/wordlists/rockyou.txt rar_hash.txt
```

The file for this task is in `~/John-the-Ripper-The-Basics/Task10/`. The file is called `secure.rar`.

**Question: What is the password for the secure.rar file?** `password`

**Question: What are the contents of the flag inside the rar file?** `THM{r4r_4rch1ve5_th15_t1m3`

---

## Task 11 — Cracking SSH Keys with John {#task-11}

Last practical task, and it is one that also comes up in CTFs more than you would expect.

SSH normally authenticates with a password. But you can set it up to use a private key file instead, usually called `id_rsa`. The trade-off is that the private key itself is often protected by a passphrase. If you get your hands on someone's `id_rsa` file but it is passphrase-protected, you still cannot use it without knowing that passphrase. John can crack it.

**ssh2john**

By now you can probably guess how this works.

```bash
ssh2john [id_rsa file] > [output file]
```

Example:

```bash
/opt/john/ssh2john.py id_rsa > id_rsa_hash.txt
```

One thing to watch out for: depending on your setup, the command might be `ssh2john`, `ssh2john.py`, or you might need to call it with Python directly. On the AttackBox use `python3 /opt/john/ssh2john.py`. On Kali it is usually `python /usr/share/john/ssh2john.py`.

**Cracking**

```bash
john --wordlist=/usr/share/wordlists/rockyou.txt id_rsa_hash.txt
```

The file for this task is in `~/John-the-Ripper-The-Basics/Task11/`.

**Question: What is the SSH private key password?** `mango`

---

## Task 12 — Further Reading {#task-12}

That is the room done. The Openwall Wiki has full documentation on John if you want to go deeper. It covers every supported format, advanced rule syntax, and configuration options that this room barely touched.

---

The pattern with John is always the same. If you have a hash, figure out its type, convert it if needed using the right tool from the John suite, then feed it into John with rockyou.txt and the right format flag. That gets you most of the way through CTF challenges and a fair number of real-world scenarios too.

The conversion tools are what most people forget about. `unshadow` for shadow files, `zip2john` for zip files, `rar2john` for rar files, `ssh2john` for SSH keys. Once you remember that pattern, the rest is just syntax.

---