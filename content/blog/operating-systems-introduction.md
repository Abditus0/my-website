---
title: "Operating Systems: Introduction — TryHackMe Pre Security Path"
date: 2026-03-22
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Operating Systems: Introduction room - Explore the basics of operating systems and the core features that power your computer."
image: "/images/blog/35.png"
readtime: "20 min read"
draft: false
---

# Operating Systems: Introduction

You use a computer every day. You click things, apps open, files save, music plays. It all just works. But have you ever stopped and thought about what is actually making all of that happen? Like, what is sitting between you tapping a key and the machine actually doing something? That is exactly what this room is about.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — The Invisible Manager](#task-2)
- [Task 3 — OS Interaction and Landscape](#task-3)
- [Task 4 — Conclusion](#task-4)

---

## Task 1 — Introduction {#task-1}

So the scenario here is kind of fun. A friend upgraded their computer and gave you their old one. They do not remember much about it, just that it "used to run well." You need to figure out what you are actually working with before you do anything to it.

The room builds on the Computer Fundamentals module and now focuses on the Operating System (OS), the layer that ties all the physical hardware together and makes everything actually usable. By the end of this room you will know what an OS is, what it does, the different types out there, and you get to poke around that mystery machine your friend handed you.

---

## Task 2 — The Invisible Manager {#task-2}

**So what even is an OS**

An operating system is the core software that sits between you, your apps, and the physical hardware. You never really see it doing its thing but it is managing basically everything happening on your machine at all times.

The room uses an airport analogy and honestly it is a pretty good one. Your hardware, the CPU, RAM, storage, all the physical stuff, is like the runways, planes, and radar. Your apps are the airlines trying to take off and land. And the OS is the air traffic control system, scheduling everything, handling conflicts, making sure nothing crashes into anything else.

Without an OS every single app would need to directly control the CPU and memory and every device itself. That would be a disaster. Two apps trying to write to the same memory at the same time, nothing would know what anything else is doing. The OS stops all of that by being the one central thing in charge.

**Kernel space vs user space**

This part is important and comes up a lot later in security topics so it's worth understanding it.

Inside a modern OS there are two separate layers of privilege.

Kernel space is the locked down core. The kernel itself lives here and it has full unrestricted access to everything, the CPU, memory, all hardware. Nothing gets to touch the hardware directly except the kernel. The kernel is basically the core of the OS, the part that actually talks to the hardware directly. When an app wants to do something like save a file or play a sound, it cannot do that itself, it has to ask the kernel to do it. The kernel then goes and handles it at the hardware level.

Think of it like a middleman. Apps on one side, hardware on the other, kernel in the middle handling all the requests.

User space is where all your normal apps live. Your browser, your music player, your games, none of them can touch hardware directly. When they need to do something like save a file or play a sound they have to make a system call, basically sending a request up to the kernel asking it to do that thing on their behalf.

Going back to the airport thing, the kernel is the control tower. Strictly secured, only trusted people inside. The apps are airlines on the ground. They cannot walk into the tower or touch any of the equipment. They have to radio in their requests and the tower handles it. This is also why one broken app does not usually take down your whole system.

**What the OS actually does**

There are five main responsibilities the OS handles constantly in the background.

Process management is how the OS handles every running program. It decides how much CPU time each process gets, switches between them so fast it feels like everything is running at the same time, and cleans up when something closes or crashes.

Memory management is how the OS hands out RAM to each process, keeps them from messing with each other's memory, and when RAM gets low it uses virtual memory to keep things going. Virtual memory is a trick the OS uses when RAM gets full. Instead of crashing, it moves stuff that has not been used in a while from RAM to your storage drive to free up space. Slower than real RAM but it keeps things running.

File system management is everything to do with how files are stored and organized. Creating folders, saving files, setting read-only permissions, keeping track of file names and sizes and timestamps.

User management is how the OS handles multiple accounts on one machine. Your login, your password, making sure your files are not readable by someone else on the same computer.

Device management is how your OS talks to hardware. When you plug in a new mouse or a printer the OS loads the right driver and gives apps a way to use that device without needing to know anything about how it actually works internally.

**Security built in from the start**

Before you even install antivirus software or set up a firewall the OS is already doing security work. It handles authentication, checking who you are when you log in. It enforces permissions, controlling what each user and app is allowed to do. It keeps processes isolated from each other. And it protects critical system files from being messed with.

**Hands-on time**

Here is where you fire up the machine your friend gave you. There is a shortcut on the desktop called About This Computer that opens the System Monitor. Opening it up shows you a full overview of what you are working with.

Turns out the machine is running Ubuntu Mate 1.26.2 and has 1.9 GiB of memory allocated. Not a powerhouse but enough to work with.

**Question: Which OS space has unrestricted access to your computer's hardware?** `Kernel Space`

**Question: Which OS responsibility manages user accounts, authentication, and permissions?** `User Management`

**Question: After opening the About This Computer shortcut, you are greeted with an overview of the system's specifications. What version of Ubuntu Mate is your computer running?** `1.26.2`

**Question: Check out the Hardware section of the System tab. How much memory is allocated to your machine?** `1.9 GiB`

---

## Task 3 — OS Interaction and Landscape {#task-3}

**Two ways to talk to your OS**

There are two main ways to interact with an OS and you have probably used both without thinking about it much.

The GUI is the graphical user interface. Windows, icons, menus, clicking around. It is what most people use every day and it is perfectly fine for most things. The room compares it to using a maps app where you just tap the place you want to go and it figures out the route for you.

The CLI is the command line interface. Instead of clicking around you type exact commands. It is way more powerful and precise but you need to actually know the commands. The room compares it to typing exact GPS coordinates instead of tapping a destination. Faster and more accurate but only if you know what you are doing. Later in the module you get into the CLI on both Linux and Windows properly.

**Not all operating systems are the same**

This is something that trips people up when they are starting out. There is not one OS that works for everything. Different jobs need different designs and the room breaks it down into five categories.

Desktop OS is what you use on a personal computer. Needs a nice GUI, needs to handle lots of apps running at once, needs to be user friendly. Windows, macOS, and Linux distributions like Ubuntu all live here.

Server OS is built for machines that just run in a data center somewhere. Usually no GUI at all, needs to stay online constantly, needs to handle lots of users connecting remotely. Linux dominates here, Windows Server exists too.

Mobile OS is for phones and tablets. Needs to be power efficient, touch based, always connected. Android and iOS own this space completely.

Embedded OS is for devices with one specific job. Your router, your smart TV, your car's control system. These run on very limited hardware and the OS needs to be tiny and purpose built.

Virtual and Cloud OS is for virtual machines and containers running in data centers. Lightweight, designed to spin up fast, built to scale. Things like Ubuntu LTS on cloud servers or container-focused systems like Alpine Linux.

**The real world OS families**

Going a bit deeper, here are the actual OS families you will run into depending on where you are working.

On the desktop side Windows is the most common by far. macOS is Apple's thing, polished and tied tightly to their hardware. Linux is not one single OS but a whole family of distributions, Ubuntu, Debian, Fedora, and many more.

On the server side Linux runs the vast majority of web servers in the world. Windows Server exists and is common in corporate environments. Unix systems like IBM AIX and Oracle Solaris still show up in finance, government, and telecom.

For mobile it is basically Android and iOS. Android runs on almost everything, iOS is locked to Apple devices.

For embedded devices you have specialized Linux builds like OpenWrt or Ubuntu Core, and for systems that need real-time guaranteed responses like aircraft controls you have things like FreeRTOS and VxWorks.

For cloud and virtual environments you mostly see Ubuntu LTS, Amazon Linux, and Rocky Linux for VMs, and lightweight options like Alpine Linux or Bottlerocket for containers.

**Why so many**

The reason there are so many is that no single OS is perfect for every situation. A laptop needs to be friendly and handle multitasking. A server needs to be stable and never go down. A phone needs to be power efficient. An embedded device needs to be tiny. Different goals lead to different systems and that is fine, it just means you need to know which is which.

**Back to the mystery machine**

From the previous task you already know the machine is running Ubuntu, a Linux distribution. Now it is time to dig a bit deeper.

Opening the File Systems tab in System Monitor shows the `/dev/root` device is using `ext4` as its file system type. That is the standard Linux file system, totally expected.

Then jumping over to the Home directory on the desktop, you can see there are 3 user directories in there.

Navigating into Alex's home directory and opening the Documents folder, there is a file called `note.txt` there. Opening it gives you the flag.

**Question: Open the File Systems tab in System Monitor. What Type is listed for the /dev/root device?** `ext4`

**Question: After opening the Home directory on the Desktop, how many user directories exist?** `3`

**Question: Navigate to Alex's home directory and explore the Documents folder. What is the flag value contained in note.txt?** `THM{new_pc_for_free!}`

---

## Task 4 — Conclusion {#task-4}

That wraps up Operating Systems: Introduction. The big takeaways from this room are understanding what the OS actually does behind the scenes, the difference between kernel space and user space, how the OS handles processes, memory, files, users, and devices, and why different types of devices end up running very different operating systems.

The hands-on side was fun too. You took a mystery machine with basically no info about it, fired it up, poked around the system monitor and the file system, found some user directories, and grabbed a flag out of a text file in someone's Documents folder. Not bad for a free computer.

Quick recap of the key terms from this room:

Operating system is the core software managing hardware, applications, and all system resources on a machine.

Kernel space is the privileged area of the OS with direct hardware access, where the kernel lives and runs.

User space is where regular applications run with limited permissions, kept away from direct hardware access for stability and security.

GUI stands for graphical user interface, the visual part of the OS with windows, icons, and menus you interact with by clicking.

CLI stands for command-line interface, a text-based way to control the system by typing commands directly.

---