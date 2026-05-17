---
title: "SOC Fundamentals — TryHackMe Cyber Security 101"
date: 2026-05-17
category: "writeup"
excerpt: "Walkthrough of TryHackMe's SOC Fundamentals room — Learn about the SOC team and their processes."
image: "/images/blog/124.png"
readtime: "20 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction to SOC](#task-1)
- [Task 2 — Purpose and Components](#task-2)
- [Task 3 — People](#task-3)
- [Task 4 — Process](#task-4)
- [Task 5 — Technology](#task-5)
- [Task 6 — Practical Exercise of SOC](#task-6)
- [Task 7 — Conclusion](#task-7)

---

## Task 1 — Introduction to SOC {#task-1}

Heads up before we start. This is a theory room. Almost no hands-on stuff until the very last task. If you came here looking for tools to break and exploits to run, this isn't that room. This is the "what does a SOC actually do" explainer room. Necessary, but not the most exciting one.

So, what's a SOC. A SOC is a Security Operations Center. It's basically a team of people whose entire job is to sit and watch the company's network for anything sketchy, 24 hours a day, 7 days a week. Someone tries to log in to an admin account at 3am from Russia? The SOC sees it. A weird file shows up on a finance person's laptop? The SOC sees it. An employee starts uploading 50 gigs to a personal Dropbox? The SOC sees that too.

The reason this team exists is pretty simple. Companies used to lock physical files in physical filing cabinets and a security guard at the front door was enough. Now everything important lives in databases, on servers, in email, in the cloud. The threats are 24/7 and automated. So the defense has to be 24/7 too. You can't have everyone go home at 5pm and hope nothing happens overnight.

**What does the term SOC stand for?** `Security Operations Center`

---

## Task 2 — Purpose and Components {#task-2}

The SOC's whole job comes down to two words. Detection and Response.

### Detection

Detection is everything that happens BEFORE something bad has been confirmed. The SOC is constantly watching for four kinds of things:

**Vulnerabilities.** Weaknesses in software that an attacker could exploit if they found them. Outdated Windows machines that haven't been patched, an old version of Apache running somewhere, that sort of thing. Technically the SOC isn't usually the one fixing these (that's IT or whoever owns the system), but if a vuln is open the SOC has to know about it.

**Unauthorized activity.** Someone using credentials they shouldn't have. Classic example, employee logs in from their normal location, then 5 minutes later there's a login from a different country. Either they're a wizard or someone stole their password. Geographic location, weird hours, weird devices, all of these are flags.

**Policy violations.** Stuff that breaks the company's own rules. Downloading pirated software, emailing confidential files to personal accounts, plugging in random USBs. Not always malicious, sometimes just an employee being dumb, but still has to be caught.

**Intrusions.** The bad one. Someone inside the network who shouldn't be there. Could be from an exploited web app, could be a user who clicked a phishing link and got their machine infected. This is when things get serious.

### Response

Response is what happens AFTER the SOC has confirmed something bad. They help contain the damage, figure out how it happened, and work with the incident response team to clean it up. The SOC isn't always the one doing the deep forensics, but they're the ones who hand off everything they've gathered so the IR (incident response) team can hit the ground running.

### The three pillars

The room introduces this concept that every good SOC sits on three legs. **People, Process, Technology.** You need all three. Best people in the world with no tools can't watch a million logs. Best tools in the world with no humans to look at the alerts is just expensive noise. And without proper processes, even good people with good tools will step on each other and miss things. We'll go through each one in the next tasks.

**The SOC team discovers an unauthorized user is trying to log in to an account. Which capability of SOC is this?** `Detection`

**What are the three pillars of a SOC?** `People, Process, Technology`

---

## Task 3 — People {#task-3}

Even with all the AI and automation hype, you cannot run a SOC without humans. The room uses a fire alarm analogy that lands well. Imagine you're on a fire crew and you have a system that automatically alerts you to every fire in the city. Sounds great until you realize 95% of the alerts are someone burning toast. If you respond to every single one, you waste your whole shift driving around for nothing. You need a human to look at the alert first and decide if it's actually a fire or just toast.

That's exactly what the SOC does. Tools generate alerts. Humans figure out which ones matter.

The roles inside a SOC team:

**Level 1 SOC Analyst.** The first responders. Anything an alert generates, these folks see it first. Their job is to look at the alert, figure out if it's real or noise, and either close it out or escalate it. This is the entry-level role most people start in. Lots of repetition, lots of alerts, but it's where you learn what normal vs abnormal looks like.

**Level 2 SOC Analyst.** When L1 finds something they can't fully figure out, it goes to L2. These analysts dig deeper, pull data from multiple sources, correlate things, and try to build a fuller picture. Less alert volume, more investigation depth.

**Level 3 SOC Analyst.** The senior people. They handle the really nasty stuff that L1 and L2 escalate up. They also do threat hunting, which is proactively looking for bad stuff that hasn't tripped any alerts yet. When something becomes a real incident with containment and recovery and all that, L3 is in the middle of it.

**Security Engineer.** Not an analyst. These are the people who deploy and maintain the security tools the analysts use. The SIEM, the EDR, the firewalls, all of that has to be installed, configured, and tuned by someone, and that's the engineer.

**Detection Engineer.** Specialized role focused on writing the rules that the security tools use to find bad stuff. L2 and L3 analysts often double up as detection engineers, but bigger SOCs have dedicated people just for this. If you've ever heard the word "Sigma rule" or "YARA rule" thrown around, that's detection engineering.

**SOC Manager.** Runs the team, makes sure the processes are followed, talks to the CISO. Probably has the worst sleep schedule of anyone because they get woken up when something major hits at 3am.

These roles are not fixed. A small SOC might have three people doing all of these jobs. A massive enterprise SOC might have 50 people with all kinds of subspecializations. The room's list is the standard textbook version.

**Alert triage and reporting is the responsibility of?** `SOC Analyst (Level 1)`

**Which role in the SOC team allows you to work dedicatedly on establishing rules for alerting security solutions?** `Detection Engineer`

---

## Task 4 — Process {#task-4}

Having good people isn't enough. You need an actual playbook for what happens when an alert fires, otherwise everyone just does their own thing and stuff gets missed.

### Alert Triage and the 5 Ws

This is the bread and butter of any SOC. When an alert comes in, an L1 analyst goes through what's called the 5 Ws. It's exactly what it sounds like. Five questions starting with W that you answer to figure out what's going on.

The 5 Ws are:

**What** happened? What did the alert actually catch? "A malicious file was detected." Concrete description of the event.

**When** did it happen? Date and time. Important because attackers often try stuff at off hours hoping nobody's watching.

**Where** did it happen? Which host, which network segment, which user's machine.

**Who** was involved? Which user account. Could be the actual attacker, could be a victim whose creds got stolen, could be an insider.

**Why** did it happen? This is the one you can only answer after you investigate. Was it an attack? Was it an honest mistake? Was it the user clicking a sketchy link?

The room gives an example. Alert: malware detected on GEORGE PC. The 5 Ws come back as: malicious file (what), at 13:20 on June 5 2024 (when), in a directory on GEORGE PC (where), under user George's account (who), turns out he downloaded pirated software trying to get a free copy of something (why).

That's it. Five questions, you have a complete picture. Now you can decide if it's serious or not.

### Reporting

Once an L1 figures out an alert is real, they don't just yell across the office. They write it up properly with the 5 Ws, screenshots as evidence, and escalate it through whatever ticketing system the company uses. The next person up the chain shouldn't have to ask "wait what happened" because the report should already answer everything.

### Incident Response and Forensics

If a triaged alert turns out to be something really bad, like an actual ongoing attack, this kicks off incident response. That's a whole separate process (entire other room on TryHackMe for it). And sometimes after the dust settles, forensics gets called in to figure out the root cause. How did the attacker get in, what did they touch, what data did they take, the whole deal.

**At the end of the investigation, the SOC team found that John had attempted to steal the system's data. Which 'W' from the 5 Ws does this answer?** `Who`

**The SOC team detected a large amount of data exfiltration. Which 'W' from the 5 Ws does this answer?** `What`

---

## Task 5 — Technology {#task-5}

People and Process don't mean much if you don't have the tools to see what's happening in the network. That's the Technology pillar. These are the security solutions that pull data from everywhere and put it in front of the analysts.

The big ones to know:

**SIEM (Security Information and Event Management).** This is the big one. Every SOC has one. A SIEM collects logs from all over the network. Firewalls, servers, endpoints, web apps, cloud services, anything that produces logs sends them to the SIEM. Then the SIEM applies detection rules on top of those logs to find suspicious patterns. Splunk, ELK, QRadar, Sentinel, Wazuh, those are all SIEMs you'll hear about. The important thing the room calls out is that SIEMs are detection only. They tell you something happened, they don't do anything about it.

**EDR (Endpoint Detection and Response).** Lives on individual computers (endpoints, hence the name). Watches what's happening at the OS level, processes spawning, files being written, registry keys changing, network connections opening. EDRs can ALSO respond automatically. Quarantine a file, kill a process, isolate the host from the network. CrowdStrike, SentinelOne, Defender for Endpoint, those are the big EDR names. The "Response" part is what makes it different from a SIEM.

**Firewall.** The OG security tool. Sits between your network and the internet, filters traffic based on rules. Modern firewalls are way smarter than just "block port 22 from outside" and have detection rules built in too. But the core idea is the same as 25 years ago. Decide what traffic gets in, what gets out, block the rest.

The room mentions a bunch of others in passing, like Antivirus, EPP, IDS/IPS, XDR, SOAR. Don't worry about memorizing all of these right now, they each get their own room later. The main idea is that there's a whole stack of tools, not just one magic box, and the SOC team picks which ones make sense based on what the company actually needs to defend.

**Which security solution monitors the incoming and outgoing traffic of the network?** `Firewall`

**Do SIEM solutions primarily focus on detecting and alerting about security incidents? (yea/nay)** `yea`

---

## Task 6 — Practical Exercise of SOC {#task-6}

Finally something to click on. The room gives you a static lab that simulates a SIEM dashboard. You play the L1 analyst.

### Scenario

The alert is for a port scan that was detected against one of the hosts in the network. Your job is to look at the logs in the SIEM and answer the 5 Ws.

There's a hint at the bottom that's pretty important. The vulnerability assessment team has already told the SOC team they were running a port scan from `10.0.0.8`. Keep that IP in your head, it changes the answer to the "why" question completely.

### Walking through it

Click View Site to open the lab on the right side. You'll see the alert, click into it, and you get a bunch of log entries. Read through them and pull out the answers.

**What** is the alert about? It's a port scan. Logs show one host hitting a bunch of different ports on another host in rapid succession, that's the signature of a port scan.

**When** did it happen? The timestamp on the logs is `June 12, 2024 17:24`.

**Where** was the scan targeting? Look at the destination IP in the logs. `10.0.0.3`. That's the host being scanned.

**Who** was scanning? The source host name. Looking at the source, it shows up as `Nessus`. Nessus is a vulnerability scanner. That fits with the hint at the start, the vuln assessment team using Nessus from `10.0.0.8`.

**Why** did this happen? This is the trick question. If you didn't read the note, you'd flag this as malicious. Port scan from a host inside the network, that looks bad. But the note literally tells you the vuln assessment team is doing this on purpose. So the answer is `Intended`.

This is a good lesson the room is trying to teach. Real SOC work involves a lot of context that isn't in the alert. Authorized security testing looks identical to attacks at the log level. Without communication between teams, the SOC would burn hours treating every authorized scan as an incident. Always check if it's a known activity before escalating.

There's also an additional question, has any response come back to the scanner. Look at the logs for traffic going from `10.0.0.3` back to `10.0.0.8`. There is, so the answer is `yea`. The target host responded to some of the scan requests, which is normal because that's how scanning works, you send a probe and the target's response tells you if the port is open.

Once you've filled in all the 5 Ws and closed out the alert, you get the flag.

**What: Activity that triggered the alert?** `Port Scan`

**When: Time of the activity?** `June 12, 2024 17:24`

**Where: Destination host IP?** `10.0.0.3`

**Who: Source host name?** `Nessus`

**Why: Reason for the activity? Intended/Malicious** `Intended`

**Additional Investigation Notes: Has any response been sent back to the port scanner IP? (yea/nay)** `yea`

**What is the flag found after closing the alert?** `THM{000_INTRO_TO_SOC}`

---

## Task 7 — Conclusion {#task-7}

That's it. SOC fundamentals done.

---

## Wrap up

Like I said at the start, this was a theory room and there's not a ton to chew on past memorizing the People/Process/Technology breakdown and the 5 Ws. But the lab at the end is a really good little exercise because it teaches the most important lesson in SOC work that newer folks always miss. **Context matters more than the alert.**

That port scan looks 100% identical whether it's a pentester doing authorized testing or an attacker probing for an entry point. The only thing that tells you which one it is, is whether someone told the SOC ahead of time. In real life, this is why SOC teams have a list of authorized activities pinned somewhere obvious. New scanner getting deployed? Tell the SOC. Red team engagement starting Monday? Tell the SOC. Big software rollout pushing weird traffic patterns? Tell the SOC. Without that, the SOC will eat hours chasing ghosts.

If you're reading this thinking about getting into blue team work, L1 SOC analyst is the most common entry point. It's repetitive, sure, but you learn an insane amount about how networks behave just from staring at logs all day. Way more than any course can teach. Then you grow into L2, L3, detection engineering, threat hunting, whatever clicks for you.

Onto the next room.

---