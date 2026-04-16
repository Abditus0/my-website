---
title: "Networking Concepts — TryHackMe Cyber Security 101"
date: 2026-04-16
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Networking Concepts room — Learn about the ISO OSI model and the TCP/IP protocol suite."
image: "/images/blog/78.png"
readtime: "22 min read"
draft: false
---

# Networking Concepts

This is the first room in a four-part networking series on TryHackMe. The other three are Networking Essentials, Networking Core Protocols, and Networking Secure Protocols. The room says you should already know what an IP address and a TCP port number are, at least loosely. If those terms mean nothing to you, go do the Pre Security path first and come back.

If you do know what they are but cannot really explain them properly, that is fine. That is kind of the point of this room.

Start the machine and the AttackBox when you get to Task 7. Give them a couple of minutes to boot before you try anything.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — OSI Model](#task-2)
- [Task 3 — TCP/IP Model](#task-3)
- [Task 4 — IP Addresses and Subnets](#task-4)
- [Task 5 — UDP and TCP](#task-5)
- [Task 6 — Encapsulation](#task-6)
- [Task 7 — Telnet](#task-7)
- [Task 8 — Conclusion](#task-8)

---

## Task 1 — Introduction {#task-1}

The room opens with a few questions. Why do you need an IP address to use the internet? Can an IP address uniquely identify a user? What does the life of a packet actually look like?

Then it tells you what it is going to cover: the ISO OSI model, IP addresses and subnets, routing, TCP and UDP, port numbers, and how to connect to an open TCP port from the command line. Solid list. This is the kind of foundational stuff that comes up constantly once you go deeper into networking or security.

---

## Task 2 — OSI Model {#task-2}

Okay, the OSI model. If you have been around networking content for any amount of time you have probably seen this mentioned somewhere. It looks intimidating the first time, especially with all the layer numbers and acronyms flying around. The room says do not worry about it, and honestly that is fair advice. It clicks after you see it a few times.

OSI stands for Open Systems Interconnection. It was developed by the ISO (International Organization for Standardization) as a conceptual framework for how network communications should work. The key word is conceptual. This is a model, not something that runs on your machine. But understanding it helps you make sense of a lot of real networking stuff, like when someone says "layer 3 switch" or "layer 7 firewall."

There are seven layers. From bottom to top:

**Layer 1 — Physical Layer** is about the actual physical connection. Cables, radio signals, electrical pulses, light through fibre. It defines what a 0 and a 1 look like in transit. WiFi bands like 2.4 GHz and 5 GHz live here. So does your Ethernet cable.

**Layer 2 — Data Link Layer** handles communication between devices on the same network segment. Think of a switch connecting ten computers in an office. That is a network segment, and the data link layer is what lets those machines talk to each other. Ethernet (802.3) and WiFi (802.11) are layer 2. Addresses at this layer are MAC addresses, six bytes each, usually written in hex with colons separating each byte. The leftmost three bytes identify the hardware vendor. Think MAC addresses when you see Layer 2.

**Layer 3 — Network Layer** is where routing happens. Once you need to get data from one network to a completely different network, layer 3 takes over. It handles logical addressing and figures out the path a packet should take. IP is the main one here, along with ICMP and VPN protocols like IPSec. Think Routers when you see Layer 3.

**Layer 4 — Transport Layer** deals with end-to-end communication between applications running on different hosts. Your browser connecting to a web server goes through this layer. TCP and UDP both live here. It also handles things like flow control, segmentation, and error correction.

**Layer 5 — Session Layer** manages sessions between applications. It starts them, keeps them alive, synchronises the data so it arrives in the right order, and handles recovery if something breaks mid-transfer. NFS and RPC are examples.

**Layer 6 — Presentation Layer** makes sure the data arriving at the application layer is in a format the application can actually read. It handles encoding, compression, and encryption. Character encoding like ASCII or Unicode is a layer 6 thing. So is MIME, which is what your email client uses when you attach a file. MIME takes the binary file and encodes it using ASCII characters so it can travel safely through email systems.

**Layer 7 — Application Layer** is what you interact with directly as a user. HTTP, FTP, DNS, POP3, SMTP, IMAP all live here. When your browser requests a web page, that HTTP request is a layer 7 thing.

The mnemonic the room gives for remembering the layers bottom to top is "Please Do Not Throw Spinach Pizza Away." Use whatever helps you remember. The layer numbers matter more than the mnemonic though, so make sure you have those down.

**Question: Which layer is responsible for end-to-end communication between running applications?** `4`

**Question: Which layer is responsible for routing packets to the proper network?** `3`

**Question: In the OSI model, which layer is responsible for encoding the application data?** `6`

**Question: Which layer is responsible for transferring data between hosts on the same network segment?** `2`

---

## Task 3 — TCP/IP Model {#task-3}

So the OSI model is the conceptual one. The TCP/IP model is the one that actually got implemented and is what the internet runs on. It was developed in the 1970s by the Department of Defense, which explains why one of its design goals was the ability to keep functioning even if parts of the network went down. That is not a coincidence.

TCP/IP stands for Transmission Control Protocol/Internet Protocol.

Where the OSI model has seven layers, the TCP/IP model collapses them into four. Going top to bottom this time:

**Application Layer** swallows the OSI application, presentation, and session layers all at once. So OSI layers 5, 6, and 7 all become one layer here. HTTP, HTTPS, FTP, POP3, SMTP, IMAP, Telnet, and SSH are all application layer protocols in this model.

**Transport Layer** maps directly to OSI layer 4. TCP and UDP live here.

**Internet Layer** is the TCP/IP name for what OSI calls the network layer. So OSI layer 3. IP, ICMP, and IPSec are here.

**Link Layer** maps to OSI layer 2. Ethernet and WiFi.

Some textbooks add a fifth layer at the bottom for the physical layer, making it match OSI a bit more closely. The room mentions this but does not dwell on it.

**Question: To which layer does HTTP belong in the TCP/IP model?** `Application Layer`

**Question: How many layers of the OSI model does the application layer in the TCP/IP model cover?** `3`

---

## Task 4 — IP Addresses and Subnets {#task-4}

An IP address is how devices identify each other on a network. The room uses the analogy of a home postal address. Without a unique address, there is no reliable way to find you or send you anything.

The version that still dominates is IPv4. An IPv4 address is 32 bits split into four octets, each one being 8 bits. Since 8 bits can represent values from 0 to 255, you get addresses that look like `192.168.0.1` or `10.20.141.132`. The total number of possible IPv4 addresses is about 4 billion, roughly 2 to the power of 32.

In each subnet, the first address is the network address and the last is the broadcast address and neither of those can be assigned to a device. So `192.168.1.0` is the network address and `192.168.1.255` is the broadcast address for that subnet. Sending something to the broadcast address hits every device on that network at once.

To check your IP address on Linux you can run `ifconfig` or `ip a s`. On Windows it is `ipconfig`.

The subnet mask tells you which part of the IP address identifies the network and which part identifies the individual host. A subnet mask of `255.255.255.0` can also be written as `/24`, which means the first 24 bits are fixed across the whole subnet. So on a `/24` network like `192.168.66.0/24`, you have addresses from `192.168.66.1` to `192.168.66.254` available for devices.

There are also private IP address ranges defined by RFC 1918. These are ranges that cannot be routed on the public internet. The three ranges are:

`10.0.0.0` to `10.255.255.255`, written as `10/8`

`172.16.0.0` to `172.31.255.255`, written as `172.16/12`

`192.168.0.0` to `192.168.255.255`, written as `192.168/16`

Memorise these. Seriously. You will run into situations where you see an IP like `10.1.33.7` and need to know immediately whether that is public or private. For a private IP to reach the internet, it needs a router with a public IP that supports NAT (Network Address Translation).

Routing itself is basically the process of getting a packet from one network to another. A router looks at the destination IP and figures out where to send the packet next. Most packets pass through multiple routers before reaching their destination.

**Question: Which of the following IP addresses is not a private IP address?** `49.69.147.197`

**Question: Which of the following IP addresses is not a valid IP address?** `192.168.305.19`

---

## Task 5 — UDP and TCP {#task-5}

IP gets the packet to the right host. But once it arrives at that host, something needs to direct it to the right application. That is where port numbers come in. Port numbers are two octets, so they range from 1 to 65535 (port 0 is reserved). There are two transport layer protocols that use them: UDP and TCP.

**UDP (User Datagram Protocol)** is connectionless. It just fires packets at the destination with no setup, no acknowledgement, and no confirmation of delivery. You send it and hope it gets there. The room compares it to standard mail with no tracking. The upside is speed, since there is no overhead from all that confirmation machinery. DNS queries, video streaming, and online games often use UDP because a dropped packet is less painful than the delay from waiting to resend it.

**TCP (Transmission Control Protocol)** is the opposite. It is connection-oriented, which means it has to establish a connection before any data flows. It also makes sure data arrives reliably and in the correct order. Every byte of data gets a sequence number. The receiver sends back acknowledgements. If something gets lost it gets resent.

The connection starts with a three-way handshake using two flags, SYN and ACK:

First the client sends a SYN packet to the server. This includes the client's randomly chosen starting sequence number.

The server replies with a SYN-ACK packet, adding its own randomly chosen sequence number.

The client sends an ACK back to confirm it received the SYN-ACK. Connection is now open and data can start flowing.

**Question: Which protocol requires a three-way handshake?** `TCP`

**Question: What is the approximate number of port numbers (in thousands)?** `65`

---

## Task 6 — Encapsulation {#task-6}

Encapsulation is what happens as your data travels down through the layers before it gets sent. Each layer wraps the data it receives with its own header (and sometimes a trailer at the bottom), then hands it down to the next layer. The receiving end then unwraps everything in reverse order until the original application data is back.

Here is how it works step by step:

You type something in an application and hit send. That is your application data.

The transport layer takes it and adds a TCP or UDP header. Now it is a TCP segment or a UDP datagram.

The network layer takes that segment or datagram and adds an IP header. Now it is an IP packet.

The data link layer takes the IP packet and adds a header and a trailer. Now it is an Ethernet frame or a WiFi frame.

That frame gets physically transmitted. On the receiving end the process reverses. The link layer strips its header and trailer, the network layer strips the IP header, the transport layer strips the TCP or UDP header, and the application gets the original data.

This design is clever because each layer only has to worry about its own job. The transport layer does not care about MAC addresses. The network layer does not care about application data. Everyone just does their bit and passes it on.

**Question: On a WiFi, within what will an IP packet be encapsulated?** `Frame`

**Question: What do you call the UDP data unit that encapsulates the application data?** `Datagram`

**Question: What do you call the data unit that encapsulates the application data sent over TCP?** `Segment`

---

## Task 7 — Telnet {#task-7}

This is where you actually do something. Start the machine and the AttackBox if you have not already and give them a couple of minutes.

Telnet is an old protocol for remote terminal connections. It sends everything in plain text, which is why nobody uses it for actual remote administration anymore. But it is useful as a diagnostic tool because it lets you connect to any TCP port and talk to whatever is running on it directly.

The machine has three services running: an echo server on port 7, a daytime server on port 13, and a web server on port 80.

**Echo server** just repeats back whatever you send it. Connect with `telnet MACHINE_IP 7`, type anything, and it throws it straight back at you. To close the connection press `CTRL + ]` and then type `quit`.

**Daytime server** on port 13 just spits out the current date and time and then closes the connection on its own. Nothing to do there.

**Web server** on port 80 is the interesting one for the questions. Connect with `telnet MACHINE_IP 80`, then type:

```bash
GET / HTTP/1.1
Host: telnet.thm
```

Then press Enter twice. That blank line at the end is important, the server is waiting for it before it responds. If nothing comes back, press Enter once more.

The server responds with an HTTP 200 and serves you the page. The server header in the response tells you what software is running and what version. The page itself contains a flag.

**Question: What is the name and version of the HTTP server?** `lighttpd/1.4.63`

**Question: What flag did you get when you viewed the page?** `THM{TELNET_MASTER}`

---

## Task 8 — Conclusion {#task-8}

That wraps up Networking Concepts. It covers a lot of ground without going too deep on one thing, which makes sense since it is the first room in a four-part series. The OSI model and TCP/IP model are the kind of things that seem weird at first but become useful reference points the more networking content you consume.

A few things worth keeping in your head from this room:

The OSI model has seven layers. Know the numbers. Layer 3 routing, layer 4 transport, layer 7 application. You will hear these constantly.

Private IP ranges are `10.x.x.x`, `172.16.x.x` through `172.31.x.x`, and `192.168.x.x`. If you see an IP and need to know quickly whether it can be reached from the public internet, these are the ones to remember.

TCP does the three-way handshake. UDP does not. That difference matters a lot once you start doing anything with ports or traffic analysis.

---