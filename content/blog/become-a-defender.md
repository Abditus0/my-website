---
title: "Become a Defender — TryHackMe Pre Security Path"
date: 2026-04-04
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Become a Defender room - Explore defensive security, cyber infrastructure, and how to protect systems from attacks."
image: "/images/blog/53.png"
readtime: "15 min read"
draft: false
---

# Become a Defender

Okay so we just finished breaking into Mike's website and now TryHackMe flips the script completely. Same situation, opposite seat. Instead of asking how do I get in, you are now asking how do I stop someone from getting in. This is the blue team side of things.

---

## Tasks

- [Task 1 — What is Defensive Security?](#task-1)
- [Task 2 — Understanding Your Environment](#task-2)
- [Task 3 — Defending Your Environment](#task-3)
- [Task 4 — Where to Go From Here](#task-4)

---

## Task 1 — What is Defensive Security {#task-1}

Defensive security is about understanding what needs to be protected and putting measures in place to prevent, detect, and reduce the impact of attacks. Defenders work to get visibility into systems, spot weak points, and keep things available and protected. If that sounds like the CIA Triad, that is because it is exactly that. Confidentiality, integrity, and availability are the goals defenders are working toward every single day.

The room points out something important right at the start. Defenders, often called the Blue Team, need to understand how attackers think. You cannot defend against something you do not understand. That is why the previous room, Become a Hacker, exists. It was not just a fun exercise. It was building the attacker mindset that defenders need to have.

---

## Task 2 — Understanding Your Environment {#task-2}

Before you can protect anything, you need to know what exists and how it all fits together. The room uses a city analogy here.

Think of your client's infrastructure as a city. City guards need to know the layout, watch for trouble, and know how to respond. Defenders need exactly the same thing.

The questions map out like this. What are you protecting, which in city terms is the homes, buildings, and people, and in cyber terms is servers, data, workstations, and users. Can you see what you are protecting, which translates to cameras and patrols in a city and logs, network traffic, and alerts in cyber. What counts as suspicious behavior, like someone trying locked doors or circling cars in a city, and repeated login attempts or unusual IP addresses in cyber. How do you stop a threat, which is police and blocked roads in a city and firewall rules and IP blocking in cyber.

### What defenders actually do

Once you know what systems exist and how they connect, the work organizes into a few core concepts that will keep coming up everywhere in defensive security.

Prevention is putting controls in place to stop attacks before they happen. Things like firewalls, antivirus software, and keeping systems patched and updated.

Detection is monitoring systems and networks to spot suspicious or malicious activity through logs, alerts, and security tools.

Mitigation is what you do during an incident to limit the damage. Blocking traffic, isolating affected systems, disabling compromised accounts.

Analysis is investigating what happened after an incident. Reviewing logs and evidence to understand how the attack unfolded and what was affected.

Response and Improvement is recovering from the incident and then making changes so the same thing is harder to pull off next time.

### What is actually in scope

Defenders are not responsible for protecting the entire internet. They protect what belongs to their organization or client. The room breaks down a sample network you might be tasked with defending.

Employee devices are where users work and access company resources. Think of these as the homes inside the city.

A web server hosts websites or applications. That is the shops and public buildings.

A mail server sends and receives email. The post office.

A firewall controls what traffic is allowed in or out. The city gate.

And then there is everything outside the city walls, the internet, which is external and not under your control at all.

### The exercise

There is a hands-on exercise here where you explore a city representing your client's infrastructure. You map each part of the city to its real-world infrastructure equiva lent. Find what each building represents and get the flag.

**Question: What is the goal when a defender puts security controls in place to stop threats before any damage occurs?** `Prevention`

**Question: What process involves reviewing logs and evidence to understand how an incident happened and what was impacted?** `Analysis`

**Question: What flag did you receive after successfully mapping your city infrastructure?** `THM{mapping_infrastructure!}`

---

## Task 3 — Defending Your Environment {#task-3}

Now that you have mapped the city you need to defend, it is time to actually defend it. This task is about understanding how each part of the environment can be abused and what protections you apply to reduce that risk.

### The defender mindset

The room introduces the defender mindset here and the key shift is this: stop thinking about your systems as separate isolated things. See them as a chain. Attackers rarely just hit one system and stop. They compromise one asset and use it to get to the next one, building toward whatever their actual goal is.

The example the room gives is a good one. A malicious email attachment hits an employee's workstation. The attacker uses that to steal credentials. With those credentials they get into the mail server. From the mail server they reach sensitive data on a database server. Each step builds on the last. And each step is also an opportunity for a defender to catch it or block it.

Four key principles the room outlines for defenders:

Threat anticipation means looking at your systems and asking what if. Think about realistic paths an attacker might take to reach their goal.

Attack awareness means understanding that attacks tend to follow recognizable stages. Studying common attack chains and frameworks helps defenders know what to watch for.

Risk prioritization means accepting that not every system carries equal risk. Identify which systems are high-value targets and focus defenses accordingly.

Continuous adaptation means defense is never a one-time setup. Threats evolve, techniques change, new vulnerabilities show up. Defenders have to keep up.

### What you use to protect each part

The room goes through the client infrastructure again, this time matching each component to the risks it faces and the defenses available.

Employee devices are at risk when someone clicks a bad link or downloads something unsafe. You protect them with antivirus software to detect bad programs and regular software updates to close known vulnerabilities.

The web server can be targeted by attackers trying to break in directly. You protect it by only allowing safe traffic through and using secure communications.

The mail server is a vector for malicious or deceptive emails. Spam filters and scanning attachments are the defenses here.

The firewall itself can be probed by strangers from the internet. You protect it with strict rules controlling what traffic is allowed and by blocking known bad sources.

And for threats coming from the internet in general, you restrict inbound traffic and monitor for anything suspicious.

### The exercise

The hands-on exercise here has you applying those security controls across your client's city infrastructure. Work through each part and apply the right defenses to get the flag.

**Question: Which defender principle focuses on identifying the most critical systems to guide security efforts and focus?** `Risk prioritization`

**Question: What flag did you receive after successfully defending your city's infrastructure?** `THM{defensive_techniques!}`

---

## Task 4 — Where to Go from Here {#task-4}

The room wraps up with a terminology recap and a look at where things go from here.

The key terms:

Blue Team is the group of cyber security defenders protecting systems and responding to threats. Client Infrastructure is the networks, servers, devices, and applications that need protection. Visibility is the ability to see and monitor activity across systems to spot potential issues. Threat is any potential danger, like a hacker or malware, that could cause harm. Prevention is stopping threats before they cause damage. Detection is identifying threats or suspicious activity. Mitigation is reducing or stopping the impact once a threat is identified. Risk is the likelihood and potential impact of a threat actually doing damage.

### Career paths in defensive security

If the defender side of things feels interesting, a few directions the room points to:

Security Operations Center, or SOC, is about monitoring networks and systems to detect and investigate suspicious activity and security alerts. This is one of the most common entry points into defensive security.

Threat Intelligence is researching current threats, attackers, and trends so organizations can prepare and defend against what is coming.

Digital Forensics and Incident Response, known as DFIR, is investigating security incidents after they happen to understand how an attack unfolded and then containing the damage to restore affected systems.

### This is the end of the Pre Security path

This room is the last one in the TryHackMe Pre Security path. If you made it all the way through, that is a real milestone. You went from understanding how computers and networks work, through operating systems and the web, into the CIA Triad, cryptography, ethical hacking, and now defensive security. That is a lot of ground covered.

The certificate is available to claim from TryHackMe if you completed everything. From here the suggested paths are Cyber Security 101, SOC Level 1, and Jr Penetration Tester depending on which direction you want to go.

I am going to keep going with Cyber Security 101 path. There is still a lot to learn and these rooms have been getting more interesting the further in you get. 

---