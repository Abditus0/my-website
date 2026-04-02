---
title: "Computer Fundamentals — TryHackMe Pre Security Path"
date: 2026-03-17
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Computer Fundamentals room - This room covers the basic components of a computer system."
image: "/images/blog/26.png"
readtime: "10 min read"
draft: false
---

# Computer Fundamentals

Before we can talk about security, we need to understand what we are actually securing. Think of it like a castle. Before you can defend it, you need to know the layout, where everything is kept, who can go where, and how people get in. Trying to defend something you do not understand is pointless. This room is about understanding our castle first.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Inside a Computer System](#task-2)
- [Task 3 — What Happens When You Press the Start Button?](#task-3)
- [Task 4 — Conclusion](#task-4)

---

## Task 1 — Introduction {#task-1}

This room covers what a computer is, what its building blocks are, and how they all connect and work together. After finishing it you will have a solid general idea of how the different parts of a computer interact to provide services to its users.

No deep technical jargon here, just the fundamentals.

---

## Task 2 — Inside a Computer System {#task-2}

Every computer system, no matter what it is, is built from the same basic building blocks. Each part has its own job and together they make the whole thing work.

This task uses a really nice interactive static site exercise to teach you what each component does and how it relates to the human body as an analogy. I really recommend doing it properly instead of skipping it. It is well made and genuinely helps the components click in your head.

Here is a quick breakdown of what each component does:

**PSU (Power Supply Unit)** is what powers everything. It takes the electricity from your wall outlet and converts it into the right type and amount of power that each component needs to run.

**CPU (Central Processing Unit)** is the brain of the computer. It handles all the instructions and calculations. Every time you open an app, click something, or run a program, the CPU is the one doing the actual processing.

**RAM (Random Access Memory)** is the short term memory of the computer. When you open something, it gets loaded into RAM so the CPU can access it quickly. The more RAM you have, the more things you can have open and running at the same time. Everything in RAM is wiped when you turn the computer off.

**HDD (Hard Disk Drive)** is a storage device that uses spinning magnetic disks to read and write data. It is where your files, programs and operating system live permanently. It is slower than an SSD but usually cheaper for large amounts of storage.

**SSD (Solid State Drive)** does the same job as an HDD but uses flash memory instead of spinning disks. This makes it much faster, more resistant to physical damage, and quieter. Most modern computers use an SSD as their main drive.

**Motherboard** is what connects everything together. Every component plugs into the motherboard in some way. It is the main circuit board that lets all the parts communicate with each other.

**GPU (Graphics Processing Unit)** handles everything visual. It is built specifically to process and render images, video and animations and send them to your display. It is especially important for gaming, video editing and anything that needs a lot of visual processing power.

Click the green "View Site" button and complete the exercise to get the flag.

**Question: Give in the flag you received after completing the exercise on the static site.** `THM{4llpccomp0n3nts1d3nt1f13d}`

---

## Task 3 — What Happens When You Press the Start Button? {#task-3}

Now that we know what the components are, this task walks through what actually happens from the moment you press the power button to when you see your operating system.

Here is the full process step by step:

**Step 1: Press the Power Button**
A signal is sent to the PSU to let power flow through the system. Everything starts here.

**Step 2: Firmware Starts**
The core components power up but the system is not conscious yet. The firmware kicks in to manage this startup. The main system that handles this is called the UEFI (Unified Extensible Firmware Interface). You will also hear the term BIOS mentioned, it does the same job but UEFI has mostly replaced it.

**Step 3: Power-On Self Test (POST)**
The UEFI runs a test called POST to check that every required component is present, configured correctly and actually working. If something is wrong, the system will throw out some alarm signals here.

**Step 4: Select Boot Device**
The UEFI holds an ordered list of devices and checks them in priority order to find where the operating system is stored.

**Step 5: Initiate Bootloader**
Once the boot device is found, the bootloader starts. It copies the operating system from the boot device into RAM. After that the UEFI hands control of all the components over to the OS and you get your working interface.

Just like task 2, this task has an interactive exercise that walks you through putting the boot steps in the right order. Do it properly, it is the same style as before and really helps the process stick.

**Question: What is the flag that you received after completing the exercise?** `THM{pc5ucce55fully5t4rt3d}`

---

## Task 4 — Conclusion {#task-4}

We now know the core components of a computer and how the boot process works. These might seem like basic concepts right now but they come up a lot later in cyber security. The boot process in particular is something attackers sometimes target, so understanding it early is worth it.

---

The fundamentals are not the most exciting part of learning cyber security but they are the foundation everything else builds on. Knowing what is inside the machine and how it starts up will make a lot of other concepts make more sense down the line.

---