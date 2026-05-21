---
title: "Incident Response Fundamentals — TryHackMe Cyber Security 101"
date: 2026-05-21
category: "writeup"
excerpt: "Walkthrough of TryHackMe's Incident Response Fundamentals room — Learn how to perform Incident Response in cyber security."
image: "/images/blog/127.png"
readtime: "22 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction to Incident Response](#task-1)
- [Task 2 — What are Incidents?](#task-2)
- [Task 3 — Types of Incidents](#task-3)
- [Task 4 — Incident Response Process](#task-4)
- [Task 5 — Incident Response Techniques](#task-5)
- [Task 6 — Lab Work Incident Response](#task-6)
- [Task 7 — Conclusion](#task-7)

---

## Task 1 — Introduction to Incident Response {#task-1}

Incident Response. Or IR if you're in a hurry. This is one of those topics that sounds boring on paper but is probably the most important thing in defensive security, because no matter how good your prevention is, eventually something gets through. And then what? That "and then what" is what this whole room is about.

The room kicks off with a house analogy. You can have cameras and a security guard and a fancy door, but what happens if someone gets in anyway? Do you just stand there? No. You have a plan. Call the cops, get the kids in the safe room, lock down the valuables. That's incident response. The plan for after the bad thing already happened.

In cyber world, an incident is basically anything bad that happened. Not "could happen", but "happened". And the IR process is the playbook for dealing with it from "oh no" to "okay we cleaned that up and here's how to make sure it doesn't happen again."

Heads up before we go further. This room is mostly theory with a lab at the end. Most of the value is in understanding the SANS and NIST frameworks because you're going to see those referenced everywhere in defensive security for the rest of your career.

---

## Task 2 — What are Incidents? {#task-2}

Before we get to incident response we need to be clear on what an incident even is. Because the room makes a distinction here that trips up a lot of beginners.

### Events, alerts, and incidents

A system generates **events** all the time. Like, all the time. Every process running, every login, every file opened, every network connection, every one of these is an event somewhere in a log. Your laptop is generating thousands of events right now while you read this. Most of them mean nothing.

Security tools eat all those events as logs and look for patterns. When they find something that looks suspicious, they fire an **alert**. The alert says "hey human, look at this, it might be bad."

A human (usually a SOC analyst) then looks at the alert and decides if it's real or not.

- **False positive** = the alert is wrong. Looks bad but isn't. Like the alarm going off because the toast burned. Common example, a backup process moving a ton of data to cloud storage looking like data exfiltration.
- **True positive** = the alert is right. Something bad is happening. Like a phishing email that phished somebody.

A true positive that's confirmed as bad is what we call an **incident**.

So the flow is: events → alert → analysis → (if real) incident.

### Severity

Once you have an incident, you slap a severity label on it. Low, medium, high, critical. The reason is simple. If you've got 12 incidents going on at once and limited people, you need to know which one to grab first. Critical first, then high, then medium, then low. Sounds obvious but you'd be surprised how many places skip this step and end up firefighting whatever's loudest instead of whatever's most dangerous.

**What is triggered after an event or group of events point at a harmful activity?** `Alert`

**If a security solution correctly identifies a harmful activity from a set of events, what type of alert is it?** `true positive`

**If a fire alarm is triggered by smoke after cooking, is it a true positive or a false positive?** `false positive`

---

## Task 3 — Types of Incidents {#task-3}

Not all incidents are the same. People outside the field tend to call everything "hacking" but inside the field there are categories that matter because they get handled differently.

**Malware infections.** The big one. Most incidents you'll see fall under this. Someone downloaded a sketchy file, ran something they shouldn't have, clicked a phishing attachment. Now there's malware on the box doing whatever the attacker wanted. Could be ransomware, could be a banking trojan, could be a backdoor, doesn't really matter, it's bad.

**Security breaches.** Someone unauthorized got access to data they shouldn't have access to. This is the headline-grabbing kind. "Company X had 50 million records stolen." That's a breach. Different from a data leak, which is the next one.

**Data leaks.** Confidential data ended up somewhere it shouldn't be. The big difference from a breach is that leaks often aren't malicious. A misconfigured S3 bucket exposing customer data, an employee emailing a sensitive spreadsheet to the wrong person, a leftover dev environment with real data getting indexed by Google. Nobody attacked anything, it just leaked. Still really bad though.

**Insider attacks.** When the call is coming from inside the house. Disgruntled employee, contractor doing something they shouldn't, even a regular employee who got bribed. Insiders are scary because they already have legit access to a bunch of stuff, so they don't need to break in. They just walk through the door they already have a key to.

**Denial of Service (DoS).** Flood a system with garbage until it can't serve real users anymore. The CIA triad of security (Confidentiality, Integrity, Availability) puts availability on equal footing with the other two for a reason. A website that's down is worthless. A bank that customers can't log into is worthless. DoS attacks (and the distributed version, DDoS) attack the availability part.

One thing the room makes a point of is that the SAME incident can be devastating for one company and nothing for another. A data leak that exposes a small marketing list might be embarrassing for one company but career-ending for a hospital that leaked patient records. The severity isn't really about the attack, it's about what the attack does to YOU.

**A user's system got compromised after downloading a file attachment from an email. What type of incident is this?** `malware infection`

**What type of incident aims to disrupt the availability of an application?** `Denial of service`

---

## Task 4 — Incident Response Process {#task-4}

Now the frameworks. This is the part you'll see referenced everywhere. There's two main ones, **SANS** and **NIST**. They're basically the same thing with slightly different phase names.

### SANS - the PICERL framework

Six phases. The mnemonic is **PICERL** which sounds dumb but does help you remember the order.

**1. Preparation.** Everything you do BEFORE an incident. Building the IR team, writing the IR plan, deploying security tools, training employees on phishing, making sure you have backups, making sure you know who to call at 3am. This is the boring phase that determines how well every other phase goes. Skip preparation and you'll be inventing your IR process while the building is on fire.

**2. Identification.** Spotting that something bad is happening. This is where the SIEM, the EDR, the SOC analysts all come in. Detecting the weird behavior and confirming "yes, this is real, this is an incident."

**3. Containment.** Stop the bleeding. If a host is compromised, isolate it from the network so it can't infect other hosts. If a user account is compromised, disable it so the attacker can't use it. Don't fix anything yet, just stop it from getting worse.

**4. Eradication.** Now remove the threat. Wipe the malware, kick the attacker out, close the hole they got in through. Make sure they're really gone, because half-eradicating is worse than not eradicating, you've just told the attacker you're onto them and now they're going to come back quieter.

**5. Recovery.** Get back to normal. Restore from backups, rebuild the systems, bring stuff back online. Test that everything works and that the attacker isn't still hiding somewhere. This is where things get checked carefully before being plugged back in.

**6. Lessons Learned.** The post-mortem. What happened, how did they get in, what did we miss, what do we change so this doesn't happen again. This is the phase everyone skips when they're tired and just want the incident to be over, which is exactly why the same thing keeps happening to them.

### NIST framework

NIST has 4 phases instead of 6, but it's basically the same content squished together:

- **Preparation** (same as SANS)
- **Detection and Analysis** (= Identification in SANS)
- **Containment, Eradication, and Recovery** (combined into one phase)
- **Post-Incident Activity** (= Lessons Learned in SANS)

That's it. Just compressed. If you understand SANS you understand NIST and vice versa.

### The Incident Response Plan

Every company that takes this seriously has a written **Incident Response Plan**. It's a formal document, signed off by senior management, that says exactly how the company handles incidents. Who does what. Who calls the lawyers. Who calls the cops. Who talks to the press. Who decides whether to pay a ransom.

The reason this gets written down ahead of time is that during an incident, nobody is thinking clearly. People are stressed, tired, panicked. You don't want to be making "should we pull the plug on production" decisions in the middle of the night with no plan. You want to be FOLLOWING a plan that was made calmly when nobody was on fire.

Key things an IR plan covers:

- Roles and responsibilities (who does what)
- Methodology (which framework you follow)
- Communication plan (who gets told, when, how, including law enforcement)
- Escalation path (when does this go from the SOC manager to the CISO to the CEO)

**The Security team disables a machine's internet connection after an incident. Which phase of the SANS IR lifecycle is followed here?** `containment`

**Which phase of NIST corresponds with the lessons learned phase of the SANS IR lifecycle?** `Post Incident Activity`

---

## Task 5 — Incident Response Techniques {#task-5}

The Identification phase is hard to do by hand. You can't have humans staring at every log line waiting for something bad. You need tools. Some of these tools also help with the later phases (containment, eradication), not just detection.

The three big ones:

**SIEM (Security Information and Event Management).** Already covered in the SOC room but it shows up here too. SIEM pulls in logs from everywhere and correlates them. Splunk, Sentinel, ELK, whatever your company uses. Pure detection.

**AV (Antivirus).** The old guard. Has a database of known malware signatures and scans files against it. Still useful, but on its own way less effective than it used to be because modern malware can change its appearance to evade signatures.

**EDR (Endpoint Detection and Response).** Lives on every endpoint and watches behavior, not just signatures. Can ALSO take action automatically. Kill a process, quarantine a file, isolate a host from the network. The "Response" half of the name is what makes it different from AV.

### Playbooks vs Runbooks

This is a distinction the room makes that's important and people mix up.

A **Playbook** is the high-level guide for handling a specific type of incident. Like a flowchart. "If phishing email, then: notify stakeholders, analyze email headers, check for attachments, find who opened it, isolate affected machines, block sender." It tells you WHAT to do.

A **Runbook** is the step-by-step technical instructions for HOW to do those things. "To isolate a host in CrowdStrike, do this. To pull email headers in O365, do this. To block a sender, do this." Detailed commands, specific to your tools.

Playbook = what. Runbook = how. Both matter because the playbook stays the same when you swap tools, but the runbook has to be updated. Most teams confuse the two and end up with one mega document that becomes outdated the minute something changes.

**Step-by-step comprehensive guidelines for incident response are known as?** `Playbooks`

---

## Task 6 — Lab Work Incident Response {#task-6}

The lab. This is a simulated incident response console where you play the analyst and walk through a phishing incident from start to finish.

### The setup

The scenario is that someone in the org got a phishing email, downloaded the attachment, and now you have to figure out the blast radius and contain it. The lab walks you through it step by step but here's what's happening.

The interface gives you the email, lets you check who opened it, who downloaded it, who executed the file, and gives you buttons to perform IR actions like isolating a host.

### Walking through it

**Step 1, look at the phishing email.** The lab shows you the email that started everything. Check the sender. The sender's name is `Jeff Johnson`. That's the first answer.

**Step 2, identify the threat vector.** A threat vector is just the path the malware took to get to the victim. In this case it's an attachment on the phishing email. So the threat vector is `Email Attachment`. Simple.

**Step 3, find out who downloaded it.** This is where the lab shows you a list of hosts in the network and which ones downloaded the malicious attachment. Count them up. Three devices downloaded the attachment.

**Step 4, find out who actually ran it.** Downloading and executing are not the same thing. A file sitting on disk doesn't do anything until somebody double-clicks it. Out of the three that downloaded, only one executed the file. This is the host you really need to worry about.

This distinction matters in real IR too. If 50 people received a phishing email but only 5 downloaded the attachment and only 1 executed it, your response is very different than if all 50 executed it. You're triaging based on exposure, not theoretical exposure.

**Step 5, take action.** The lab will have you isolate the executed host, probably delete the file from the ones that downloaded but didn't run it, and clean up. This maps to the containment and eradication phases from earlier.

After you go through all the steps the lab gives you the flag at the end.

**What was the name of the malicious email sender?** `Jeff Johnson`

**What was the threat vector?** `Email Attachment`

**How many devices downloaded the email attachment?** `3`

**How many devices executed the file?** `1`

**What is the flag found at the end of the exercise?** `THM{My_First_Incident_Response}`

---

## Task 7 — Conclusion {#task-7}

Done with the room.

---

## Wrap up

The room is mostly theory but the frameworks here are useful to know, you'll bump into PICERL and the NIST four phases everywhere in defensive security. Memorize the phases, at least the SANS ones, because interviewers love asking about them.

A few notes from doing IR-ish work for fun.

One, **preparation is everything**. Companies that get hit hard during an incident usually got hit hard because their preparation was lazy. No backups, no plan, no idea who's in charge. Companies that get hit and recover quickly are the ones who already had the plan, already had the backups, already practiced. The technical response work is way easier when the preparation was solid.

Two, **don't skip lessons learned**. Everyone does because by the time the incident is over, everyone's tired and just wants to go back to normal. But this is literally where you stop the same thing from happening again. Skip it once and you'll be back in the same incident in three months with no idea why.

Three, **playbooks save your sanity**. During an incident your brain is mush. Having a playbook means you don't have to invent the response, you just follow steps that were written by past-you when past-you was calm and had time to think. Write them when nothing is on fire.

Four, the difference between **download** and **execute** in that lab is a real thing in real IR. People conflate them and panic about way more hosts than got owned. A file on disk that nobody opened is way less of an emergency than a file that's running. Sort your hosts by exposure, not theoretical exposure, when you're triaging.

That's the whole module pretty much done. Onto whatever's next.

---