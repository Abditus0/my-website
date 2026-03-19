---
title: "Intro to LAN — TryHackMe Pre Security Path"
date: 2026-03-19
category: "TryHackMe · Writeup"
excerpt: "Complete walkthrough of TryHackMe's Intro to LAN room"
image: "/images/blog/5.png"
readtime: "30 min read"
draft: false
---

# Intro to LAN

---

## Tasks

- [Task 1 — Introducing LAN Topologies](#task-1)
- [Task 2 — A Primer on Subnetting](#task-2)
- [Task 3 — ARP](#task-3)
- [Task 4 — DHCP](#task-4)
- [Task 5 — Continue Your Learning: OSI Model](#task-5)

## Task 1 — Introducing LAN Topologies {#task-1}
A topology is just the design of a network, how devices are arranged and connected. There are three main ones, and each has its own trade offs.

**Star Topology**

![](/images/blog/intro-to-lan/1.png)

Every device connects individually to a central switch or hub. All data passes through that central device first before reaching its destination. It's the most common setup today because it's reliable and easy to scale. Adding a new device is as simple as plugging it in.

The downsides are cost and maintenance. More cabling, dedicated hardware, and the bigger it gets the harder it is to manage. There's also one critical weak point: if the central switch fails, every device connected to it loses access.

**Bus Topology**

![](/images/blog/intro-to-lan/2.png)

All devices share a single backbone cable. It's the cheapest and easiest topology to set up. Minimal cabling, no dedicated central hardware needed.

The problem is that everything shares the same line. The more devices sending data at once, the slower it gets. Troubleshooting is painful too since all traffic travels the same route. And if the backbone cable breaks, the whole network goes down with no fallback.

**Ring Topology**

![](/images/blog/intro-to-lan/3.png)

Devices connect directly to each other in a loop. Data travels around the ring from device to device until it reaches the right one. Each device prioritises its own data before forwarding anything else.

Since data only travels in one direction, faults are easy to trace. It's also less prone to bottlenecks than bus. But it's slow, data might pass through several devices before reaching its destination. And like bus, there's no redundancy. One broken cable or failed device kills the whole network.

**Switch**

![](/images/blog/intro-to-lan/4.png)

Switches connect multiple devices on a local network. Unlike hubs which blast packets to every port, switches are smart. They track which device is on which port and only send data where it needs to go. This cuts down traffic significantly.

**Router**

![](/images/blog/intro-to-lan/5.png)

Routers connect different networks together and handle getting data from one to the other. Connecting switches and routers together adds redundancy. If one path goes down, data takes another route and the network stays up.

**Practical**

The interactive lab shows the weak points of each topology in action. You cut the ring's cable to stop all traffic, flood the bus until it collapses, and break the star's central switch to take down every connected device.

**Question: What does LAN stand for?** `Local Area Network`

**Question: What is the verb given to the job that Routers perform?** `Routing`

**Question: What device is used to centrally connect multiple devices on the local network and transmit data to the correct location?** `Switch`

**Question: What topology is cost-efficient to set up?** `Bus Topology`

**Question: What topology is expensive to set up and maintain?** `Star Topology`

**Question: What is the flag given at the end?** `THM{TOPOLOGY_FLAWS}`

---

