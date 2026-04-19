---
title: "Networking Secure Protocols — TryHackMe Cyber Security 101"
date: 2026-04-19
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Networking Secure Protocols room — Learn how TLS, SSH, and VPN can secure your network traffic."
image: "/images/blog/84.png"
readtime: "22 min read"
draft: false
---

# Networking Secure Protocols

This is the fourth and last room in the networking series on TryHackMe. If you have not done the previous three rooms (Networking Concepts, Networking Essentials, and Networking Core Protocols), go do those first. This room assumes you already know what HTTP, SMTP, POP3, IMAP, FTP, and TELNET are and how they work.

The whole point of this room is simple: all those protocols we learned about? They send everything in plain text. Passwords, emails, credit card numbers, all of it. Anyone on the network with a packet capture tool could just... read it. This room is about fixing that.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — TLS](#task-2)
- [Task 3 — HTTPS](#task-3)
- [Task 4 — SMTPS, POP3S, and IMAPS](#task-4)
- [Task 5 — SSH](#task-5)
- [Task 6 — SFTP and FTPS](#task-6)
- [Task 7 — VPN](#task-7)
- [Task 8 — Closing Notes](#task-8)

---

## Task 1 — Introduction {#task-1}

The room opens by reminding you of everything you learned in Networking Core Protocols, and then immediately pointing out that none of it is safe. HTTP, SMTP, POP3, IMAP, they all send data as plain text over the wire. No protection at all.

Three things are not protected without secure protocols: Confidentiality, Integrity, and Authenticity.

**Confidentiality** means someone watching the traffic can read everything. Your password, your credit card number, your emails. All of it sitting there in the packet capture like an open book.

**Integrity** means an attacker can change the data while it is in transit. You authorise a payment of one hundred pounds, they change it to eight hundred. You would never know.

**Authenticity** means you have no way to confirm you are actually talking to the real server and not a fake one someone set up to steal your credentials.

The solution the room covers is TLS. Add TLS to HTTP and you get HTTPS. Add it to POP3 and you get POP3S. SMTP becomes SMTPS. IMAP becomes IMAPS. The S stands for Secure in all cases.

The room also covers SSH as the secure replacement for TELNET, and VPN for connecting remote networks securely.

---

## Task 2 — TLS {#task-2}

Back in the day, if you were on the same network as someone and put your network card in promiscuous mode, you could capture every packet going through that network. Not just packets meant for you. Everything. Login credentials, emails, whatever. There was genuinely nothing users could do about it. That was just how networking worked.

Netscape recognised this was a problem in the early 1990s. They built SSL (Secure Sockets Layer) and released SSL 2.0 in 1995. Then in 1999, the IETF took SSL, improved it, and released it as TLS 1.0 (Transport Layer Security). TLS 1.3, the current version, came out in 2018. That is over two decades of people finding problems and fixing them to get to where we are now.

TLS operates at the transport layer of the OSI model. It sits between the application protocol (like HTTP) and the transport protocol (TCP), and it handles encryption so that nobody can read or modify the data being exchanged.

Before a server can use TLS, it needs a certificate. The process goes like this: the server admin creates a Certificate Signing Request (CSR) and sends it to a Certificate Authority (CA). The CA checks the request and issues a signed digital certificate. Anyone connecting to that server can then verify the certificate is legitimate because the CA's own certificates are already installed on their machine, in their browser or operating system. It is like recognising an official stamp from a known authority.

Getting a certificate signed usually costs money every year. Let's Encrypt changed that by offering free certificate signing, which is a big part of why HTTPS is now everywhere.

One thing the room flags: some people create self-signed certificates. A self-signed certificate is one where the server signed its own certificate instead of having a trusted CA do it. The problem is that nobody can independently verify it, so it cannot actually prove the server is who it claims to be. You will see browser warnings when you hit a site with a self-signed cert.

**Question: What is the protocol name that TLS upgraded and built upon?** `SSL`

**Question: Which type of certificates should not be used to confirm the authenticity of a server?** `Self-signed certificate`

---

## Task 3 — HTTPS {#task-3}

The room does a good job here of showing exactly what changes when you add TLS to HTTP, and what stays the same.

With plain HTTP, the process after resolving the domain name is:

1. TCP three-way handshake with the server
2. Start sending HTTP requests, like `GET / HTTP/1.1`

That is it. Two steps. And if you capture the traffic in Wireshark you can read every single byte. The room shows a screenshot of this and yeah, it is not pretty from a security standpoint.

With HTTPS, the process becomes:

1. TCP three-way handshake with the server
2. TLS handshake and session establishment
3. Start sending HTTP requests over the encrypted TLS session

The TLS handshake adds a few extra packets before any actual data gets exchanged. In Wireshark you can see the TCP handshake packets first, then several TLS negotiation packets, and then the application data. The application data shows as "Application Data" in Wireshark because it is encrypted and Wireshark cannot tell what protocol is inside.

If you try to follow the stream of those encrypted packets you just get garbage. Encrypted garbage. Which is exactly the point.

The room then provides the decryption key and shows you the same capture with TLS decrypted. Suddenly you can see all the HTTP traffic again, including the GET requests. The point the room is making is that TLS protected the traffic without requiring any changes to TCP or HTTP. TCP still does its thing. HTTP still does its thing. TLS just wraps around the HTTP layer and encrypts it.


**Question: How many packets did the TLS negotiation and establishment take in the Wireshark HTTPS screenshots above?** `8`

**Question: What is the number of the packet that contains the `GET /login` when accessing the website over HTTPS?** `10`

---

## Task 4 — SMTPS, POP3S, and IMAPS {#task-4}

This task is short because there is not much new to explain. Adding TLS to SMTP, POP3, and IMAP works the same way as adding it to HTTP. The reasoning and the benefits are identical.

What does change is the port numbers. The plain versions:

- HTTP: port 80
- SMTP: port 25
- POP3: port 110
- IMAP: port 143

The secure versions over TLS:

- HTTPS: port 443
- SMTPS: port 465 and 587
- POP3S: port 995
- IMAPS: port 993

The task asks which of SMTPS, POP3S, or IMAP you could extract login credentials from if you captured the traffic. SMTPS and POP3S are secured with TLS so the traffic is encrypted. IMAP in that list has no S on the end, meaning it is the plain unencrypted version. Plain IMAP sends everything in cleartext, so yes, you can read the credentials right out of the packet capture.

**Question: If you capture network traffic, in which of the following protocols can you extract login credentials: SMTPS, POP3S, or IMAP?** `IMAP`

---

## Task 5 — SSH {#task-5}

TELNET was convenient. You could log in to a remote machine and run commands as if you were sitting in front of it. The problem was that everything, including your password and everything you typed, went over the network in plain text. Anyone watching the network could grab your credentials instantly. It was a disaster waiting to happen and it happened constantly.

Tatu Ylönen built SSH (Secure Shell) in 1995 as a direct response to this problem. SSH-1 came out first, then SSH-2 in 1996 as a more secure version. In 1999, the OpenBSD team released OpenSSH, the open-source implementation that almost every SSH client today is built on.

OpenSSH brings a bunch of things to the table:

**Secure authentication** means you are not stuck with just a password. SSH supports public key authentication where you have a key pair and the server only lets you in if your private key matches. Two-factor authentication is also supported.

**Confidentiality** means end-to-end encryption. Nobody watching the network can read what you are doing on the remote machine.

**Integrity** means the encrypted traffic cannot be tampered with in transit.

**Tunneling** is where it gets interesting. SSH can create a secure tunnel and route other protocols through it. You can take an insecure protocol and shove it through an SSH tunnel so it gets encrypted. This is essentially a lightweight VPN.

**X11 Forwarding** means if you are connecting to a Linux machine that has a graphical interface, SSH can forward the graphics to your local machine. The room shows a screenshot of someone running Wireshark on a remote Kali machine through SSH with X11 forwarding. The `-X` flag enables this: `ssh 192.168.124.148 -X`.

To connect you just run `ssh username@hostname`. If your local username matches the remote one you only need `ssh hostname`. It will ask for a password unless you have set up key-based auth, in which case it just lets you straight in.

SSH listens on port 22. TELNET was port 23. One port apart, completely different security situation.

**Question: What is the name of the open-source implementation of the SSH protocol?** `OpenSSH`

---

## Task 6 — SFTP and FTPS {#task-6}

Two different protocols here and people constantly mix them up. They sound similar but they work completely differently.

**SFTP** stands for SSH File Transfer Protocol. It is part of the SSH protocol suite, meaning it runs over SSH and uses port 22. If OpenSSH is installed and configured to allow it, you connect with `sftp username@hostname`. Once you are in, `get filename` downloads a file and `put filename` uploads one. The commands are Unix-style and are a bit different from regular FTP commands, so do not assume they are the same.

**FTPS** stands for File Transfer Protocol Secure. This one is FTP with TLS added on top, similar to how HTTPS is HTTP with TLS. It uses port 990 instead of FTP's port 21. Because it is TLS-based, it needs a proper certificate set up on the server. It also uses separate connections for control and data transfer, which can cause headaches with strict firewalls that do not know how to handle it.

So: SFTP is FTP-like functionality built on SSH. FTPS is actual FTP secured with TLS. Different approach, different port, different setup requirements.

For this task there is a site to visit. You follow the instructions on the site and it gives you the flag.

**Flag: `THM{Protocols_secur3d}`**

---

## Task 7 — VPN {#task-7}

Imagine a company with offices in three different cities. The people in each office need to access shared files and internal systems that live in the main branch. You could run physical cables between all the offices but that is insanely expensive. The answer is a VPN.

VPN stands for Virtual Private Network. Virtual because the connection is not a physical dedicated line, it uses the existing internet. Private because the traffic is encrypted so it cannot be read by anyone in the middle.

The way it works: a VPN client at the remote office connects to a VPN server at the main branch. Once the connection is established, a VPN tunnel is created. All traffic from the remote office gets encrypted by the VPN client, sent through the tunnel to the VPN server, decrypted there, and then passed on to the internal network. From the perspective of any system inside the main branch, the remote office users look like they are physically there.

The room shows two scenarios. One where entire remote office branches connect through VPN, and one where individual remote users connect with a VPN client on their own device. Both work the same way, just at different scales.

There is also the privacy use case. When you connect to a VPN server, websites and services on the internet see the VPN server's IP address, not yours. The room gives an example of connecting to a VPN server in Japan and getting the Japanese version of Google. Your local ISP also only sees encrypted traffic going to the VPN server and cannot see what you are actually doing.

Two things the room warns about though. First, not all VPN servers route all your traffic. Some only give you access to the private network without routing your general internet traffic. And some VPN services leak your real IP address even when they are supposed to hide it. If privacy is the reason you are using a VPN, you should run a DNS leak test to make sure it is actually working.

Second, VPNs are illegal in some countries. Check local laws before using one, especially when travelling.

**Question: What would you use to connect the various company sites so that users at a remote office can access resources located within the main branch?** `VPN`

---

## Task 8 — Closing Notes {#task-8}

The room wraps up with a hands-on challenge using Wireshark and TLS decryption.

The machine has Chromium set up to log TLS session keys while browsing. This was done by launching the browser with an extra flag: `chromium --ssl-key-log-file=~/ssl-key.log`. Every TLS key used during that browser session gets written to that file.

There is a packet capture file called `randy-chromium.pcapng` in the Documents folder. You open it in Wireshark, and then you need to tell Wireshark where the key log file is so it can decrypt the traffic. The steps are:

1. Right-click any TLS packet
2. Choose "Protocol Preferences"
3. Select "Transport Layer Security"
4. Click "Open Transport Layer Security preferences"
5. Click "Browse" and locate `ssl-key.log` in the Documents directory
6. Click OK

Once Wireshark loads the keys, all the TLS traffic decrypts automatically and you can read the HTTP inside. One of those packets contains login credentials sent by the user.

**Question: One of the packets contains login credentials. What password did the user submit?** `THM{B8WM6P}`

---

## This room

Networking Secure Protocols covers the security layer that sits on top of everything from the previous room.

TLS is what makes the S in HTTPS, SMTPS, POP3S, and IMAPS. It wraps around the existing protocol, encrypts the traffic, and does not require the underlying protocol to change at all. The port numbers shift: HTTPS on 443, SMTPS on 465 or 587, POP3S on 995, IMAPS on 993.

SSH replaced TELNET. Same idea, port 22, but everything is encrypted. OpenSSH is the open-source implementation basically everyone uses. It also supports tunneling, which lets you route other protocols securely through it.

SFTP is file transfer over SSH on port 22. FTPS is FTP over TLS on port 990. Not the same thing.

VPN creates an encrypted tunnel between networks or between a device and a network. Useful for connecting remote offices, useful for privacy, needs to be checked for leaks if privacy is the actual goal.

The Wireshark challenge at the end drives home the whole point of the room. Without the TLS key log file, the packet capture is useless. With it, you can read everything. That is exactly why TLS matters and why protocols that do not use it are a liability.

---