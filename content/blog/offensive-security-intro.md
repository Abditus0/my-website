---
title: "Offensive Security Intro"
date: 2026-03-17
category: "TryHackMe · Writeup"
excerpt: "Complete walkthrough of TryHackMe's Offensive Security Intro"
image: "/images/blog/1.png"
readtime: "8 min read"
draft: false
---
# Offensive Security Intro — TryHackMe Pre Security Path

_This is part of my ongoing series where I go through every room in the TryHackMe Pre Security path. I'll cover each room and explain everything as simply as possible so anyone can follow along, whether you're brand new to cybersecurity or just getting started on TryHackMe._

---

## Task 1 — What is Offensive Security?

In cybersecurity, there are two sides.

The **defensive side** — people who protect systems, monitor for attacks, and stop bad things from happening.

And the **offensive side** — people who try to break in to find weaknesses before the real attackers do.

Offensive security is that second one. You think like a hacker. You try to find the holes in a system so a company can fix them before someone with bad intentions finds them first. And this is always done with permission.

Think of it like this. You own a shop. You hire someone to pretend to be a thief — try to break in, test the locks, check if the alarm works. They're not actually stealing anything. They're helping you make your shop safer. That's offensive security. Same idea.

**The answer TryHackMe is looking for:** Offensive Security is the practice that simulates a hacker's actions to find vulnerabilities — weaknesses that could be exploited.

---

## Task 2 — Hacking Your First Machine

This is where you actually do something hands on. TryHackMe has set up a fake bank website called **FakeBank** just for this exercise. Your goal is to find a hidden page on this website that you're not supposed to have access to.

To do that, you'll use a tool called **Gobuster**.

### What is Gobuster?

Gobuster is a command-line tool that takes a list of words — things like "admin", "login", "dashboard", "transfer" — and tries each one as a web address. It checks: does this page exist? It tries hundreds of words automatically, one by one, until it finds something real.

This technique is called **directory busting** or **brute-forcing directories**. A directory is just another word for a folder. You're trying to find hidden folders or pages that aren't linked anywhere on the website.

### Running the Scan

Start your machine, open the terminal, and run this command:

```
gobuster -u http://fakebank.thm -w wordlist.txt dir
```

Here's what each part means:

- `gobuster` — the tool you're running
- `-u` — stands for URL, the web address you want to scan
- `http://fakebank.thm` — the address of the fake bank
- `-w` — stands for wordlist, a file full of words to try
- `wordlist.txt` — the wordlist file
- `dir` — tells Gobuster you're looking for directories and pages

After a few seconds, Gobuster will finish and show you results. You'll see two things:

- `/images` — probably just where the website stores its pictures
- `/bank-transfer` — this one is interesting

That's a hidden page. It wasn't linked anywhere on the website. You wouldn't find it just by clicking around. But Gobuster found it because the word "bank-transfer" was in the wordlist.

### Accessing the Hidden Page

Go to your browser and navigate to:

```
http://fakebank.thm/bank-transfer
```

There it is. A page where you can transfer money between bank accounts. No login. No password. Just open to anyone who finds it.

This is a real type of vulnerability. In real life, developers sometimes build admin pages and forget to protect them properly. An attacker who finds one could do serious damage.

For the task, transfer **$2000** from account **2276** to account **8881**. Once done, go back to your account page, refresh it, and you'll see a message. That message contains the answer TryHackMe is asking for.

---

## Task 3 — Careers in Cyber Security

TryHackMe ends this room by talking about real people who changed careers to get into cybersecurity. A construction worker who became a security engineer. A music teacher who became a security professional. A student who used TryHackMe to land his first job.

The point is simple — you don't need a special background. You just need to be consistent. A little bit every day adds up fast.

Here are the main offensive security career paths:

**Penetration Tester** — Companies hire you to legally hack their systems and find weaknesses. You write a report at the end detailing what you found and how to fix it.

**Red Teamer** — Similar to pen testing but more advanced. You simulate a real attacker over weeks — tricking employees, attempting physical access, running a full attack scenario. The goal is to test not just technology but the entire organization.

**Security Engineer** — More on the builder side. You design and build the systems that keep a company safe. Understanding how attacks work is essential so you can build proper defenses.

No question to answer here — TryHackMe just asks you to read through and continue.

---

_That wraps up Offensive Security Intro. If you're following along on the Pre Security path, the next room is up next. See you there._