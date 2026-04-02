---
title: "Computer Types — TryHackMe Pre Security Path"
date: 2026-03-18
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Computer Types room - Explore the different types of computers, from laptops to the tiny chips inside your coffee machine."
image: "/images/blog/27.png"
readtime: "10 min read"
draft: false
---

# Computer Types

Computers are not just laptops and phones anymore. They are in fridges, doorbells, coffee machines, and automatic doors. This room is about learning to recognize the different types of computers that exist and understanding why each one is built the way it is.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Sophia's Summer of Hidden Computers - Month 1](#task-2)
- [Task 3 — Sophia's Summer of Hidden Computers - Month 2](#task-3)
- [Task 4 — Why Computers Come in Different Flavors](#task-4)
- [Task 5 — Summary](#task-5)

---

## Task 1 — Introduction {#task-1}

Sophia noticed an unfamiliar WiFi network called "NexusCool Fridge X17" and realized her neighbor had bought a smart refrigerator. A fridge with a built-in computer that connects to the internet. That moment made her stop and think. Computers had quietly made their way into everyday objects all around us and most people never notice.

By the end of this room you will be able to identify between different types of computers, both the ones you use directly like laptops and smartphones, and the ones working in the background like servers, IoT devices and embedded systems.

---

## Task 2 — Sophia's Summer of Hidden Computers - Month 1 {#task-2}

Not all computers are meant to move. Not all computers are even meant for a person to sit in front of. Here are the four main types in this category:

**Laptop** is built for portability. You can take it anywhere and it runs on battery. The trade off is that keeping things cool inside a small portable device is hard, so it will struggle with long heavy tasks compared to something that stays plugged in at a desk.

**Desktop** stays in one place and runs off wall power. Because it does not need to worry about battery life or staying small, it can handle the same tasks for much longer without slowing down. Built for consistency over mobility.

**Workstation** looks like a desktop but is built to a higher standard. It uses specialized components designed to reduce errors during long or complex tasks like 3D modeling, simulations or professional engineering work. Reliability and precision are the priority here.

**Server** is a computer with no screen or keyboard. It runs continuously in the background answering requests from multiple users at the same time. You never interact with a server directly but pretty much every tool and service you use online is powered by one.

**Question: Which computer type usually runs without a dedicated screen and keyboard?** `Server`

**Question: What kind of computer with specialized components would one buy to carry out precision work?** `Workstation`

---

## Task 3 — Sophia's Summer of Hidden Computers - Month 2 {#task-3}

By her second month at Nova Labs, Sophia had started noticing computers she had never directly interacted with. The most powerful computer most people own fits in their pocket, but millions more hide inside everyday objects.

**Smartphone** is a pocket sized computer optimized for battery life and connectivity. It is the most popular type of personal computer in the world right now.

**Tablet** is similar to a smartphone but with a larger screen and built around touch first interaction. Things like iPads or drawing tablets fall into this category.

**IoT Device** stands for Internet of Things. These are small single purpose devices that connect to a network to either report data or receive commands. A smart thermostat, a fitness tracker, or a smart doorbell are all IoT devices.

**Embedded Computer** is a computer built directly into another device. A coffee machine controller, an automatic door sensor, or a lamp dimmer chip are all embedded computers. The key difference between these and IoT devices is connectivity. IoT devices connect to a network. Embedded computers often do not connect to anything at all. They just do their one job inside the machine, silently, for years, without anyone knowing they are there.

Sophia walked through automatic doors every day at Nova Labs without ever realizing there was a tiny computer inside the door frame detecting her movement and telling the motor to open. That is embedded computing in a nutshell.

**Question: What is the currently most popular pocket-sized computer?** `Smartphone`

**Question: What kind of computer would you expect to find in a coffee machine?** `Embedded Computer`

---

## Task 4 — Why Computers Come in Different Flavors {#task-4}

Sophia asked the obvious question: why not just build one computer that does everything?

The answer is that every design is a trade off.

Mobility costs performance. A small portable device running on battery cannot sustain the same level of performance as something plugged into a wall with proper cooling.

Reliability costs money. Servers and critical systems use redundancy like extra power supplies and backup disks to make sure they never go down. That adds cost and complexity.

Purpose shapes everything. You touch a phone. You ask a server for data. An IoT device works quietly without ever demanding your attention.

There is no single best computer. There is only the right tool for the job.

This task has an interactive exercise that walks you through matching each computer type to its purpose. I really recommend doing it properly rather than skipping it. It ties everything from the room together nicely and helps it all stick.

**Question: Flag** `THM{8_computer_types}`

---

## Task 5 — Summary {#task-5}

Eight types of computers covered in this room. Laptops, desktops, workstations, servers, smartphones, tablets, IoT devices and embedded computers. Each one exists because someone needed a specific trade off between size, power, portability, reliability or connectivity.

The most important computers are not always the fastest or the most visible. Sometimes they are the silent chips keeping doors opening, planes flying and coffee machines brewing.

---

Computers are everywhere and most of them you will never see or touch. Understanding what each type is built for is the first step to understanding how to think about securing them.

---