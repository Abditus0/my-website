---
title: "OSI Model — TryHackMe Pre Security Path"
date: 2026-03-24
category: "TryHackMe · Writeup"
excerpt: "Complete walkthrough of TryHackMe's OSI Model room"
image: "/images/blog/11.png"
readtime: "15 min read"
draft: false
---

# OSI Model

The OSI Model is a standard that breaks down how data moves across a network into 7 layers. Each layer has its own job, and understanding them is essential if you're getting into IT or cybersecurity.

---

## Tasks

- [Task 1 — What is the OSI Model?](#task-1)
- [Task 2 — Layer 1 - Physical](#task-2)
- [Task 3 — Layer 2 - Data Link](#task-3)
- [Task 4 — Layer 3 - Network](#task-4)
- [Task 5 — Layer 4 - Transport](#task-5)
- [Task 6 — Layer 5 - Session](#task-6)
- [Task 7 — Layer 6 - Presentation](#task-7)
- [Task 8 — Layer 7 - Application](#task-8)
- [Task 9 — Practical - OSI Game](#task-9)
- [Task 10 — Continue Your Learning: Packets & Frames](#task-10)

## Task 1 — What is the OSI Model? {#task-1}

OSI stands for **Open Systems Interconnection**, and it's made up of 7 layers.

Something else that's important: the process of adding information to data is called **encapsulation**.

**Question: What does the "OSI" in "OSI Model" stand for?** `Open Systems Interconnection`  
**Question: How many layers (in digits) does the OSI model have?** `7`  
**Question: What is the key term for when pieces of information get added to data?** `Encapsulation`

---

## Task 2 — Layer 1 - Physical {#task-2}

This one is the easiest. It's literally anything physical that connects devices together.

For example, ethernet cables that transfer data using a binary system (0s and 1s).

**Question: What is the name of this Layer?** `Physical`  
**Question: What is the name of the numbering system that is both 0's and 1's?** `Binary`  
**Question: What is the name of the cables that are used to connect devices?** `Ethernet Cables`

---

## Task 3 — Layer 2 - Data Link {#task-3}

All you really need to know here is that the Data Link layer uses MAC addresses.

MAC addresses are basically burnt into the **NIC (Network Interface Card)** by the manufacturer, and every NIC has a unique one. That means every device has its own MAC address.

These are used to identify devices on a network.

You’ll learn this stuff more in depth later in other TryHackMe rooms, but for now just remember:  
Data Link = MAC addresses, and switches.

**Question: What is the name of this Layer?** `Data Link`  
**Question: What is the name of the piece of hardware that all networked devices come with?** `Network Interface Card`

---

## Task 4 — Layer 3 - Network {#task-4}

This layer is all about routing.

We talked about how Layer 2 uses MAC addresses. Now Layer 3 is all about IP addresses.

We need a way to find the best path when sending data. Think of it like going to a friend's house: there are multiple routes, and you want the best one. That’s what this layer does.

TryHackMe mentions two routing protocols: **OSPF** and **RIP** (just examples, there are more).

- **OSPF (Open Shortest Path First)**: finds the "cheapest" path (lowest cost route)
- **RIP (Routing Information Protocol)**: chooses routes based on hop count (how many routers it passes through)

When you hear Layer 3, think: IPs, routing, routers.

**Question: What is the name of this Layer?** `Network`  
**Question: Will packets take the most optimal route across a network? (Y/N)** `Y`  
**Question: What does the acronym "OSPF" stand for?** `Open Shortest Path First`  
**Question: What does the acronym "RIP" stand for?** `Routing Information Protocol`  
**Question: What type of addresses are dealt with at this layer?** `IP Addresses`

---

## Task 5 — Layer 4 - Transport {#task-5}

There are two protocols here you’ll see everywhere: **TCP** and **UDP**.

**TCP (Transmission Control Protocol)** uses a 3-way handshake (you will learn more about this in another room) and guarantees delivery with no errors.  
Example: sending files. You don’t want half a file.

**UDP (User Datagram Protocol)** is connectionless (no handshake). It’s faster, but there’s no guarantee data arrives or is correct.

Example: video or audio calls. They can’t really be “re-sent”.

**Question: What is the name of this Layer?** `Transport`  
**Question: What does TCP stand for?** `Transmission Control Protocol`  
**Question: What does UDP stand for?** `User Datagram Protocol`  
**Question: What protocol guarantees the accuracy of data?** `TCP`  
**Question: What protocol doesn't care if data is received or not by the other device?** `UDP`  
**Question: What protocol would an application such as an email client use?** `TCP`  
**Question: What protocol would an application that downloads files use?** `TCP`  
**Question: What protocol would an application that streams video use?** `UDP`

---

## Task 6 — Layer 5 - Session {#task-6}

For now, just know this:

When two devices communicate, they create a connection. That’s called a session.

This layer is responsible for keeping that session alive and closing it if the connection is lost or inactive for too long.

**Question: What is the name of this Layer?** `Session`  
**Question: What is the technical term for when a connection is successfully established?** `Session`

---

## Task 7 — Layer 6 - Presentation {#task-7}

This is where things start getting standardized.

Different apps (like email clients) work differently behind the scenes, but the data still needs to be understood the same way.

This layer acts like a translator between the application layer and everything below it.

Example: you send an email from one app, someone opens it on another. It still looks correct.

It also handles formatting, conversion, and things like encryption (HTTPS is usually associated with this layer).

**Question: What is the name of this Layer?** `Presentation`  
**Question: What is the main purpose that this Layer acts as?** `Translator`

---

## Task 8 — Layer 7 - Application {#task-8}

This one is easy. It’s what you actually see and interact with.

Anything with a **GUI (Graphical User Interface)** is part of this layer.

Things like browsers, email clients, and tools. All live here.

Protocols like **DNS (Domain Name System)** also work here, translating domain names into IP addresses.

**Question: What is the name of this Layer?** `Application`  
**Question: What is the technical term that is given to the name of the software that users interact with?** `Graphical User Interface`

---

## Task 9 — Practical - OSI Game {#task-9}

Here’s a fun game to help you remember the OSI layers. Go try it out and grab the flag.

**Flag:** `THM{OSI_DUNGEON_ESCAPED}`

---

## Task 10 — Continue Your Learning: Packets & Frames {#task-10}

Nothing to do here.

Hope you learned the basics of the OSI model! This stuff comes up everywhere, so it’s definitely worth knowing.

---