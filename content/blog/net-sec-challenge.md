---
title: "Net Sec Challenge"
date: 2026-05-20
category: "ctf"
excerpt: "Walkthrough of the TryHackMe Net Sec Challenge room - Practice the skills you have learned in the Network Security module."
image: "/images/blog/126.png"
readtime: "18 min read"
draft: false
---

# Net Sec Challenge

This one is a guided challenge and the room tells me upfront that it can be done entirely with nmap, telnet, and hydra. Three tools. Let's see how it goes.

---

## Recon

Starting with the usual nmap scan but this time scanning all ports since the room hints there's something on a non-standard one.

```bash
nmap -sCV -p- 10.82.191.165
```

![](/images/blog/net-sec-challenge/1.png)

Six ports came back. 22, 80, 139, 445, 8080, and 10021. Already a good amount to work with.

The nmap output also leaks two flags right away. One in the HTTP server header and one in the SSH banner. Free flags basically, just gotta read the scan carefully.

```
HTTP header flag: THM{web_server_25352}
SSH header flag: THM{946219583339}
```

Two down before even touching the box. Nice.

---

## Web - Port 80

Opened the page in the browser and it just shows `Hello, world!`. Checked the page source too, nothing hidden in there either.

Before completely giving up on port 80 I wanted to make sure there's no hidden path I'm missing. Ran gobuster.

```bash
gobuster dir -u http://10.82.191.165 -w /usr/share/wordlists/dirb/common.txt
```

Nothing useful. No hidden paths, no juicy directories. Moving on, but I'm keeping port 80 in the back of my mind in case I need to come back.

---

## FTP - Port 10021

This is the weird one. FTP is normally on port 21 but here it's on 10021. The room is basically pointing a giant arrow at it so let's go.

The room also hands me two usernames to work with: `eddie` and `quinn`. With usernames and a service, the move is obvious. Hydra time.

Starting with eddie:

```bash
hydra -l eddie -P /usr/share/wordlists/rockyou.txt ftp://10.82.191.165:10021
```

Important thing to remember here, you have to specify the port since it's not the default. If you forget, hydra will go knock on port 21 and find nothing.

![](/images/blog/net-sec-challenge/2.png)

Cracked. Now let's log in.

```bash
ftp 10.82.191.165 10021
```

Im in.

![](/images/blog/net-sec-challenge/3.png)

Did the usual `ls` to see what's lying around. Looked through eddie's stuff and... nothing. No flag. Of course.

So the flag must be on quinn's account. Same drill.

```bash
hydra -l quinn -P /usr/share/wordlists/rockyou.txt ftp://10.82.191.165:10021
```

Cracked again. Password is `andrea`.

Logged in as quinn, did an `ls`, and there it is. A flag file. But remember you can't just read files from inside FTP, you have to download them to your machine first.

```bash
get <flagfile>
```

![](/images/blog/net-sec-challenge/4.png)

Exited FTP and read it locally.

**Flag: `THM{321452667098}`**

---

## The Port 8080 Challenge

Last question is about port 8080. Visited it in the browser:

```
http://10.82.191.165:8080
```

![](/images/blog/net-sec-challenge/5.png)

There's a little challenge on the page. It wants me to run an nmap scan that avoids detection.

This is pretty cool. In real pentesting you cant just blast the target with whatever scan you want because you'll get caught immediately. You have to be sneaky. Not a lot of rooms teach this so im glad this one at least scratches the surface.

Quick rundown of how nmap timing works. Nmap has these timing templates that control how fast and how loud your scan is:

- `-T0` Paranoid (super slow, super stealth)
- `-T1` Sneaky
- `-T2` Polite
- `-T3` Normal (default if you dont specify anything)
- `-T4` Aggressive
- `-T5` Insane (loud and fast, you will get caught)

The trade-off is simple. Lower number means more stealth but waaaay slower. Higher number means faster but you light up every IDS in the network.

There are also scan type flags that help with stealth:

- `-sS` SYN scan (half-open, doesnt complete the handshake)
- `-sN` Null scan (sends packets with no flags set, which a lot of systems dont log properly)

In a real engagement you'd combine these for max stealth. But for this challenge the room only wants me to use `-sN`.

```bash
nmap -sN 10.82.191.165
```

Ran it, and there's the flag.

**Flag: `THM{f7443f99}`**

![](/images/blog/net-sec-challenge/6.png)

Honestly this is way oversimplified compared to real life stealth scanning but at least the concept is there. Beats nothing.

---

## Answers

**What is the highest port number being open less than 10,000?** `8080`

**There is an open port outside the common 1000 ports; it is above 10,000. What is it?** `10021`

**How many TCP ports are open?** `6`

**What is the flag hidden in the HTTP server header?** `THM{web_server_25352}`

**What is the flag hidden in the SSH server header?** `THM{946219583339}`

**We have an FTP server listening on a nonstandard port. What is the version of the FTP server?** `vsftpd 3.0.5`

**We learned two usernames using social engineering: `eddie` and `quinn`. What is the flag hidden in one of these two account files and accessible via FTP?** `THM{321452667098}`

**Browsing to `http://10.82.191.165:8080` displays a small challenge that will give you a flag once you solve it. What is the flag?** `THM{f7443f99}`

---

## Takeaway

Easy one but pretty useful. Two flags handed to you straight from the nmap banners which is a good reminder to actually read your scan output instead of just skimming for ports. The FTP part was a nice reminder that services dont always live on default ports and you need to tell your tools where to look.

The port 8080 challenge was the most interesting part for me. Real world recon is not about who can blast the loudest nmap, its about who can get the info without setting off alarms. Would love to see more rooms go deeper into stealth and evasion because thats where the skill is.

Solid little challenge.

---

