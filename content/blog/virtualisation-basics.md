---
title: "Virtualization — TryHackMe Pre Security Path"
date: 2026-03-20
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Virtualization room - Learn why virtualisation powers modern IT, improving efficiency and safely isolating environments."
image: "/images/blog/30.png"
readtime: "12 min read"
draft: false
---

# Virtualization

Have you ever thought about how expensive it would be if every website or app needed its own physical server? That would be a lot of hardware sitting around mostly doing nothing. Virtualization was created to fix exactly that problem, and it is now the foundation of pretty much everything that runs on the modern internet.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Virtualization Overview](#task-2)
- [Task 3 — Virtualization Components](#task-3)
- [Task 4 — Managing Virtual Machines](#task-4)
- [Task 5 — Conclusion](#task-5)

---

## Task 1 — Introduction {#task-1}

In previous rooms we learned what makes up a computer and how those parts talk to each other. This room builds on that by explaining how companies took those same components and made them way more efficient through virtualization.

Your manager needs help improving how a server hosting a website uses its hardware. That is the practical scenario this room uses to walk you through the concept.

---

## Task 2 — Virtualization Overview {#task-2}

Before virtualization existed, the rule in IT was simple: one server, one application. If a company needed to run a website, a database, an email service, and an internal app, they bought four separate physical servers. Each one had a single job.

That created some pretty obvious problems. Buying and maintaining multiple physical servers is expensive. You are paying for hardware, electricity, cooling, and space. On top of that, most applications never actually use the full capacity of a server. A lot of them sit at 5 to 20% usage, so you are paying full price for a machine that is mostly idle. Setting up a new server could also take days or weeks, and if an app suddenly needed more power, your only option was to go buy another machine.

Virtualization changed that by asking a different question: what if multiple applications could safely share the same physical server?

To make that work, a piece of software called a hypervisor was introduced. The hypervisor sits between the physical hardware and the software running on it, acting as a referee that keeps everything separate and running independently.

The room uses a building analogy to explain this and it is a good one. Imagine one person living alone in a 10 floor building. They only use one floor but still pay for the whole thing. Now imagine splitting that building into apartments. Each tenant has their own space, their own privacy, and their own setup, but they all share the same walls, plumbing, and electricity. Everyone wins.

In virtualization terms: the building is the physical server, the apartments are virtual machines, the tenants are the applications, and the building manager is the hypervisor.

**Question: What does virtualization enable multiple applications to share?** `Physical Server`

**Question: What is the name of the software that manages the resources for each virtual machine?** `Hypervisor`

---

## Task 3 — Virtualization Components {#task-3}

**Hypervisors**

A hypervisor is the software that makes virtualization possible. It splits one physical machine into multiple virtual ones, gives each of them their own slice of CPU, memory, and storage, keeps them isolated from each other, and manages their full lifecycle from starting them up to deleting them.

There are two types of hypervisors. Type 1 runs directly on the physical hardware with no operating system in between. This makes it fast and efficient, which is why it is used in production servers and data centers. Type 2 runs inside an existing operating system, like running VirtualBox on your machine. It is easier to set up and great for learning, testing, or building a home lab.

**Virtual Machines**

A virtual machine is a full virtual computer created by the hypervisor. Even though it is virtual, it behaves exactly like a real machine. It has its own virtual CPU, RAM, storage, and network. It can run any operating system. And it is completely isolated, so if one VM crashes or gets infected, the others keep running without any issue.

Tools like Oracle VirtualBox and VMware Workstation are Type 2 hypervisors that let you run VMs on your own computer. Some common use cases are running Kali Linux on a Windows machine without buying new hardware, or safely opening a suspicious file inside an isolated VM so your main system stays clean.

**Containers**

Containers take the idea of lightweight isolation even further. A container runs a single application along with everything that application needs to work. The big difference from a VM is that containers do not bring their own operating system. Instead they share the kernel of the host system, which is the part of the OS that handles communication with the hardware and manages memory and processes.

Because of that, containers start almost instantly and use far fewer resources than full VMs. The trade off is that they have to match the host system type. You cannot run a Windows container on a Linux machine.

Containers are self contained, consistent, and easy to move between machines, which makes them perfect for deploying applications at scale. Docker is the most popular tool for working with containers and makes the whole process much simpler.

To put it simply: VMs are full apartments with maximum isolation and flexibility. Containers are lightweight rooms inside those apartments, ideal for fast and scalable deployments.

**Question: Suppose a user wants to deploy a study lab on their machine to practice some exercises for a cyber security certification. Which type of hypervisor will they use?** `Type 2`

**Question: Suppose a company wants to host multiple small applications in the same virtual machine. What should they use?** `Containers`

---

## Task 4 — Managing Virtual Machines {#task-4}

This task puts you in the role of someone managing the virtual environment for a company called AutoGalo. They use an app called Virtualization Manager that shows you the state of all VMs and physical hosts in one place.

**Fixing the email server**

Your manager reports that everyone stopped receiving emails. You open the Virtualization Manager and go to the Virtual Machines section. The VM called `Mail-SERVER` is sitting in an Error state. You click the blue restart button and it comes back up clean with no errors.

**Creating a new VM**

After sorting the email issue, you get a new task: create a VM for the marketing team's website. You click the `+ Create VM` button and fill in the details.

- Name: `Marketing-VM`
- CPU Cores: `4`
- Memory (GB): `8`
- Disk Size (GB): `100`

After clicking Create VM, the new machine appears at the top of the list. Press the green button to start it.

**Checking host health**

The Hosts section shows the physical servers running everything. `HV-PROD-01` still has room for more VMs. `HV-PROD-02` is almost at 100% capacity and needs to be flagged to your manager. `HV-BACKUP-01` is disconnected and not hosting anything.

**Question: What is the name of the virtual machine that has been running for the longest time?** `Monitoring-SYS`

**Question: What is the name of the virtual machine that is using the biggest amount of memory?** `DB-Cluster-01`

**Question: How many VMs are in the running state after you solved the issue on `Mail-SERVER`?** `8`

**Question: What is the name of the physical machine that is hosting most of the VMs?** `HV-PROD-02`

---

## Task 5 — Conclusion {#task-5}

This room covered a lot of ground. Virtualization lets one physical machine act like many separate computers. The hypervisor is the software that makes that possible. Virtual machines are full independent systems sharing the same hardware underneath. Containers go one step further by skipping the full OS and sharing the host kernel instead, making them faster and lighter for running individual applications.

The benefits stack up quickly: lower costs, better use of hardware, safe environments for testing, faster deployment, and the ability to scale without buying more physical machines.

---