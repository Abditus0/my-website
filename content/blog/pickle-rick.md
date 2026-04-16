---
title: "Pickle Rick"
date: 2026-04-16
category: "ctf"
excerpt: "Walkthrough of the TryHackMe Pickle Rick challenge - A Rick and Morty CTF. Help turn Rick back into a human!"
image: "/images/blog/80.png"
readtime: "15 min read"
draft: false
---

# Pickle Rick CTF

Rick turned himself into a pickle. Again. And now he needs three ingredients to brew a potion to turn himself back into a human. Horror LLC was scared of their own webserver, but Rick is scared of himself. The goal is to exploit a web server and find all three ingredients. Let's go.

---

## Recon

Open the webpage first. It is Rick and Morty themed, nothing special going on visually. But the first thing I always do is check the page source before touching anything else.

![](/images/blog/pickle-rick/1.png)

And right there in the HTML comments:

```html
<!--
  Note to self, remember username!

  Username: R1ckRul3s
-->
```

Okay. Username handed to us on a silver platter. Rick is not great at security.

Now let's run nmap and see what else is there.

```bash
nmap -sCV 10.114.175.232
```

Two open ports: 22 and 80. SSH and a web server. Same setup as always.

---

## Gobuster Round One (The Bad One)

I ran gobuster to look for any paths hiding on the server.

```bash
gobuster dir -u http://10.114.175.232 -w /usr/share/wordlists/dirb/common.txt
```

Found two things: `/assets` and `/robots.txt`.

Checked `/assets`, there are some images and a couple of files. Nothing that jumped out at me so I moved on.

Checked `/robots.txt` and it just has this:

```
Wubbalubbadubdub
```

That is definitely a password.

So now I have a username and what looks like a password. I tried SSH with them. Doesn't work because the server wants a public key, not a password. Dead end.

At this point I am sitting here thinking, okay I have credentials and nowhere to use them. Gobuster didn't find any login pages, SSH is not happening, what am I missing.

---

## Gobuster Round Two (The One That Actually Worked)

I thought about it for a bit and realized the problem. I ran gobuster with `dirb/common.txt` which is a smaller wordlist, and I didn't use the `-x` flag for file extensions. Without `-x`, gobuster only looks for exact matches. No extensions means it skips anything that ends in `.php` or `.html` or `.txt`. So if there is a login page sitting at `/login.php`, the first scan just walks right past it.

So I ran it again, this time properly.

```bash
gobuster dir -u http://10.114.175.232 -w /usr/share/wordlists/seclists/Discovery/Web-Content/common.txt -x php,txt,html
```

Two changes here. First, `seclists/Discovery/Web-Content/common.txt` is a much bigger and more thorough wordlist than the dirb one, so it catches a lot more. Second, `-x php,txt,html` makes gobuster try every word in the list with each of those extensions tacked on. So instead of just checking `/login`, it also checks `/login.php`, `/login.html`, and `/login.txt`. Way more coverage. It is slower but honestly just do it properly from the start. I learned that the hard way here.

This time it found a login page.

---

## Getting In

Went to the login page and used the credentials we found. Username `R1ckRul3s`, password `Wubbalubbadubdub`.

It worked. And instead of a normal dashboard I get a command panel. Like literally a box where I can run commands on the server. Okay Rick.

---

## Finding the Ingredients

Ran `ls -la` to see what is in the current directory. A few interesting files showed up. I tried to `cat` one of them and got this back:

```
Command disabled to make it hard for future PICKLEEEE RICCCKKKK.
```

Right. `cat` is blocked. Fine. There are other ways to read files. I tried `less` instead.

```bash
less Sup3rS3cretPickl3Ingred.txt
```

It worked. First ingredient: `mr. meeseek hair`.

There was also a `clue.txt` so I opened that too with `less`. It just said to look around the filesystem for the other ingredients. Helpful, Rick. Very helpful.

```bash
ls /home
```

There is a folder for `rick`. Let's look inside.

```bash
ls -la /home/rick
```

The second ingredient is sitting right there as a file. The filename has a space in it so I had to quote it:

```bash
less "/home/rick/second ingredients"
```

Second ingredient: `1 jerry tear`.

Now for the third one. I checked what I can run with sudo first.

```bash
sudo -l
```

No restrictions. I can run everything as root with no password. So:

```bash
sudo ls /root
```

There is a `3rd.txt` in there. One more:

```bash
sudo less /root/3rd.txt
```

Third ingredient: `fleeb juice`.

Rick can go back to being a human now. Or whatever he is.

---

## Takeaway

This one was fun and pretty straightforward once I stopped being lazy with gobuster. The whole thing basically came down to two lessons. Check the page source before doing anything else, because sometimes the answer is just sitting in an HTML comment. And run gobuster with the right wordlist and extensions from the start, because the quick version can miss things that matter.

The `cat` being blocked was a cute little obstacle. Takes about two seconds to think of an alternative but it is a nice touch for the theme.

Easy box. Good vibes. Would Rick and Morty again.
