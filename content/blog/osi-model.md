---
title: "OSI Model — TryHackMe Pre Security Path"
date: 2026-03-24
category: "TryHackMe · Writeup"
excerpt: "Complete walkthrough of TryHackMe's OSI Model room"
image: "/images/blog/11.png"
readtime: "25 min read"
draft: false
---

# OSI Model

The OSI Model is a standard that breaks down how data moves across a network into 7 layers. Each layer has its own job, and understanding them is essential for anyone working in IT or cybersecurity.

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
OSI stands for Open Systems Interconnection and it's made of 7 layers.

Something else that is important is that the process of information getting added to data is called encapsulation.

**Question: What does the "OSI" in "OSI Model" stand for?** `Open Systems Interconnection`

**Question: How many layers (in digits) does the OSI model have?** `7`

**Question: What is the key term for when pieces of information get added to data?** `Encapsulation`

---

## Task 2 — Layer 1 - Physical {#task-2}
This is the easiest one. It's literally anything physical that connects devices together. For example, ethernet cables that transfer data in a binary system. Binary means 0s and 1s.

**Question: What is the name of this Layer?** `Physical`

**Question: What is the name of the numbering system that is both 0's and 1's?** `Binary`

**Question: What is the name of the cables that are used to connect devices?** `Ethernet Cables`

---

## Task 3 — Layer 2 - Data Link {#task-3}
All you need to know about Data Link layer is that it uses MAC. MAC addresses are literally burnt into the NIC card that comes from the manufacturer. NIC card stands for Network Interface Card and every NIC has a unique MAC address. That means that every device on the planet has a unique MAC address. MAC addresses are used to identify devices. You will learn more about everything more in depth in the future going through TryHackMe rooms. For now all you need to know is data link = MAC address, switches, and that every MAC address is unique.

**Question: What is the name of this Layer?** `Data Link`

**Question: What is the name of the piece of hardware that all networked devices come with?** `Network Interface Card`

---

## Task 4 — Layer 3 - Network {#task-4}
This layer is all about routing. We talked about how layer 2 is about MAC addresses. Now layer 3 is all about IP addresses. We need a way to find the best "path" when trying to reach someone. Think of it like this: you have to go to your friend's house, but there are many different paths that you can choose, and that's exactly what this layer does. Choosing the best path for a route.

TryHackMe talks about only 2 different routing protocols here (OSPF, RIP) but you need to know that these are only 2 examples. OSPF stands for Open Shortest Path First and if we choose this protocol, the path that we are going to get is the "cheapest" because the routing protocol is choosing the shortest path. RIP stands for Routing Information Protocol and it chooses routes based on hop count, meaning how many routers the data has to pass through to reach its destination.

When you hear layer 3 network, think of IPs, routing protocols, routers.

**Question: What is the name of this Layer?** `Network`

**Question: Will packets take the most optimal route across a network? (Y/N)** `Y`

**Question: What does the acronym "OSPF" stand for?** `Open Shortest Path First`

**Question: What does the acronym "RIP" stand for?** `Routing Information Protocol`

**Question: What type of addresses are dealt with at this layer?** `IP Addresses`

---

## Task 5 — Layer 4 - Transport {#task-5}
You need to know 2 protocols in this layer that you will see everywhere in your IT career no matter what you do: TCP and UDP.

TCP (Transmission Control Protocol) uses a three-way handshake to establish a connection and guarantees that whatever you send will be delivered and will be delivered without any errors. Example: if you sent a file, TCP is being used because you don't want to send half a file.

On the other hand, UDP (User Datagram Protocol) is connectionless (no 3-way handshake) and because of that it's way faster but at a cost. Whatever is sent with UDP is not guaranteed to arrive at its destination and it does not provide any error checks. UDP can be used, for example, in audio or video calls because audio and video calls cannot be "re-sent".

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
For now, all you need to know about this layer is that when 2 devices are communicating, they have to create a connection and if a connection is created, we have a session. This layer's responsibility is to keep the session running as long as there is a connection between the 2 devices and end the session if the connection is idle for too long or if the connection is lost.

**Question: What is the name of this Layer?** `Session`

**Question: What is the technical term for when a connection is successfully established?** `Session`

---

## Task 7 — Layer 6 - Presentation {#task-7}
This is where standardisation starts to happen. Different software developers build different programs, like email clients for example, and they all work differently under the hood. But the data still needs to be handled the same way no matter what software you're using.

This layer acts as a translator between the application layer (layer 7) and everything below it. If you send an email from one client and someone receives it on a completely different client, the presentation layer makes sure the content still displays properly on both ends. It handles things like data formatting and conversion.

Security features like encryption also happen here. When you visit a site with HTTPS, the encryption is happening at the presentation layer.

**Question: What is the name of this Layer?** `Presentation`

**Question: What is the main purpose that this Layer acts as?** `Translator`

---

## Task 8 — Layer 7 - Application {#task-8}
This is also a very easy layer to remember. Whatever you see with your eyes is the application layer. When you have software that you can interact with, that is called GUI (Graphical User Interface).

This is the layer where protocols and rules are in place to determine how you should interact with data sent or received. Everyday applications like email clients, browsers, or file transfer software like FileZilla all provide a friendly GUI for you to work with. Other protocols that work at this layer include DNS (Domain Name System), which is how website addresses are translated into IP addresses.

**Question: What is the name of this Layer?** `Application`

**Question: What is the technical term that is given to the name of the software that users interact with?** `Graphical User Interface`

---

## Task 9 — Practical - OSI Game {#task-9}
Here is a very nice game you can play to remember all the OSI layers! Also get the flag and have fun!

**Flag:** `THM{OSI_DUNGEON_ESCAPED}`

---

## Task 10 — Continue Your Learning: Packets & Frames {#task-10}
Nothing to do here. Hope you learned the basics of the OSI model! The OSI model is used everywhere and all the time so I strongly recommend to know at least everything in this room!