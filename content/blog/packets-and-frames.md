---
title: "Packets & Frames — TryHackMe Pre Security Path"
date: 2026-03-27
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Packets & Frames room - Understand how data is divided into smaller pieces and transmitted across a network to another device."
image: "/images/blog/14.png"
readtime: "12 min read"
draft: false
---

# Packets & Frames

This room is all about how data travels across a network. We already know data gets broken into smaller pieces (from the previous room), now we learn what those pieces actually are.

---

## Tasks

- [Task 1 — What are Packets and Frames?](#task-1)
- [Task 2 — TCP/IP (The Three-Way Handshake)](#task-2)
- [Task 3 — Practical - Handshake](#task-3)
- [Task 4 — UDP/IP](#task-4)
- [Task 5 — Ports 101 (Practical)](#task-5)
- [Task 6 — Continue Your Learning: Extending Your Network](#task-6)

---

## Task 1 — What are Packets and Frames? {#task-1}

So when data travels across a network, it doesn't go as one big chunk. It gets broken into tiny pieces. Those pieces are called **packets** and **frames**. They're not the same thing.

A **packet** is a piece of data that has an IP address attached to it. That's how it knows where to go. It lives at Layer 3 (Network) of the **OSI model**.

A **frame** is basically a wrapper around the packet. It lives at Layer 2 (Data Link) and uses MAC addresses instead of IP addresses. Think of it like this: the packet is a letter, and the frame is the envelope. The envelope carries it to the right place, and once it's opened, the letter inside knows what to do next.

Simple rule to remember: if **IP addresses** are involved, you're talking about a **packet** (Layer 3). If you strip all that away, you're left with a **frame** (Layer 2).

Packets also have headers. Little pieces of extra info attached to the data. Here are the important ones:

- **Time to Live (TTL)**: every packet has a timer. If it never reaches its destination, it expires and gets removed so it doesn't clog up the network
- **Checksum**: a way to check if the data arrived without being changed. If anything is different, the packet is considered corrupt
- **Source Address**: the IP address of whoever sent the packet
- **Destination Address**: the IP address of wherever the packet is going

**Question: What is the name for a piece of data when it does have IP addressing information?** `Packet`

**Question: What is the name for a piece of data when it does not have IP addressing information?** `Frame`

---

## Task 2 — TCP/IP (The Three-Way Handshake) {#task-2}

TCP stands for **Transmission Control Protocol**. We already covered this briefly in the OSI model room, but now we go deeper.

TCP/IP works similarly to the OSI model but has only 4 layers instead of 7: Application, Transport, Internet, and Network Interface. Same idea though. Data gets wrapped up as it goes down the layers and unwrapped on the other side.

The most important thing about TCP is that it's **connection based**. That means before any data is sent, both devices need to agree to talk to each other first. This is done through something called the **Three-Way Handshake**.

Think of it like calling someone on the phone. You call them (SYN), they pick up and say hello (SYN/ACK), and then you say hello back (ACK). Now you're both connected and can start talking.

Here's what each step means:

- **SYN**: the client says "hey, I want to connect"
- **SYN/ACK**: the server says "got it, I'm ready too"
- **ACK**: the client says "great, let's go"
- **DATA**: actual data starts being sent
- **FIN**: one side says "I'm done, let's close the connection"
- **RST**: something went wrong, connection is cut immediately

Because TCP makes sure everything arrives correctly and in the right order, it's a bit slower. If even one small piece of data is missing, the whole thing has to be resent. That's the trade-off. Reliability over speed.

TCP packets also have headers just like regular packets. The important ones:

- **Source Port**: a randomly picked port the sender uses to send from
- **Destination Port**: the port of the service on the other side (this one is not random, e.g. port 80 for websites)
- **Sequence Number**: a number given to each piece of data so it can be put back in the right order
- **Acknowledgement Number**: confirms the last piece received by adding 1 to the sequence number
- **Checksum**: checks that the data wasn't corrupted during travel
- **Data**: the actual content being sent
- **Flag**: tells both devices what kind of message this is (SYN, ACK, FIN, etc.)

**Question: What is the header in a TCP packet that ensures the integrity of data?** `Checksum`

**Question: Provide the order of a normal Three-way handshake (with each step separated by a comma):** `SYN, SYN/ACK, ACK`

---

## Task 3 — Practical - Handshake {#task-3}

Fun little interactive task. You put the TCP handshake steps in the correct order and get a flag at the end.

**Question: What is the value of the flag given at the end of the conversation?** `THM{TCP_CHATTER}`

---

## Task 4 — UDP/IP {#task-4}

UDP stands for **User Datagram Protocol**. It's basically the opposite of TCP.

There's no handshake, no checking if data arrived, no connection at all. You just send the data and hope for the best. That sounds bad, but it's actually really useful in certain situations.

Imagine you're on a video call. If one frame of the video gets lost, you don't want the whole call to freeze and resend it. You just want to keep going. That's where UDP shines. It's fast because it doesn't waste time on all the checks TCP does.

UDP is used for things like:
- Video and voice calls
- Live streaming
- Online gaming

TCP is used when you need everything to arrive correctly, like downloading a file or loading a webpage.

UDP packets are simpler than TCP packets. Here are the headers they carry:

- **TTL**: same as before, an expiry timer so packets don't get stuck forever
- **Source Address**: where the packet came from
- **Destination Address**: where it's going
- **Source Port**: randomly chosen by the sender
- **Destination Port**: the port of the service on the other side
- **Data**: the content being sent

No checksum, no sequence numbers, no flags. Just send it and move on.

**Question: What does the term "UDP" stand for?** `User Datagram Protocol`

**Question: What type of connection is "UDP"?** `Stateless`

**Question: What protocol would you use to transfer a file?** `TCP`

**Question: What protocol would you use to have a video call?** `UDP`

---

## Task 5 — Ports 101 (Practical) {#task-5}

A port is basically a door on a device. Every service or application listens on a specific port number so the device knows where to send incoming data.

For example, when you visit a website your browser sends a request to port 80 (or 443 for HTTPS). The server knows that anything coming in on port 80 is a web request.

Ports go from **0 to 65535**. The ones between 0 and 1024 are called **common ports**. They're reserved for well known services.

Here are the ones you'll see the most:

- **FTP (port 21)**: used to transfer files between devices
- **SSH (port 22)**: lets you log into another device remotely using a terminal
- **HTTP (port 80)**: how websites are served, the basic version
- **HTTPS (port 443)**: same as HTTP but encrypted and secure
- **SMB (port 445)**: lets you share files or devices like printers over a network
- **RDP (port 3389)**: lets you remotely control another device with a full desktop view

You can actually run any service on any port. These are just the standards everyone follows. If you run something on a non standard port, you have to specify it manually, like `http://example.com:8080`.

For the practical challenge: connect to `8.8.8.8` on port `1234` and you'll get a flag.

**Question: What is the flag received from the challenge?** `THM{YOU_CONNECTED_TO_A_PORT}`

---

## Task 6 — Continue Your Learning: Extending Your Network {#task-6}

Nothing to do here except move on to the next room.

Hope this helped! This stuff is the foundation of everything in networking and cybersecurity. Once packets, frames, TCP and UDP click, a lot of other things start making sense too.

---