---
title: "Defensive Security Intro — TryHackMe Pre Security Path"
date: 2026-03-18
category: "TryHackMe · Writeup"
excerpt: "Complete walkthrough of TryHackMe's Defensive Security Intro"
image: "/images/blog/2.png"
readtime: "10 min read"
draft: false
---

# Defensive Security Intro

---
## Tasks

- [Task 1 — Introduction to Defensive Security](#task-1)
- [Task 2 — Areas of Defensive Security](#task-2)
- [Task 3 — Practical Example of Defensive Security](#task-3)

---

## Task 1 — What is Defensive Security? {#task-1}
If offensive security is about breaking in, defensive security is the other side, preventing attacks from happening and dealing with them when they do.

The Blue Team handles this. Things like keeping systems updated, monitoring the network, setting up firewalls, training users not to click sketchy links. Less glamorous than red teaming but just as important.

The room also mentions some topics coming up later in the path such as SOC, Threat Intelligence, DFIR, Malware Analysis.

**Question: Which team focuses on defensive security?** `Blue Team`

---

## Task 2 — Areas of Defensive Security {#task-2}
This task covers two big areas you'll keep hearing about in cyber. SOC and DFIR.

A **SOC** (Security Operations Center) is basically a team that watches the network 24/7, looking for vulnerabilities, policy violations, unauthorized access, intrusions. If something suspicious happens, they're the ones catching it. 

Connected to that is **Threat Intelligence**, gathering information about potential attackers, understanding their tactics, and using that to build better defenses.

**DFIR (Digital Forensics and Incident Response)** covers three things. Digital Forensics, Incident Response, and Malware Analysis. Forensics is about investigating what happened after an attack. 

**Digital Forensics** — investigating what happened after an attack by analyzing file systems, memory, logs, and network traffic.

**Incident Response** is the plan you follow when an attack occurs. It has four phases: Preparation, Detection & Analysis, Containment/Eradication/Recovery, and Post-Incident Activity.

**Malware Analysis** — figuring out what a malicious program does. You can do this **statically** (inspecting the code without running it) or **dynamically** (running it in a controlled environment and watching what it does).

The malware types mentioned here are ones you'll see constantly going forward: viruses, trojans, and ransomware.

- **Virus** — Attaches itself to a program and spreads between computers, altering or deleting files.
- **Trojan** — Looks like a legitimate program but hides a malicious function underneath.
- **Ransomware** — Encrypts your files and demands payment to get them back.

**Question: What would you call a team of cyber security professionals that monitors a network for malicious events?** `Security Operations Center`

**Question: What does DFIR stand for?** `Digital Forensics and Incident Response`

**Question: Which kind of malware requires the user to pay money to regain access to their files?** `Ransomware`

---

