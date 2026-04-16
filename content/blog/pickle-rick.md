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

Rick turned himself into a pickle. Again. And now he needs three ingredients to brew a potion to turn himself back into a human. The goal is to exploit a web server and find all three ingredients.

---

## Recon

Open the webpage first.

![](/images/blog/pickle-rick/1.png)

It is Rick and Morty themed, nothing special going on visually. But the first thing I always do is check the page source before touching anything else.

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

## Gobuster

I ran gobuster to look for any paths hiding on the server.

```bash
gobuster dir -u http://10.114.175.232 -w /usr/share/wordlists/dirb/common.txt
```

Found two things: `/assets` and `/robots.txt`.

![](/images/blog/pickle-rick/2.png)

Checked `/assets`, there are some images and a couple of files.

![](/images/blog/pickle-rick/3.png)

Nothing that jumped out at me so I moved on.

Checked `/robots.txt` and it just has this:

```
Wubbalubbadubdub
```

That is probably the password I'm looking for.

So now I have a username and what looks like a password. I tried SSH with them. Doesn't work because the server wants a public key, not a password. Dead end.

At this point I am sitting here thinking, okay I have credentials and nowhere to use them. Gobuster didn't find any login pages, SSH is not happening, what am I missing.

---

## Gobuster Round Two

I thought about it for a bit and realized the problem. I ran gobuster with `dirb/common.txt` which is a smaller wordlist, and I didn't use the `-x` flag for file extensions. Without `-x`, gobuster only looks for exact matches. No extensions means it skips anything that ends in `.php` or `.html` or `.txt`. So if there is a login page sitting at `/login.php`, the first scan just walks right past it.

So I ran it again, this time properly.

```bash
gobuster dir -u http://10.114.175.232 -w /usr/share/wordlists/seclists/Discovery/Web-Content/common.txt -x php,txt,html
```

Two changes here. First, `seclists/Discovery/Web-Content/common.txt` is a much bigger wordlist than the dirb one, so it catches a lot more. Second, `-x php,txt,html` makes gobuster try every word in the list with each of those extensions tacked on. So instead of just checking `/login`, it also checks `/login.php`, `/login.html`, and `/login.txt`. Way more coverage. It is slower but honestly just do it properly from the start.

This time it found a login page.

![](/images/blog/pickle-rick/5.png)

---

## Getting In

Went to the login page and used the credentials we found.

![](/images/blog/pickle-rick/6.png)

Username `R1ckRul3s`, password `Wubbalubbadubdub`.

It worked.

And instead of a normal dashboard I get a command panel.

![](/images/blog/pickle-rick/7.png)

---

## Finding the Ingredients

Ran `ls -la` to see what is in the current directory.

![](/images/blog/pickle-rick/8.png)

A few interesting files showed up. I tried to `cat` one of them and got this back:

```
Command disabled to make it hard for future PICKLEEEE RICCCKKKK.
```

![](/images/blog/pickle-rick/9.png)

Right. `cat` is blocked. Fine. There are other ways to read files. I tried `less` instead.

```bash
less Sup3rS3cretPickl3Ingred.txt
```

![](/images/blog/pickle-rick/10.png)

It worked. First ingredient: `mr. meeseek hair`.

There was also a `clue.txt` so I opened that too with `less`. It just said to look around the filesystem for the other ingredients. Not really helpful.

```bash
ls /home
```

![](/images/blog/pickle-rick/11.png)

There is a folder for `rick`. Let's look inside.

```bash
ls -la /home/rick
```

![](/images/blog/pickle-rick/12.png)

The second ingredient is there. The filename has a space in it so I had to quote it:

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

![](/images/blog/pickle-rick/13.png)

There is a `3rd.txt` in there. One more:

```bash
sudo less /root/3rd.txt
```

Third ingredient: `fleeb juice`.

![](/images/blog/pickle-rick/14.png)

Rick can go back to being a human now. Or whatever he is.

---

## Takeaway

This one was fun and pretty straightforward. The whole thing basically came down to two lessons. Check the page source before doing anything else, because sometimes the answer is just sitting in an HTML comment. And run gobuster with the right wordlist and extensions from the start, because the quick version can miss things that matter.

The `cat` being blocked was a cute little obstacle. Takes about two seconds to think of an alternative but it is a nice touch for the theme.

Easy box. Good vibes. Would Rick and Morty again.

---