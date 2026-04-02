---
title: "Extending Your Network — TryHackMe Pre Security Path"
date: 2026-03-29
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Extending Your Network room - Learn about some of the technologies used to extend networks out onto the Internet and the motivations for this."
image: "/images/blog/15.png"
readtime: "12 min read"
draft: false
---

# Extending Your Network

This room builds on what we've learned so far and zooms out a bit. Now that we understand how data travels, we look at the technologies that make networks bigger, more secure, and more connected. Things like port forwarding, firewalls, VPNs, routers and switches.

---

## Tasks

- [Task 1 — Introduction to Port Forwarding](#task-1)
- [Task 2 — Firewalls 101](#task-2)
- [Task 3 — Practical — Firewall](#task-3)
- [Task 4 — VPN Basics](#task-4)
- [Task 5 — LAN Networking Devices](#task-5)
- [Task 6 — Practical — Network Simulator](#task-6)

---

## Task 1 — Introduction to Port Forwarding {#task-1}

Without port forwarding, services running on a device are only reachable from within the same local network. That's called an **intranet**. A private network that no one from the outside can access.

Say you have a web server running on `192.168.1.10` at port 80. The other computers on your local network can reach it just fine. But anyone on the Internet? No chance. They have no idea it exists.

**Port forwarding** fixes that. You configure the router to forward incoming traffic on a specific port to the right device on the internal network. So if someone from the outside sends a request to your public IP on port 80, the router knows to pass it along to `192.168.1.10`.

One thing worth clarifying early: port forwarding is not the same as a firewall. Port forwarding opens a specific port so traffic can come through. A firewall decides whether that traffic is actually allowed. They work together, but they're different things.

Port forwarding is always configured at the **router**.

**Question: What is the name of the device that is used to configure port forwarding?** `Router`

---

## Task 2 — Firewalls 101 {#task-2}

A **firewall** is essentially the gatekeeper of a network. It sits at the edge and decides what traffic is allowed in and out, based on rules set by an administrator.

Those rules can be based on a lot of things:

- **Where is the traffic coming from?** Block or allow traffic from specific networks or IPs
- **Where is it going?** Restrict traffic heading to certain destinations
- **What port is it using?** Only allow traffic on specific ports
- **What protocol is it?** Filter by TCP, UDP, or both

Firewalls inspect packets to answer these questions. There are two main types:

- **Stateful**: looks at the entire connection, not just individual packets. It tracks the state of a session and makes decisions based on how the full conversation is going. More intelligent, but uses more resources. If a host is acting suspicious, the whole device can be blocked.

- **Stateless**: uses a fixed set of rules and checks each packet individually. Much lighter on resources, but also dumber. If a rule doesn't exactly match, the packet slips through. Great for handling large floods of traffic like DDoS attacks, though.

Firewalls operate at **Layers 3 and 4** of the OSI model. The Network and Transport layers. That's where IP addresses and ports live.

**Question: What layers of the OSI model do firewalls operate at?** `3 & 4`

**Question: What category of firewall inspects the entire connection?** `Stateful`

**Question: What category of firewall inspects individual packets?** `Stateless`

---

## Task 3 — Practical — Firewall {#task-3}

Interactive task where you configure a firewall to block malicious traffic. The red packets are the bad ones, green are legitimate. The goal is to block port 80 traffic from reaching the web server at `203.0.110.1` while keeping the good traffic flowing through.

**Question: What is the flag?** `THM{FIREWALLS_RULE}`

---

## Task 4 — VPN Basics {#task-4}

A **VPN (Virtual Private Network)** lets devices on completely separate networks communicate securely over the Internet, as if they were on the same local network. It does this by creating an encrypted **tunnel** between the devices.

A good real world example: a company with two offices in different cities. Instead of paying for a dedicated private line between them, they use a VPN. Both offices can share resources like servers and printers as if they were in the same building.

VPNs offer three main benefits:

- **Connects geographically separated networks**. Great for businesses with multiple locations
- **Privacy**. Traffic is encrypted, so even if someone intercepts it, they can't read it. Especially useful on public WiFi
- **Anonymity**. Hides your traffic from your ISP and other intermediaries. Useful for journalists or activists in countries with restricted internet freedom. That said, a VPN that logs everything you do is barely better than no VPN at all

There are a few different VPN technologies in use:

- **PPP**: handles authentication and encryption using a private key and public certificate. Can't leave a network on its own though. It's not routable
- **PPTP (Point-to-Point Tunneling Protocol)**: takes the PPP data and routes it across networks. Easy to set up and widely supported, but weakly encrypted
- **IPSec (Internet Protocol Security)**: encrypts data using the existing IP framework. Harder to configure, but much stronger encryption and broadly supported

TryHackMe actually uses a VPN to connect you to their vulnerable machines. Keeping them off the public Internet while still letting you reach them.

**Question: What VPN technology only encrypts & provides the authentication of data?** `PPP`

**Question: What VPN technology uses the IP framework?** `IPSec`

---

## Task 5 — LAN Networking Devices {#task-5}

This task covers two core pieces of networking hardware: **routers** and **switches**. They often get confused but do very different things.

**Routers** connect separate networks and pass data between them. That process is called **routing**. Routers operate at **Layer 3** of the OSI model and use IP addresses to figure out the best path for data to travel. They often have a web interface or console where an administrator can configure things like port forwarding or firewall rules.

When there are multiple paths between two devices, the router picks the best one based on factors like:

- Which path is shortest?
- Which is most reliable?
- Which uses the faster medium (copper vs fibre)?

**Switches** are different. Their job is to connect multiple devices within the same network. Think of the central hub that all the computers in an office plug into. They can work at two different layers:

- **Layer 2 switches**: forward **frames** using MAC addresses. They just get the frame to the right device on the local network, nothing more
- **Layer 3 switches**: more advanced. They can do what a Layer 2 switch does, but also route **packets** using IP addresses. Taking on some of the responsibilities of a router

One more concept introduced here: **VLAN (Virtual Local Area Network)**. VLANs let you logically split up devices on the same physical switch into separate groups. For example, the Sales team and the Accounting team might be on the same switch, but a VLAN keeps them isolated from each other. They can both access the Internet, but they can't talk directly to each other. Clean network separation without needing extra hardware.

**Question: What is the verb for the action that a router does?** `Routing`

**Question: What are the two different layers of switches?** `Layer 2, Layer 3`

---

## Task 6 — Practical — Network Simulator {#task-6}

Fun interactive task. You get a network simulator that breaks down every single step a packet takes as it travels from one device to another. Including the full TCP handshake process.

The task is to send a TCP packet from `computer1` to `computer3` and watch it all unfold in the network log.

**Question: What is the flag from the network simulator?** `THM{YOU'VE_GOT_DATA}`

**Question: How many HANDSHAKE entries are there in the Network Log?** `5`

---

That wraps up the Extending Your Network room. Port forwarding, firewalls, VPNs, routers, switches. These are the building blocks of every real world network out there. Once these concepts click, a lot of the more advanced security topics start to make a lot more sense.

---