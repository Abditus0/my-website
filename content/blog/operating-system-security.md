---
title: "Operating System Security — TryHackMe Pre Security Path"
date: 2026-03-26
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Operating System Security room - This room introduces users to operating system security and demonstrates SSH authentication on Linux."
image: "/images/blog/39.png"
readtime: "15 min read"
draft: false
---

# Operating System Security

Okay so this one starts off feeling like a "welcome to computers 101" kind of room and you might think you are going to be bored. Stick with it. By the end of the third task you are literally SSH-ing into a machine and switching to root. Not bad for a beginner room.

---

## Tasks

- [Task 1 — Introduction to Operating System Security](#task-1)
- [Task 2 — Common Examples of OS Security](#task-2)
- [Task 3 — Practical Example of OS Security](#task-3)

---

## Task 1 — Introduction to Operating System Security {#task-1}

Before getting into anything security related, the room takes a step back and asks a very basic question: what even is an operating system?

So. Hardware is all the physical stuff. The screen, keyboard, CPU, RAM, storage. You can touch it. It is real. But hardware on its own does nothing useful. You need something in between the hardware and the apps you actually want to run, and that something is the operating system.

The OS is the layer sitting between the hardware and your programs. Your browser, your messaging apps, your games, none of them talk to the hardware directly. They go through the OS and the OS handles it. Without the OS none of your software runs.

Different operating systems exist for different purposes. Windows and macOS are for personal computers and laptops. Android and iOS are for phones. Then there are server-focused ones like Windows Server, IBM AIX, and Oracle Solaris. And then there is Linux which kind of does everything.

Your OS is sitting on top of a massive pile of personal data. Private conversations, photos, work files, saved passwords, banking apps. All of it. If someone gets into your OS they get all of that. So protecting it is not optional.

When we talk about OS security we are really talking about protecting three things:

Confidentiality means only the right people can access your files and data. Integrity means nobody can tamper with your files without you knowing. Availability means your device actually works when you need it to.

These three are the core of security thinking and everything in the next tasks comes back to them.

**Question: Which of the following is not an operating system?** `Thunderbird`

Thunderbird is an email client made by Mozilla. Not an OS. The rest (AIX, Android, Chrome OS, Solaris) are all actual operating systems.

---

## Task 2 — Common Examples of OS Security {#task-2}

Now the room gets into the actual ways people attack those three pillars. There are three main weaknesses covered here.

**Authentication and Weak Passwords**

Authentication is just proving you are who you say you are. You can do this three ways: something you know like a password or PIN, something you are like a fingerprint, or something you have like your phone for an SMS code.

Passwords are the most common method and because of that they are the most attacked. People are lazy with passwords. They reuse them, they pick things that are easy to remember like their pet's name or birthday, and they think patterns like `1q2w3e4r` are clever because they look random but are actually just the keyboard layout read diagonally.

The NCSC published a list of the 100,000 most common passwords and the top 20 are honestly painful to read. `123456`, `password`, `iloveyou`, `monkey`, `dragon`. These are real passwords that real people use on real accounts right now.

The takeaway is simple: if your password is guessable, your account is basically open. Use something complex and use a different one for every account.

**Weak File Permissions**

This one is about the principle of least privilege, which sounds fancy but just means: only give people access to what they actually need.

If you are working on a confidential project, the files for that project should only be accessible to the people on that project. Not the whole company, not anyone who happens to be on the network. Just the right people.

When file permissions are set up poorly, an attacker can read files they should never see (confidentiality attack) or modify files they should never be able to touch (integrity attack). Both are bad.

**Access to Malicious Programs**

The third one is malicious software. Depending on what type it is, it can go after any of the three pillars.

Trojans can give an attacker direct access to your system so they can read or change your files. That is confidentiality and integrity.

Ransomware is the availability one. It encrypts all your files so you cannot read them anymore, then the attacker tells you to pay up if you want the decryption password back. Your files are still there, just scrambled into gibberish until you pay. Or until you have a backup, which is why backups matter.

**Question: Which of the following is a strong password?** `LearnM00r`

`iloveyou` is literally on the top 20 list. `1q2w3e4r5t` is a keyboard pattern. `qwertyuiop` is just the top row of the keyboard. `LearnM00r` mixes letters, numbers, and uppercase so it is the only one here that would actually take some effort to crack.

---

## Task 3 — Practical Example of OS Security {#task-3}

This is where it gets fun. The room sets up a scenario: you are hired to check the security of a company, you visit the office, and you spot a sticky note on one of the screens with two words written on it: `sammie` and `dragon`. That is a username and a password just sitting there in the open. Classic.

Time to start both machines and open the terminal on the AttackBox.

**Logging in as Sammie**

The command to connect to a remote machine over SSH is:
```bash
ssh sammie@MACHINE_IP
```

Replace `MACHINE_IP` with the actual IP of the target machine. The first time you connect it asks you to confirm the connection with yes. Then it asks for a password. You type `dragon` and even though nothing shows up on screen while you type, it is going through. Hit enter.

You are in.

Run `whoami` to confirm you are logged in as sammie. Then run `ls` to see the files in the directory. You will see a few files sitting there. Run `cat` on any of them to read the contents, for example:
```bash
cat draft.md
```

That prints whatever is in the file straight to the terminal.

**Finding Johnny's Password**

The room tells you there are two other users on this machine: `johnny` and `linda`. Both apparently have terrible password habits.

Since you are already logged in as sammie you can try switching to johnny with:
```bash
su - johnny
```

This asks for johnny's password. Looking at the top passwords list from earlier, you just start trying them one by one. `123456`? Nope. `12345678`? Nope. `qwerty`? Nope. `password`? Nope.

`abc123` works. You are now johnny.

**Finding the Root Password**

Now run:
```bash
history
```

This prints every command johnny has typed on this machine. Scroll through it and you will see something that looks very out of place. Instead of typing a command, johnny accidentally typed the root password directly into the terminal as if it were a command. It is just sitting there in the history for anyone to see.

The root password is `happyHack!NG`.

That is genuinely painful to find. The password itself is actually decent. Mixed case, special characters, not a dictionary word. And johnny just typed it straight into the terminal in plain text. All that effort for nothing.

**Getting Root and the Flag**

Now switch to root:
```bash
su - root
```

Enter `happyHack!NG` as the password. You are now root. Full unrestricted access to the entire system.

Navigate to the root directory and read the flag:
```bash
cat /root/flag.txt
```

**Question: What is the password for the user johnny?** `abc123`

**Question: What is the root password found in johnny's history?** `happyHack!NG`

**Question: What is the content of flag.txt?** `THM{YouGotRoot}`

---

## Wrapping Up

So that room went from "here is what a CPU is" to "here is how you get root on a Linux machine" pretty quickly. The three real lessons here are:

Weak passwords are not just a risk in theory. The sticky note with `dragon` on it and `abc123` being johnny's actual password are exactly the kind of things you see in real environments.

File permissions matter. If history was locked down properly or the root password was stored anywhere other than in a terminal command, none of that would have worked.

People are the weakest link. A technically solid password means nothing if you accidentally type it as a shell command in front of the entire history log.

Good room. Short, practical, and the ending hits different when you see `THM{YouGotRoot}` print out.

---