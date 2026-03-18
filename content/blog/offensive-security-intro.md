---
title: "Offensive Security Intro — TryHackMe Pre Security Path"
date: 2026-03-17
category: "TryHackMe · Writeup"
excerpt: "Complete walkthrough of TryHackMe's Offensive Security Intro"
image: "/images/blog/1.png"
readtime: "8 min read"
draft: false
---
# Offensive Security Intro

---

## Tasks

- [Task 1 — What is Offensive Security?](#task-1)
- [Task 2 — Hacking Your First Machine](#task-2)
- [Task 3 — Careers in Cyber Security](#task-3)

## Task 1 — What is Offensive Security? {#task-1}

Pretty much just an intro. TryHackMe explains the concept in one line that I actually like —
*"To outsmart a hacker, you need to think like one."*

Offensive security is exactly that. Instead of sitting back and defending,
you're the one actively trying to break in — finding the bugs, the loopholes,
the weak points. All legally, all with permission.

One question to answer, easy one:

**Question: Which better represents simulating a hacker's actions to find vulnerabilities?**

**Answer:** `Offensive Security`

---

## Task 2 — Hacking Your First Machine {#task-2}

They spin up a fake bank called **FakeBank** directly in the browser — no setup needed,
just hit Start Machine and it loads.

The goal is to find a hidden page using **Gobuster**. I opened the terminal and ran:

![](/images/blog/offensive-security1.png)

Got this back:
```
/images        (Status: 301)
/bank-transfer (Status: 200)
```

`/bank-transfer` is the one we want. I navigated to it and found a completely open transfer page. No login, no verification, nothing.

![](/images/blog/offensive-security2.png)


I transferred **$2000** from account **2276** to **8881**.

![](/images/blog/offensive-security3.png)

![](/images/blog/offensive-security4.png)

Refreshed the account page and the flag was there.

![](/images/blog/offensive-security3.png)

**Answer:** `BANK-HACKED`

---

## Task 3 — Careers in Cyber Security {#task-3}

TryHackMe talks about the different offensive security roles. Penetration Tester, Red Teamer, Security Engineer. They also share stories of people who completely switched careers to get into cyber.
You'll learn more about every role as you go through the rooms anyway.

---