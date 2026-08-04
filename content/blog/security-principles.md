---
title: "Security Principles — TryHackMe Cyber Security 101"
date: 2026-05-18
category: "writeup"
excerpt: "Walkthrough of TryHackMe's Security Principles room — Learn about the security triad and the various security models and principles."
image: "/images/blog/144.png"
readtime: "30 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — CIA](#task-2)
- [Task 3 — DAD](#task-3)
- [Task 4 — Fundamental Concepts of Security Models](#task-4)
- [Task 5 — Defence-in-Depth](#task-5)
- [Task 6 — ISO/IEC 19249](#task-6)
- [Task 7 — Zero Trust versus Trust but Verify](#task-7)
- [Task 8 — Threat versus Risk](#task-8)
- [Task 9 — Conclusion](#task-9)

---

## Task 1 — Introduction {#task-1}

This is a theory room. No machines to spin up, no commands to run, just a bunch of concepts you need to know if you're going anywhere in security. I know theory rooms aren't the most exciting thing but honestly the stuff in this one comes up everywhere later, so it's worth actually reading instead of just clicking through.

The room sets up the basic idea right away which is that "secure" is a meaningless word on its own. Every company says their product is secure. What does that even mean? Secure against who? A toddler with sticky fingers and a laptop is not the same threat as a nation-state actor going after blueprints worth millions. The defences you'd build for one are pointless against the other. So before you can say something is secure you have to know what you're protecting and who you're protecting it from.

The other thing the room hammers right at the start is that perfect security doesn't exist. There's no 100% secure system. You're not trying to make something unbreakable, you're trying to make it hard enough that the attacker gives up or gets caught first. That mindset shift took me a while to actually internalize.

No questions in this task, just read and move on.

---

## Task 2 — CIA {#task-2}

CIA. Not the spy agency. Confidentiality, Integrity, Availability. If you remember nothing else from this whole room remember these three because they come up in literally every security conversation forever.

Quick rundown:

- **Confidentiality** means only the people who are supposed to see the data can see it.
- **Integrity** means the data can't be messed with, and if it does get messed with, you can tell.
- **Availability** means the thing actually works when you need it to.

The room runs through two examples and they're both pretty good for getting it to click.

**Online shopping.** Confidentiality is your credit card number only going to the payment processor and not getting leaked to half the internet. Integrity is your shipping address not getting swapped out for someone else's after you hit submit. Availability is the site actually loading when you want to buy something, because if it keeps timing out you're going to give up and order from somewhere else.

**Medical records.** Confidentiality is your health information staying private because there are actual laws about this and hospitals get sued when they leak. Integrity is your record not getting altered, because if someone changes your allergy info you could get the wrong drug and die. Availability is the doctor being able to pull up your file when you're sitting in front of them, otherwise they have to guess.

One important note. The three aren't always equally important. A university posting an announcement doesn't really care if everyone sees it, that's the whole point, but they really care that nobody changes what it says. Integrity over confidentiality. Different situations weight these differently.

### Beyond CIA

Then the room adds two more concepts that aren't part of the triad but pair well with it.

**Authenticity** is making sure the data actually came from who it claims to be from. Not fake, not spoofed.

**Nonrepudiation** is making sure the sender can't later deny that they sent it. "I never placed that order" doesn't fly if there's proper nonrepudiation in place.

These two go together. The car example in the room is actually really good. If someone orders a t-shirt cash-on-delivery and it turns out to be fake, fine, eat the cost of one t-shirt. If someone orders 1000 cars and you ship them and then they go "wasn't me lol" you are bankrupt. So for anything serious you need to verify it's actually them (authenticity) and you need to lock in that they can't back out later (nonrepudiation).

### Parkerian Hexad

In 1998 a guy named Donn Parker said CIA wasn't enough and proposed six things instead:

1. Availability
2. Utility
3. Integrity
4. Authenticity
5. Confidentiality
6. Possession

We already covered four of those. The new ones are:

**Utility** is whether the data is actually useful. The room's example is a laptop with encrypted storage where the user lost the decryption key. The data is right there, technically available, but it's useless because you can't read it. So it has no utility.

**Possession** is whether you actually have control of the data. If someone steals your backup drive, you've lost possession even if they never look at what's on it. If ransomware encrypts your files, same thing, you've lost possession. The data still exists, you just can't touch it.

### View Site quiz

There's a "View Site" button that opens a little quiz with five questions. Just go through them, they're all just applying CIA to scenarios. The flag at the end is what you submit.

**Click on "View Site" and answer the five questions. What is the flag that you obtained at the end?** `THM{CIA_TRIAD}`

---

## Task 3 — DAD {#task-3}

Now flip CIA upside down and you get DAD. Disclosure, Alteration, Destruction/Denial. These are basically the attacks that break each part of CIA.

- **Disclosure** breaks confidentiality. Data getting leaked.
- **Alteration** breaks integrity. Data getting changed.
- **Destruction/Denial** breaks availability. Data or system being unreachable.

The same medical records example shows up again because it works for both sides.

Disclosure of medical records is when an attacker steals a bunch of patient files and dumps them on a forum somewhere. Bad for the patient, very bad for the hospital legally.

Alteration of medical records is way scarier than people realize. An attacker changes a patient's drug allergy from "penicillin" to nothing. Patient comes in, gets penicillin, dies. That's a real worst case.

Destruction or denial is the hospital going fully digital and then the database goes down. They can technically fall back to paper for new stuff but they can't see any of the old records. The whole place grinds to a halt.

The room makes a really good point at the end of this task that I want to flag because it's easy to miss. If you crank confidentiality and integrity all the way up, you hurt availability. Lock everything behind so much auth and encryption that legitimate users can't even get to it. And if you crank availability all the way up, you hurt confidentiality and integrity. Make everything wide open so everyone can always access it, congrats you have no security. Good security is balancing the three, not maxing one out.

**The attacker managed to gain access to customer records and dumped them online. What is this attack?** `Disclosure`

**A group of attackers were able to locate both the main and the backup power supply systems and switch them off. As a result, the whole network was shut down. What is this attack?** `Destruction/Denial`

---

## Task 4 — Fundamental Concepts of Security Models {#task-4}

Okay so we know we want confidentiality and integrity, how do we actually build a system that does that? That's what security models are for. They're basically rule sets that, if you follow them, give you certain security properties.

The room covers three.

### Bell-LaPadula

This one is all about confidentiality. It has three rules but really only two of them are interesting.

**Simple Security Property** is "no read up." Someone with a low clearance can't read stuff at a high clearance. Makes sense, a private can't read general's mail.

**Star Security Property** is "no write down." Someone with a high clearance can't write to a low clearance level. This one trips people up at first. Why can't a general write to a private? Because if they could, sensitive info would leak downward. The general might paste classified info into a doc the private can read. So you just block writing downward entirely.

**Discretionary-Security Property** is just an access matrix on top of the other two, saying who can do what to which object.

Easy way to remember Bell-LaPadula: **write up, read down**. You can pass info upward to your bosses and you can read info from below you. That's it.

It wasn't designed for file sharing though so it's not perfect for modern systems.

### Biba

Biba is the opposite of Bell-LaPadula because it cares about integrity instead of confidentiality.

**Simple Integrity Property** is "no read down." A high integrity subject can't read from a low integrity object. Why? Because if a trustworthy person keeps reading from sketchy sources their stuff might get tainted by bad data.

**Star Integrity Property** is "no write up." A low integrity subject can't write to a high integrity object. Same idea, don't let untrusted stuff pollute trusted stuff.

So Biba is **read up, write down**, the exact opposite of Bell-LaPadula. Which makes sense because they're solving opposite problems. Biba's main weakness is it doesn't handle insiders, somebody who's already trusted can still mess things up from the inside.

### Clark-Wilson

This one is also for integrity but it's structured differently. Instead of rules about reading and writing it defines a bunch of components:

- **CDI** (Constrained Data Item) is the data you actually care about protecting.
- **UDI** (Unconstrained Data Item) is everything else, including user input.
- **TPs** (Transformation Procedures) are the only operations allowed to touch CDIs. Like, you can't write to the protected data directly, you have to go through a defined function.
- **IVPs** (Integrity Verification Procedures) are checks that run to make sure the CDIs are still valid.

The mental model here is that you don't let anyone bang on the protected data with raw queries. You force them to go through specific procedures, and you run integrity checks to confirm nothing got broken.

There are a bunch of other models the room name-drops: Brewer and Nash, Goguen-Meseguer, Sutherland, Graham-Denning, Harrison-Ruzzo-Ullman. You don't need to know them for this room, just be aware they exist if you bump into them later.

### View Site quiz

Same deal as before, click View Site, answer four questions about which model fits which scenario, grab the flag.

**Click on "View Site" and answer the four questions. What is the flag that you obtained at the end?** `THM{SECURITY_MODELS}`

---

## Task 5 — Defence-in-Depth {#task-5}

Defence-in-Depth is one of those concepts where the name kind of tells you the whole thing. Don't rely on one layer of security. Stack them.

The room's analogy is solid. You keep your valuable stuff in a locked drawer. Is that drawer lock the ONLY thing between a thief and your stuff? Of course not. The drawer is in a locked room. The room is in a locked apartment. The apartment is in a building with a locked gate. Maybe there's a security camera or two. Each layer on its own isn't perfect. But together they make it really annoying to actually steal anything.

Same idea in security. You don't put all your faith in your firewall. You also have endpoint protection, you also have network segmentation, you also have logging and monitoring, you also have access controls, you also train your users not to click weird links. Any one of those can fail. The hope is that not all of them fail at once.

No questions in this task.

---

## Task 6 — ISO/IEC 19249 {#task-6}

This is the bureaucratic part of the room. ISO and IEC put out a standard called ISO/IEC 19249 that lays out architectural and design principles for secure systems. It's not the most exciting read but the principles themselves are useful and they show up in interviews and certs all the time.

There are five architectural principles and five design principles. I'll go through them.

### Architectural principles

**1. Domain Separation.** Group related stuff together, give each group its own domain with its own security properties. The classic example is x86 CPU rings. Ring 0 is the kernel, ring 3 is user apps. They're separated, the user apps can't just go poking at kernel memory. Same idea applies at higher levels, you separate your domains so a breach in one doesn't automatically mean a breach everywhere.

**2. Layering.** Build the system in layers, each layer doing its own job, and you can apply security policies at each layer. The OSI model is the example everyone uses. Seven layers, each one with its own responsibilities. Another example is programming languages hiding low-level disk operations from you, you call `write()` and the language handles the syscalls. Layering is basically defence-in-depth from a different angle.

**3. Encapsulation.** This is the OOP concept. Don't let people poke at your internal data directly, force them to use methods you control. The clock example in the room is good. Don't expose the `seconds` variable, expose an `increment()` method instead. That way the variable can't be set to invalid values. Same applies to bigger systems. You don't let apps query your database raw, you give them an API.

**4. Redundancy.** Have backups of important things so one failure doesn't bring you down. Two power supplies in a server so if one dies the other keeps it running. RAID for disks so you can lose a drive and not lose data. Redundancy gives you both availability (the thing keeps working) and integrity (you can detect when something got corrupted).

**5. Virtualization.** Running multiple OSes on shared hardware. The security benefit is sandboxing. You can run malware in a VM and it can't escape to the host (in theory, VM escapes are a real thing but they're hard). Lets you analyze sketchy stuff without nuking your actual system.

### Design principles

These are the ones the room actually asks questions about. Read these closely.

**1. Least Privilege.** Give people the minimum access they need to do their job. Need-to-know basis. If someone only needs to read a doc, don't give them write access. This sounds obvious but in practice tons of companies just hand out admin rights because it's easier than figuring out what each person actually needs. Bad idea. The day one of those accounts gets phished you'll wish you'd done it properly.

**2. Attack Surface Minimisation.** Every service you run, every port you have open, every feature enabled, is potentially something an attacker can poke at. Turn off what you don't need. Linux hardening 101 is literally just going through services and disabling everything that isn't necessary. Less stuff running, less stuff to attack.

**3. Centralized Parameter Validation.** User input is dangerous. SQL injection, command injection, XSS, all of those are validation failures. The principle says validate inputs in one place, a single library or service, instead of scattered validation logic in every individual handler. Easier to maintain, easier to audit, less likely you forget one spot.

**4. Centralized General Security Services.** Same idea but for security services in general. Have one auth service, not auth logic copy-pasted into every app. One logging system. One key management system. Easier to manage and easier to update when something changes. Caveat though, when you centralize, that thing becomes a single point of failure, so you need redundancy on top of it.

**5. Preparing for Error and Exception Handling.** Stuff will break. Plan for it. The big idea here is "fail safe." If a firewall crashes, it should block all traffic, not allow all traffic. If an auth service goes down, deny access by default, don't grant it. Also, error messages shouldn't leak info, no dumping memory contents or stack traces with internal paths to random users.

Now for the questions. They reference these by number 1 through 5.

**Which principle are you applying when you turn off an insecure server that is not critical to the business?** `2`

That's attack surface minimisation. Server you don't need running, kill it.

**Your company hired a new sales representative. Which principle are they applying when they tell you to give them access only to the company products and prices?** `1`

That's least privilege. Sales rep doesn't need access to engineering files or HR records, just sales stuff.

**While reading the code of an ATM, you noticed a huge chunk of code to handle unexpected situations such as network disconnection and power failure. Which principle are they applying?** `5`

That's preparing for errors and exceptions. ATM has to handle all the weird stuff because if it doesn't you get either a frozen machine or a machine giving out free money, neither is good.

---

## Task 7 — Zero Trust versus Trust but Verify {#task-7}

Trust is messy. You can't actually do anything without some level of trust, like if you don't trust your laptop vendor you'd never use the laptop. But how MUCH trust you extend matters a lot. The room talks about two principles around this.

**Trust but Verify** is the older approach. You trust people and systems but you log everything and check the logs to make sure nothing weird is happening. Sounds reasonable, problem is in practice nobody actually reviews logs unless something blows up. The volume is too high. So you end up needing automated stuff like IDS/IPS to actually do the verifying because humans can't keep up.

**Zero Trust** is the newer hotness. The idea is trust itself is a vulnerability. Don't trust anyone, ever, until they prove who they are. Every request gets authenticated and authorized fresh. Doesn't matter if it's coming from inside your network or outside, doesn't matter if it's a company laptop or some random device, everything has to prove itself. The old model trusted internal networks by default which was kind of insane in hindsight, because once an attacker got past the perimeter they had free run of everything.

**Microsegmentation** is one way zero trust gets implemented in practice. You chop the network up into really tiny segments, sometimes literally one host per segment, and any traffic between segments has to go through auth and ACL checks. If an attacker pops one box they can't just pivot freely to everything else, they have to break through more checks at every step.

Realistically you can't go full zero trust on everything, at some point the friction kills the business. But you apply it where you can.

No questions in this task.

---

## Task 8 — Threat versus Risk {#task-8}

Three words that people use interchangeably but actually mean different things. Worth getting straight.

- **Vulnerability** is a weakness. Just a flaw. The thing has a hole.
- **Threat** is the potential danger from that weakness. Something bad that could happen because of the vuln.
- **Risk** is the likelihood that a threat actually gets exploited combined with how bad it would be for the business if it did.

Glass storefront example. The glass is the vulnerability, it can break. The threat is someone smashing it. The risk is how likely that is in your specific neighborhood and how much damage you'd actually take if it happened.

For an IT example, say you run a hospital with a database product that just had a critical CVE drop. The vuln is the bug itself. The threat became very real once exploit code got published, because now anyone can use it. The risk is your actual probability of getting popped times the damage if you do, which for a hospital with medical records is gigantic. So you patch immediately even if the original CVSS score wasn't that high.

The room says risk gets its own dedicated room later. Just get the words straight for now.

No questions in this task.

---

## Task 9 — Conclusion {#task-9}

Big wrap-up. You should now know CIA, DAD, the extra stuff like authenticity and nonrepudiation and the Parkerian Hexad, the three security models (Bell-LaPadula, Biba, Clark-Wilson), defence-in-depth, the ISO/IEC 19249 principles, trust but verify vs zero trust, and the difference between vulnerability, threat, and risk.

The room slips in one last concept at the end which is the **Shared Responsibility Model**. This one matters because cloud is everywhere now. Basic idea is that when you use a cloud service, security is split between you and the provider, and the split depends on the service type.

If you're using IaaS (infrastructure as a service), like an EC2 instance, you control the OS so you're responsible for OS-level security, patching, hardening, all of that. The provider handles the hardware and the hypervisor.

If you're using SaaS (software as a service), like Gmail, you don't touch the OS at all. The provider handles basically everything except your account credentials and what you actually do with the app.

The mistake people make is assuming the cloud provider handles everything. They don't. If you misconfigure an S3 bucket and leak customer data, that's on you, not AWS. AWS gave you the tools to secure it, you didn't use them.

No questions in this task either.

---

## Wrap up

Theory rooms are not the most fun but this one is genuinely useful because every concept in it shows up later. CIA in particular you'll see referenced constantly, like, in every other room. The security models you'll see if you do anything with compliance or certs. ISO/IEC 19249 principles are basically interview bingo cards.

Couple things worth keeping in your head from this:

One, no system is perfectly secure. Stop chasing that. Aim for "hard enough that attackers move on or get caught."

Two, the three parts of CIA pull against each other. Locking things down hurts availability. Opening things up hurts confidentiality and integrity. Good security is finding the right balance for your specific situation, not maxing one slider.

Three, the Bell-LaPadula vs Biba "write up read down" vs "read up write down" thing is super easy to mix up. Just remember Bell-LaPadula = confidentiality, Biba = integrity, and the rules are opposites because the goals are opposite.

Four, zero trust isn't a product, it's an approach. Anyone selling you a "zero trust solution" is selling you a thing, not the principle. The principle is "stop trusting things by default."

Five, vulnerability, threat, and risk are NOT synonyms. Get this right because mixing them up makes you sound like you don't know what you're talking about.

Onto crypto.

---
