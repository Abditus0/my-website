---
title: "The Game"
date: 2026-03-21
category: "ctf"
excerpt: "Walkthrough of the TryHackMe The Game challenge - Practice your Game Hacking skills."
image: "/images/blog/20.png"
readtime: "3 min read"
draft: false
---

## Recon

This challenge is about a Tetris game and I have to find a secret hidden somewhere inside the game files. First thing, I download the files and looked around.

I opened a couple of icons to check for metadata but nothing interesting showed up. Before running the actual game, I wanted to try reading the `.exe` file with `strings`. It's a command where you can extract readable strings from a binary which can sometimes reveal useful information like file paths, URLs, IP addresses, or passwords.

---

## Finding the Flag

Let's run it and search for something specific starting with `thm{`:
```bash
strings Tetrix.exe | grep thm{
```

Nothing came back. Maybe the flag had mixed or uppercase letters so I needed case insensitive search. Let's try again with `-i`:
```bash
strings Tetrix.exe | grep -i thm{
```

Got it.

![](/images/blog/the-game/1.png)

**Flag:** `THM{I_CAN_READ_IT_ALL}`

---

- Always try `strings` on a binary before running it, you might find the answer without even launching the program
- `grep` is case sensitive by default, throw in `-i` if your first search comes back empty
