---
title: "Intermediate Nmap"
date: 2026-04-01
category: "ctf"
excerpt: "Walkthrough of the TryHackMe Intermediate Nmap challenge - Can you combine your great nmap skills with other tools to log in to this machine?"
image: "/images/blog/22.png"
readtime: "6 min read"
draft: false
---

## Recon

The challenge description was already hinting that this one would be mostly nmap and netcat. I started the machine and ran a scan straight away:
```bash
nmap -sCV 10.114.178.220
```

The scan came back with some interesting results. This part in particular stood out:

![](/images/blog/intermediate-nmap/1.png)

Right there in the output I had a username `ubuntu` and a password `Dafdas!!/str0ng`. Just sitting there in the scan results.

---

## Connecting with Netcat

The description mentioned that something is listening on a high port and that connecting to it would give me credentials to use on a lower port. Port 31337 caught my eye so I connected to it using netcat:
```bash
nc 10.114.178.220 31337
```

It returned the username and password, confirming what I already found in the nmap scan. The lower port it was referring to is port 22, which is the standard port for SSH and is one of the most common ports used for remote access.

---

## Getting In

I connected to port 22 using the credentials:
```bash
ssh ubuntu@10.114.178.220 -p 22
```

![](/images/blog/intermediate-nmap/2.png)

I was in. Now I just had to find the flag. I ran `ls` first but the current directory was empty so I started looking around:

![](/images/blog/intermediate-nmap/3.png)

Found it.

**Flag:** `flag{251f309497a18888dde5222761ea88e4}`

---

- nmap with `-sCV` does version detection and runs default scripts, it can pull way more info than a basic scan
- Port 31337 is sometimes called "elite" or "leet" port, a classic in CTF challenges
- When a challenge description gives you hints, actually read it carefully, it saved me time here
- SSH on port 22 is one of the most common remote access methods, always worth trying when you have credentials
