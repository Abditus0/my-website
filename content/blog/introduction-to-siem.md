---
title: "Introduction to SIEM — TryHackMe Cyber Security 101"
date: 2026-05-25
category: "writeup"
excerpt: "Walkthrough of TryHackMe's Introduction to SIEM room — Learn the fundamentals of SIEM and explore its features and functionality."
image: "/images/blog/130.png"
readtime: "28 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Logs Everywhere, Answers Nowhere](#task-2)
- [Task 3 — Why SIEM?](#task-3)
- [Task 4 — Log Sources and Ingestion](#task-4)
- [Task 5 — Alerting Process and Analysis](#task-5)
- [Task 6 — Lab Work](#task-6)
- [Task 7 — Conclusion](#task-7)

---

## Task 1 — Introduction {#task-1}

SIEM. If you've ever looked at a SOC analyst job listing you've seen this word about fifty times in the requirements section. This room is the gentle intro to what it is.

Quick unpack of the acronym: Security Information and Event Management. Yeah it's a mouthful which is why everyone just says SIEM (pronounced "sim", like the card in your phone). It's the big central tool that SOC analysts live inside all day. The whole point of this room is to understand why this thing exists in the first place, because if you don't understand the problem it solves you'll just see it as another piece of confusing software.

The learning objectives basically boil down to: what are log sources, why does dealing with raw logs suck, what does a SIEM do about it, and how do alerts get triggered. Nothing wild, just the foundation stuff.

**What does SIEM stand for?** `Security Information and Event Management system`

---

## Task 2 — Logs Everywhere, Answers Nowhere {#task-2}

Okay so the setup. A network is a bunch of devices talking to each other. Computers, servers, the website you host, a router gluing it all together, maybe firewalls in between. Every one of those devices is constantly spitting out logs about what's happening on it. Someone logged in. A file got opened. A process ran. Traffic went out to some IP. All of it gets written somewhere.

These devices that produce logs are called log sources. And there are two big buckets they fall into.

### Host-centric log sources

This is stuff that happened ON a machine. Windows boxes, Linux boxes, servers. The events are about what's going on inside that one host. Examples:

- A user opening a file
- A login attempt (success or fail)
- Some process starting up
- Something messing with the Windows registry
- A PowerShell script running

### Network-centric log sources

These are about traffic between devices, or going out to the internet. Firewalls, IDS/IPS, routers, that kind of stuff. Examples:

- SSH connection from one box to another
- A file being downloaded over FTP
- Web browsing traffic
- A user connecting via VPN
- Network shares being accessed

Both types together = mountain of logs. Constantly. Every second.

### Why this is a nightmare

Sounds simple in theory. Logs exist, you read them, you find bad guys. Done. Except no, in practice it's a disaster, and here's why:

**Way too many log sources.** A real network has dozens or hundreds of devices, each one cranking out events all day. Opening each one individually during an incident is brutal.

**Nothing is in one place.** The logs live ON the machines that made them. So if you want to read the auth logs from the Linux server you SSH in. Want the event logs from the Windows box, you RDP. Want the firewall logs, log into the firewall. Doing this across 50 machines during an active incident is how analysts age ten years in a week.

**Logs in isolation are kinda useless.** One event on its own usually looks fine. "User opened a file" - cool, that's what users do. But if you also knew that the user logged in from a brand new IP, then ran PowerShell, then accessed shared drives, then made an outbound connection, suddenly that file open looks pretty bad. Without correlation you miss the story.

**Humans cannot read that much text.** Logs come in at a rate that no person can keep up with. You will miss things. Not maybe, definitely.

**Every log source has its own format.** Windows logs don't look like Linux logs. Linux auth logs don't look like Apache logs. Firewall logs are their own thing entirely. So even if you DID have all the logs in one place, you'd need to know how to read every format. Good luck.

So we've got a real problem here. Tons of data, scattered, in different shapes, with no way for humans to keep up. Enter SIEM.

**Is Registry-related activity host-centric or network-centric?** `host-centric`

**Is VPN-related activity host-centric or network-centric?** `network-centric`

---

## Task 3 — Why SIEM? {#task-3}

This is where SIEM comes in. Security Information and Event Management. It's a security tool that grabs logs from all your sources, smushes them into a single format, finds patterns across them, and uses rules to detect bad stuff automatically.

That last part is the magic. A SIEM doesn't just collect logs, it actively watches them and alerts you when something matches a rule.

### What a SIEM does

**Centralized log collection.** Logs from everywhere get pulled into the SIEM. Endpoints, servers, firewalls, all of it. Usually through small agents installed on each device, or via APIs. No more SSH-ing into ten different boxes during an incident, everything is searchable from one place. This alone changes your life as an analyst.

**Normalization.** Raw logs are a mess of different formats. The SIEM takes those raw logs, breaks each one into individual fields (that's called parsing), and converts them all into one consistent shape (that's called normalization). So a Windows login event and a Linux login event both end up with a "username" field, a "source IP" field, a "timestamp" field, etc, even though the original raw text looked completely different. You search across them like they're the same kind of thing.

**Correlation.** This is the big one. The SIEM looks at logs from different sources together and finds relationships. The room gives a good example. Let's say in a 5 minute window:

- Haris logs into the VPN from a brand new IP he's never used
- Haris accesses some files on a shared drive
- Haris runs a PowerShell script
- The machine makes an outbound network connection to somewhere weird

Each of those alone? Whatever, normal day. All four together? That's data exfiltration via stolen VPN credentials and a SIEM rule can catch that. That's the whole point of correlation.

**Real-time alerting.** Detection rules sit in the SIEM and trigger when their conditions are met. SIEMs come with default rules out of the box, but most SOC teams write their own based on what they care about specifically. When a rule fires, an alert gets thrown and analysts go investigate.

**Dashboards.** Dashboards are how you consume the firehose of data in a way that doesn't fry your brain. They show summaries, counts, top hits, weird spikes, all that. Some examples of what's on a typical dashboard:

- Recent alerts
- System notifications
- Health alerts
- Failed login attempts
- How many events have been ingested
- Which rules have fired
- Top domains being visited

You can build custom dashboards too. Every SIEM lets you do this. Splunk dashboards are particularly nice looking, ELK ones are okay too.

There's a bunch of other stuff SIEMs do that this room doesn't really cover - threat intel integration, long term retention, fancy search query languages, etc. But this is the core of it.

---

## Task 4 — Log Sources and Ingestion {#task-4}

Let's look at what some of these logs look like before they get sucked into the SIEM. Because if you don't know what a raw log looks like, you'll have no idea what the SIEM is even normalizing.

### Windows

Windows logs everything through the Event Log system, which you view with Event Viewer (just search "Event Viewer" in the start menu). The cool thing about Windows logs is every event has a numeric Event ID. So instead of trying to parse English sentences, you can search for Event ID 4624 to find successful logins, Event ID 4625 for failed ones, Event ID 4688 for new process creation, and so on. The IDs are super useful and you'll memorize the common ones over time whether you want to or not.

All these Windows logs from every endpoint get forwarded up to the SIEM.

### Linux

Linux is a mess of plain text files in `/var/log/` with no unifying scheme. You just have to know where things live:

- `/var/log/httpd` - Apache web server logs (requests, responses, errors)
- `/var/log/cron` - cron job stuff
- `/var/log/auth.log` (Debian/Ubuntu) and `/var/log/secure` (RHEL/CentOS) - authentication logs
- `/var/log/kern` - kernel events

A cron log looks like this:

```
May 28 13:04:20 ebr crond[2843]: /usr/sbin/crond 4.4 dillon's cron daemon, started with loglevel notice
May 28 13:04:20 ebr crond[2843]: no timestamp found (user root job sys-hourly)
May 28 13:04:20 ebr crond[2843]: no timestamp found (user root job sys-daily)
May 28 13:04:20 ebr crond[2843]: no timestamp found (user root job sys-weekly)
May 28 13:04:20 ebr crond[2843]: no timestamp found (user root job sys-monthly)
Jun 13 07:46:22 ebr crond[3592]: unable to exec /usr/sbin/sendmail: cron output for user root job sys-daily to /dev/null
```

Timestamp, hostname, process name with PID in brackets, then the actual message. Pretty readable but it's all just text and you have to do work to extract the bits you care about. That's the parsing the SIEM handles for you.

### Web servers

Web server logs are gold for spotting web attacks. Every request that comes in gets logged. On Linux these live in `/var/log/apache` or `/var/log/httpd` depending on the distro.

Apache logs look like:

```
192.168.21.200 - - [21/March/2022:10:17:10 -0300] "GET /cgi-bin/try/ HTTP/1.0" 200 3395 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"
127.0.0.1 - - [21/March/2022:10:22:04 -0300] "GET / HTTP/1.0" 200 2216 "-" "curl/7.68.0"
```

Source IP, timestamp, request method and path, HTTP status code, response size, referer, user agent. That format is called Combined Log Format and it's the standard. When someone hits your site, this is the trail.

### How logs get into the SIEM

So you've got all these logs scattered around. How do they end up inside the SIEM? A few common ways:

**Agents (or forwarders).** A small program runs on each endpoint, watches the logs, and ships them off to the SIEM server in real time. Splunk calls these "forwarders" because Splunk has to be different. Other SIEMs just call them agents.

**Syslog.** An old standard protocol where devices send log messages to a central server over the network. Tons of things speak syslog by default, especially network gear, routers, switches, firewalls. The SIEM listens for syslog and accepts whatever comes in.

**Manual upload.** Got a log file from a system that's not connected to the SIEM? Splunk and ELK let you just upload a file directly. Useful for one-off investigations or DFIR work where you got handed a `.evtx` from someone.

**Port forwarding.** Configure the SIEM to listen on some port and have endpoints push their data straight there. Similar idea to syslog but more flexible about what protocol you use.

**In which location within a Linux environment are HTTP logs stored?** `/var/log/httpd`

---

## Task 5 — Alerting Process and Analysis {#task-5}

So we've got the SIEM collecting logs. Now how does it decide "hey this is suspicious"?

Detection rules. Rules are just logical conditions, like "if this AND this AND this happen, fire an alert." Simple in concept, infinite in variety.

Some examples of what a rule might look like in plain English:

- If a user fails to log in 5 times in 10 seconds, alert on "Multiple Failed Login Attempts"
- If a successful login happens after multiple failed attempts, alert on "Successful Login After Multiple Failed Attempts" (potential brute force success)
- Alert any time anyone plugs in a USB stick (handy if your company doesn't allow USB drives at all)
- If outbound traffic exceeds 25MB from a single host, alert on potential data exfiltration

That last one is policy specific. Some companies don't care about that, some absolutely do.

### How rules get written

Let's get more concrete. The room walks through two real examples.

**Use case 1: Detecting log clearing.**

When attackers get on a box, one of the first things they often do is wipe the event logs to cover their tracks. Helpful for them, also helpful for us, because Windows logs the act of clearing logs as Event ID 104. The system literally tells on the attacker.

So the rule:

> If Log Source = WinEventLog AND EventID = 104, trigger alert "Event Log Cleared"

Two conditions, both have to be true. If both fire, alert.

**Use case 2: Detecting `whoami` execution.**

After getting a shell or escalating privileges, attackers run `whoami` to confirm who they are on the box. It's almost a reflex. Real users don't really type `whoami` because they know who they logged in as. So watching for this command is a decent (noisy) detection.

For this rule we need:

- Log source: WinEventLog (Windows endpoints)
- Event ID: 4688, which is process creation on Windows
- NewProcessName: should contain `whoami`

So the rule becomes:

> If Log Source = WinEventLog AND EventCode = 4688 AND NewProcessName contains whoami, trigger alert "WHOAMI command Execution DETECTED"

This is exactly why normalization is important. The rule checks specific fields (LogSource, EventCode, NewProcessName) and those fields only exist because the SIEM parsed the raw log into named pieces. If you tried to write this rule against raw log text it would be a nightmare.

### What you do with alerts

When you're working as a SOC analyst, the day looks like: stare at dashboards, alerts pop up, investigate each one. When an alert fires, you go look at the events that triggered it, check which conditions of the rule got matched, look at surrounding context (what was happening before and after on the same machine), and then make a call: real thing or false alarm?

**False positive.** The alert fired but the activity was fine. Maybe the dev team runs `whoami` in a script for some legitimate reason. You usually want to tune the rule so it doesn't keep firing on the same legit activity. Otherwise you get alert fatigue and start missing real stuff.

**True positive.** Something bad is happening. Now you escalate. Some things you might do:

- Reach out to the asset owner ("hey did you intend to run this thing?")
- If the activity is confirmed sus, isolate the infected host so it can't talk to anything
- Block the malicious IP at the firewall
- Kick off a full incident response

The big thing to understand is that not every alert is a real threat. A huge part of the job is sifting through the noise. New analysts assume every alert means a hacker is in the network. Senior analysts know most alerts are nothing and they're hunting for the ones that aren't.

**Which Event ID is generated when event logs are removed?** `104`

**What type of alert may require tuning?** `False Positive`

---

## Task 6 — Lab Work {#task-6}

Static lab time. Click View Site, you get a fake SIEM dashboard. There's a "Start Suspicious Activity" button you have to hit to kick the simulation off. Then events stream in, an alert fires, and you walk through the analyst workflow on a simulated incident.

The questions guide you through it. Walk through it like you were the analyst.

First, hit the Start Suspicious Activity button. The dashboard updates and an alert pops. Click into the alert, you see what process triggered it. The name is a dead giveaway - some executable called `cudominer.exe`, which screams cryptocurrency miner the moment you read it.

Then you check the event log for the alert to see who did it. There's a user field on the event, gives you the user that executed the process.

You also get the hostname of the machine where it ran. That's the box you'd isolate first.

Then you look at the detection rule itself to see exactly what condition matched. The rule is looking for processes whose name contains a specific keyword. Compare that keyword against the process name and the overlap is obvious.

Finally you decide if this is real or not. A user named (well, anyone) running `cudominer.exe` on an HR box isn't a legitimate business activity. Pretty clearly a true positive. Pick True Positive as your action.

Once you pick the right action the lab spits out the flag.

**After clicking on the Start Suspicious Activity button, which process caused the alert?** `cudominer.exe`

**Find the event that caused the alert and identify the user responsible for the process execution.** `chris`

**What is the hostname of the suspect user?** `HR_02`

**Examine the rule and the suspicious process; which term matched the rule that caused the alert?** `miner`

**Which option best represents the event?** `True Positive`

**Selecting the right ACTION will display the FLAG. What is the FLAG?** `THM{000_SIEM_INTRO}`

---

## Task 7 — Conclusion {#task-7}

That's the intro. Pretty light room overall, no command line, no exploitation, no breaking anything. But the concepts here are the bedrock of working as a SOC analyst or blue teamer, and you'll see them everywhere from here on.

Quick recap:

Logs come from two flavors of sources, host-centric (stuff on a machine) and network-centric (stuff between machines). Both kinds together are a flood that no human can read manually. A SIEM solves this by centralizing collection, normalizing the format so everything is searchable the same way, correlating across sources to find patterns no single log shows, and using detection rules to alert automatically. When alerts fire, you investigate, decide if it's real or noise, and either tune the rule or escalate to incident response.

The actual SIEMs you'll meet in the wild are Splunk (most common in enterprise, expensive, very powerful), ELK / Elastic Stack (open source roots, used a lot), QRadar (IBM, common in big orgs), and a bunch of newer cloud ones like Sentinel and Chronicle. They're all variations on the same theme. Learn the concepts here and the specific tool is just syntax.

---