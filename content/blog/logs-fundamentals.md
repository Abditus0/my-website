---
title: "Logs Fundamentals — TryHackMe Cyber Security 101"
date: 2026-05-22
category: "writeup"
excerpt: "Walkthrough of TryHackMe's Logs Fundamentals room — Learn what logs are and how to analyze them for effective investigation."
image: "/images/blog/128.png"
readtime: "30 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction to Logs](#task-1)
- [Task 2 — Types of Logs](#task-2)
- [Task 3 — Windows Event Logs Analysis](#task-3)
- [Task 4 — Web Server Access Logs Analysis](#task-4)
- [Task 5 — Conclusion](#task-5)

---

## Task 1 — Introduction to Logs {#task-1}

Logs. The least sexy topic in cyber security and also one of the most important. If you do anything defensive, blue team, SOC, IR, forensics, you're going to be staring at logs for the rest of your career. Better get comfortable with them now.

The room kicks off with a detective analogy. When investigators show up at a crime scene they look for traces. Footprints, broken doors, fingerprints, CCTV footage. Each individual trace doesn't solve the case on its own, but you stitch them all together and you get the story. Logs are the digital version of those traces. Anything that happens on a system, somewhere there's a log line that says it happened. You just have to know where to look.

### Why logs matter

Logs aren't just for catching bad guys. They get used for a bunch of stuff:

- **Security monitoring**, watching for sketchy behavior in real time
- **Incident investigation**, figuring out what happened after the fact
- **Troubleshooting**, why is this service crashing, why is this slow
- **Performance monitoring**, response times, error rates
- **Auditing and compliance**, proving to regulators that what should have happened actually happened

Pretty much any IT job at some point ends up being "look at the logs and figure out why X is broken." The skill is universal.

**Where can we find the majority of attack traces in a digital system?** `Logs`

---

## Task 2 — Types of Logs {#task-2}

Now here's the problem. If you just open a log file on a busy system, your screen turns into a wall of text and you have no idea what you're looking at. Thousands of lines a second, half of them noise. Where do you even start.

The answer is that logs are split into categories so you only have to look at the relevant ones. If you're investigating a failed login you go to the security log, not the application log. If you're looking at a network spike you go to network logs, not system logs. Narrow the search before you start grepping.

Quick rundown of the main types:

**System Logs.** OS-level stuff. Boot up, shut down, drivers loading, hardware failing, services starting. When the OS itself has a problem, this is where it shouts about it.

**Security Logs.** Authentication, authorization, anything to do with security policy. Logins (successful and failed), user account changes, permission changes.

**Application Logs.** Whatever the apps did. User interactions, errors thrown by the app, updates, crashes. Useful for both troubleshooting and security depending on what app it is.

**Audit Logs.** Specifically for tracking changes and user activity for compliance. Who accessed what data, what system changes happened, what policies got enforced. Heavy compliance stuff lives here.

**Network Logs.** Traffic in and out, connection records, firewall logs. If something talked to something else over a wire, there's a log for it.

**Access Logs.** Who accessed what resource. Web server access logs, database access logs, API access logs. The most common one you'll touch is the web server access log because every site keeps one and they're really useful for spotting attacks.

This isn't an exhaustive list, every application can have its own custom logs too. But these are the big buckets.

The process of pulling useful info out of logs is called **log analysis**. Doing it by eye is impossible past about 50 lines, so we use tools. Manual analysis with command line stuff (cat, grep, less) is fine for small files. For real volume you use a SIEM. The rest of this room we'll do it the manual way.

**Which type of logs contain information regarding the incoming and outgoing traffic in the network?** `Network Logs`

**Which type of logs contain the authentication and authorization events?** `Security Logs`

---

## Task 3 — Windows Event Logs Analysis {#task-3}

Windows has its own way of doing logs. Instead of plain text files like Linux, Windows logs are structured events stored in a binary format. The good news is Windows ships with a built-in viewer called **Event Viewer** that makes it not horrible to look at.

### The main Windows log categories

**Application.** Anything any installed program logs. Errors, warnings, info messages. Useful for figuring out why some app keeps crashing.

**System.** The OS itself. Drivers, services, hardware issues, startup and shutdown. If Windows itself is broken, look here.

**Security.** The big one for defenders. Every login, every logout, every user account change, every policy change. If you're hunting an attacker on a Windows box, you're starting here.

There's also a bunch of more specific log categories you can drill into for things like PowerShell, Sysmon (if installed), Task Scheduler, and so on.

### Event Viewer basics

Hit the Start button, type "Event Viewer", open it. The left side has a tree where you can pick which log to look at. Click Windows Logs to expand, then click Security (or whichever one you want).

The middle pane shows the list of events. Each event has a bunch of columns but the important ones are:

- **Description** - what happened, in English (sort of)
- **Log Name** - which log file this came from
- **Logged** - when it happened
- **Event ID** - a number that uniquely identifies what kind of event this is

### Event IDs are the key

This is the trick to Windows logs. Every kind of event has a number. Once you know the number for the thing you care about, you can filter on it and ignore everything else.

The important ones to know:

- `4624` - successful login
- `4625` - failed login
- `4634` - logoff
- `4720` - user account created
- `4722` - user account enabled
- `4724` - password reset attempted
- `4725` - user account disabled
- `4726` - user account deleted

You don't need to memorize all of them. The ones I remember off the top of my head are 4624 (success) and 4625 (fail) because you use those constantly. For everything else, Google it. There's a billion cheat sheets.

To filter by event ID in Event Viewer, click "Filter Current Log" on the right side panel, then put the event IDs you want in the box. Multiple IDs go in comma-separated.

### The lab

Scenario, a company got attacked on Friday. Data got exfiltrated from a file server. The IR team has narrowed it down to one compromised user and one compromised system. Your job is to find what the attacker did on that system BEFORE pivoting to the file server.

Start the machine. It'll boot into a Windows desktop. Log in with `Administrator` / `logs@123` if you need to.

Open Event Viewer. Expand Windows Logs, click Security. We're going to filter on the event IDs that match the questions.

**Question 1, name of the last user account created on this system.**

User account creation is event ID `4720`. Filter the Security log on event ID 4720. Sort by date so the latest is on top, or just look at the most recent one.

Look at the description of the latest 4720 event. There's a field called "Account Name" under "New Account" that tells you the name of the account that just got made. The latest one created is `hacked`. That's a great name for an account on a compromised system, by the way. Attackers do not subtle.

**Question 2, who created that account.**

Same event. Look at the "Subject" section, specifically "Account Name" under Subject (not under New Account). That tells you WHO did the creating. It's `Administrator`. So someone got admin access and used it to make the `hacked` account.

**Question 3, when was the hacked account enabled.**

Account enabled is event ID `4722`. Filter on that, find the one for the `hacked` account, look at the "Logged" timestamp. The date format the room wants is M/D/YYYY. The answer is `6/7/2024`.

**Question 4, did this account also get a password reset.**

Password reset attempt is event ID `4724`. Filter on that. If you see a 4724 event for the `hacked` account, the answer is yes. There is one. So `Yes`.

So the timeline of what happened on this box: Administrator account got compromised, attacker used it to create a new account called `hacked`, enabled it, and set a password on it. Now they have their own persistent account on the box that they can use later. This is a really classic post-exploitation move and it's all sitting right there in the Security log.

**What is the name of the last user account created on this system?** `hacked`

**Which user account created the above account?** `Administrator`

**On what date was this user account enabled? Format: M/D/YYYY** `6/7/2024`

**Did this account undergo a password reset as well? Format: Yes/No** `Yes`

---

## Task 4 — Web Server Access Logs Analysis {#task-4}

Time to switch to Linux. Web servers (Apache, Nginx) keep access logs that record every single HTTP request hitting the site. These logs are gold for security work because if a site got attacked, the attack went through these logs.

### What a log line looks like

Apache access logs live at `/var/log/apache2/access.log` by default. A single line looks like this:

```
172.16.0.1 - - [06/Jun/2024:13:58:44] "GET / HTTP/1.1" 200 "-" "Mozilla/5.0 (...)"
```

Breaking it down:

- `172.16.0.1` is the source IP. Whoever made the request.
- `[06/Jun/2024:13:58:44]` is the timestamp.
- `"GET / HTTP/1.1"` is the request itself. Method, URL, HTTP version.
- `200` is the response code. 200 means OK, 404 means not found, 500 means server error, 403 means forbidden, etc.
- The last bit in quotes is the User-Agent string. Tells you what browser/OS the requester was using. Or claimed to be using, you can spoof this.

Once you understand this format, the log file is just a giant table of who hit what URL when. Easy to grep through.

### The commands

**`cat`** - prints the whole file to your terminal. Good for small files, awful for big ones because it'll just blast everything past your screen.

```bash
cat access.log
```

You can also use `cat` to combine multiple log files into one if you have rotated logs (access.log, access.log.1, access.log.2 etc):

```bash
cat access1.log access2.log > combined_access.log
```

**`grep`** - the workhorse. Searches for a pattern in the file and prints matching lines. If you want to find every request from a specific IP:

```bash
grep "192.168.1.1" access.log
```

Or every request to a specific URL:

```bash
grep "/contact" access.log
```

Or every failed request:

```bash
grep " 404 " access.log
```

Spaces around the 404 matter so you don't accidentally match other things containing 404 (like in a User-Agent string or whatever).

**`less`** - opens the file one page at a time. Way better for big files than cat. Spacebar to go forward a page, `b` to go back. Press `/` to start searching, type your pattern, hit enter. Then `n` jumps to the next match, `N` jumps to the previous. `q` to quit.

```bash
less access.log
```

These three (`cat`, `grep`, `less`) get you 90% of the way for manual log analysis. Pipe them together for fun stuff:

```bash
grep "POST" access.log | less
```

Shows you only POST requests, paged through with less. Nice.

### The lab

Spin up the AttackBox if you haven't already. The log file lives at `/root/Rooms/logs/access.log`. Open a terminal and `cd` to it.

```bash
cd /root/Rooms/logs
```

**Question 1, the IP that made the last GET request to /contact.**

We need GET requests to /contact, and we want the last one. Grep for both:

```bash
grep "GET /contact" access.log
```

That gives you all the matching lines. The last one (bottom of the output) is the latest. Look at the first column for the IP.

Or you can pipe it to `tail -1` to grab just the last line:

```bash
grep "GET /contact" access.log | tail -1
```

The IP is `10.0.0.1`.

**Question 2, when was the last POST request from 172.16.0.1.**

We need POST requests from a specific IP. Combine grep with grep:

```bash
grep "172.16.0.1" access.log | grep "POST"
```

Or chain them:

```bash
grep "172.16.0.1" access.log | grep "POST" | tail -1
```

Look at the timestamp on the last line. `06/Jun/2024:13:55:44`.

**Question 3, what URL was that POST going to.**

Same line, just look at the URL field. The request part is `"POST /contact HTTP/1.1"`. So the URL is `/contact`.

Both the last GET and the last POST were aimed at /contact, by different IPs. That's a contact form being probed. POST to /contact usually means someone submitting the form, which on a real attack could be anything from form spam to a SQL injection attempt depending on what the form does. In this room it's just a question about log filtering but in real life that's a pattern worth digging into.

**What is the IP which made the last GET request to URL: "/contact"?** `10.0.0.1`

**When was the last POST request made by IP: "172.16.0.1"?** `06/Jun/2024:13:55:44`

**Based on the answer from question number 2, to which URL was the POST request made?** `/contact`

---

## Task 5 — Conclusion {#task-5}

Done with the room.

---

## Wrap up

Logs are the unsexy backbone of pretty much all defensive work. SOC analysts stare at logs all day. IR teams stitch incidents together from logs. Forensics teams pull deleted log entries off disk images. If you don't know how to read logs, you can't really do any of those jobs.

A few practical things I'd add on top of what the room covers.

One, **`grep` has flags that make it way more useful**. `grep -i` is case insensitive (good when you're not sure about capitalization). `grep -v` shows lines that DON'T match (good for filtering noise). `grep -c` counts matches instead of printing them (good for "how many failed logins were there"). Learn those three and you'll save yourself a ton of typing.

Two, **Windows Event Viewer is the basic-mode tool**. For real work people use PowerShell with `Get-WinEvent` or tools like Hayabusa to parse Event Log files faster. But Event Viewer is fine for learning and for one-off investigations on a single box.

Three, **on real systems, logs get huge fast**. A busy web server can generate gigabytes of access logs per day. You can't grep through that by hand. This is where SIEMs come in (Splunk, Elastic, Wazuh) because they ingest the logs, parse them, and let you search like a database. The skills from this room transfer, you're still filtering on fields and patterns, just with a fancier query language.

Four, **attackers know about logs too**. The first thing a competent attacker does after popping a box is figure out what's getting logged and try to either disable it, clear it, or avoid generating it. Event ID `1102` is "Audit log was cleared" and seeing that in a Windows Security log is a huge red flag. If logs go quiet at exactly the time you'd expect them to be loudest, that's its own kind of evidence.

That's logs done. Onto the next one.

---