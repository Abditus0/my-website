---
title: "Lo-Fi CTF"
date: 2026-03-28
category: "TryHackMe · Writeup"
excerpt: "Walkthrough of TryHackMe's Lo-Fi CTF — Want to hear some lo-fi beats, to relax or study to? We've got you covered!"
image: "/images/blog/8.png"
readtime: "5 min read"
draft: false
---

# Lo-Fi

The description doesn't give us much. The only useful detail is that we need root access to the filesystem to get the flag. Let's start the machine and have a look around.

---

The URL drops us onto a relaxing lo-fi music site. There's a search bar I make a note of for later.

![](/images/blog/lo-fi/1.png)

I click around, check the songs, and almost immediately spot a red flag in the URL.

Clicking on a song gives you something like:

![](/images/blog/lo-fi/6.png)

```
/?page=relax.php
```

That's not good. The URL is directly naming a file on the server. It's just taking whatever I put in and loading that file. Meaning I'm essentially controlling what the server reads from its own filesystem. This is called **Local File Inclusion (LFI)**.

## Probing the Vulnerability

I try a few obvious ones first:

- `/?page=root` — nothing
- `/?page=admin` — nothing
- `/?page=/` — this one gets a response:

![](/images/blog/lo-fi/2.png)

```
HACKKERRR!! HACKER DETECTED. STOP HACKING YOU STINKIN HACKER!
```

So there's some kind of filter in place. I try `/?page=flag.txt` and `/?page=flag.php`, nothing. Then `/?page=/etc/passwd`, nothing. I spend a few minutes poking but can't get around it directly.

## Directory Traversal

Then it clicks. I need to step outside the current directory using `../`. Each one moves me one level up in the filesystem. I start adding them one by one:

- `/?page=../etc/passwd` nothing

![](/images/blog/lo-fi/4.png)

- `/?page=../../etc/passwd` nothing
- `/?page=../../../etc/passwd` we're in

![](/images/blog/lo-fi/7.png)

We get access to the system's passwd file. No flag here but the traversal is working. I swap `/etc/passwd` for `/flag.txt`:

```
/?page=../../../flag.txt
```

![](/images/blog/lo-fi/5.png)

It works.

- LFI happens when a site loads files based on user input without properly validating it. Never trust user input to decide what file to load
- Directory traversal (`../`) lets you climb out of the intended folder and read files anywhere on the server
- The filter was looking for obvious keywords like `/etc/passwd` directly. Adding `../` at the front was enough to bypass it

**Flag:** `flag{e4478e0eab69bd642b8238765dcb7d18}`