---
title: "Corridor CTF"
date: 2026-03-25
category: "TryHackMe · Writeup"
excerpt: "Walkthrough of the TryHackMe Corridor challenge - Can you escape the Corridor?"
image: "/images/blog/13.png"
readtime: "6 min read"
draft: false
---

# Corridor CTF

Reading the description for this room, it's telling me that it's potentially an IDOR vulnerability. IDOR stands for **Insecure Direct Object Reference**. It's a vulnerability that lets you access things you're not supposed to by manipulating something in the URL, like an ID. For example:`http://whatever.com/user123`. Change `user123` to `user124`to gain access to user 124.

---

## Recon

First, let's run nmap to see what ports are open:

![](/images/blog/corridor/1.png)

```bash
nmap 10.82.136.44
```

Only port 80 is open, so let's head straight to the website and see what we're dealing with.

![](/images/blog/corridor/2.png)

It looks like some kind of a game with a bunch of doors. Let's explore and start clicking around.

Here's what I found: you can click on every single door and "enter" it, but it's a dead end every time. The room description also mentions that the URL looks like a hash, and that's correct. Here's how the URL looks from one of the doors:

![](/images/blog/corridor/3.png)

---

## Decoding the Hashes

Let's try to decode the hash and see what we get. My favorite tool for this is **[CrackStation](https://crackstation.net/)**, but use whatever you prefer.

![](/images/blog/corridor/4.png)

The first door's hash is MD5 and the result is `1`.

Let's try the rest of the doors. Door 2 is also MD5 and returns `2`. At this point I'm already guessing that every door hash is just the door number hashed with MD5. Let's keep going to confirm.

Door 3 returns MD5 and result `3`, so the theory holds. I tested all the doors and every single one is just its number hashed with MD5. The total number of doors is 13.

---

## Why Does This Matter?

We know the vulnerability is likely IDOR, and we know every door is just a number hashed with MD5. That makes me think we need to hash a number that isn't one of the 13 visible doors and plug it into the URL to access a hidden door we're not supposed to reach.

Let's start with `14` and work our way up. For hashing I'll use **[MD5 Hash Generator](https://www.md5hashgenerator.com/)**.

Get the hash for `14` and place it in the URL:

![](/images/blog/corridor/4.png)

That didn't work. Let's try `15`. Also nothing. I kept going all the way up to `21` and nothing worked. Then I tried something completely different. How about `admin`?

Also didn't work.

I kept pushing forward all the way to `30`. Still nothing. At this point I started thinking outside the box. Instead of just trying numbers, maybe the hidden door is something more obvious. Like a common keyword. I tried `admin`, `root`, `guest`, `test`, `login`. None of them worked either.

I was starting to run out of ideas. That's when it clicked. I had been so focused on going forward that I never thought about going backwards. What if the hidden door isn't a number higher than 13 but lower than 1? Starting with `0`...

It worked.

![](/images/blog/corridor/6.png)

Hashing the number `0` was the answer. A door that shouldn't exist, hidden behind a hash of nothing.

**Flag:** `flag{2477ef02448ad9156661ac40a6b8862e}`

---


- **IDOR** is when an app lets you access things you shouldn't just by changing a number or value in the URL. Always worth testing
- Don't only go forward with numbers, try going **backwards too**. `0` is easy to forget about
- If you see a hash in a URL, try to crack it. It's usually something simple
- MD5 is not encryption, it's just a hash. Tools like CrackStation can reverse it instantly
