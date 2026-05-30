---
title: "IDS Fundamentals — TryHackMe Cyber Security 101"
date: 2026-05-29
category: "writeup"
excerpt: "Walkthrough of TryHackMe's IDS Fundamentals room — Learn the fundamentals of IDS, along with the experience of working with Snort."
image: "/images/blog/133.png"
readtime: "26 min read"
draft: false
---

## Tasks

- [Task 1 — What Is an IDS](#task-1)
- [Task 2 — Types of IDS](#task-2)
- [Task 3 — IDS Example: Snort](#task-3)
- [Task 4 — Snort Usage](#task-4)
- [Task 5 — Practical Lab](#task-5)

---

## Task 1 — What Is an IDS {#task-1}

So we did firewalls last room. Firewalls sit on the edge of your network and decide who gets to come in or go out. They block bad stuff at the gate but what happens when something sneaks past the gate?

That's the gap an IDS fills. Intrusion Detection System. Where the firewall is the guard at the front door, the IDS is the security camera inside the building. Watching everything that's already happening inside the network. If someone bypassed the firewall by looking like legitimate traffic and then started doing weird stuff once they were inside, the IDS is what notices and screams about it.

The key thing to understand right away is what an IDS does NOT do. It does NOT block traffic. It does NOT stop attacks. It just notices things and tells you. It's purely detection and alerting. If you want something that blocks the bad traffic on top of detecting it, that's an IPS (Intrusion Prevention System), which is a different acronym for a related but distinct thing.

Why have something that only watches and doesn't act? Because automatic blocking is dangerous. False positives in an IDS mean an analyst gets a heads up to investigate. False positives in an IPS mean legitimate business traffic gets dropped and your phone rings at 2 AM. There's a reason a lot of organizations still run their intrusion systems in detect-only mode even when they could enable prevention.

This room covers the types of IDS, then dives into Snort which is the open-source IDS pretty much everyone uses or has at least seen.

**Can an intrusion detection system (IDS) prevent the threat after it detects it?** `Nay`

---

## Task 2 — Types of IDS {#task-2}

IDSes are categorized two different ways depending on what you're looking at. One axis is WHERE you deploy them, the other is HOW they detect things.

### Deployment: where is this thing sitting

**Host Intrusion Detection System (HIDS).** Installed directly on individual hosts. Each machine has its own IDS running locally, watching its own activity. You get really detailed visibility into what's happening on that specific box (process activity, file changes, logins, all of it). The downside is you have to install and manage one on every host you want to protect, which gets old fast on a network with hundreds of machines. Also they eat CPU and RAM on each host they run on.

**Network Intrusion Detection System (NIDS).** Sits at a strategic spot on the network (usually a span port on a switch, or inline somewhere central) and watches ALL the network traffic flowing through it. One deployment, covers the whole network. You don't get the deep visibility into what's happening inside individual hosts, but you see all the inter-host traffic, which is where a lot of attacker activity happens anyway. Most "the IDS" you'll hear about in the wild is a NIDS.

In practice, real environments often run both. NIDS for network-wide visibility, HIDS on critical assets where you want host-level detail.

### Detection: how does it find things

**Signature-Based IDS.** This one is conceptually simple. Known attacks have known patterns. Take those patterns, save them as signatures in a database, and have the IDS check every packet/event against the signatures. Match = alert. Pretty much the same idea as antivirus.

The big strength is speed and accuracy on known threats. The big weakness is it can ONLY catch things it has a signature for. Brand new attacks (zero-days) with no existing signature are invisible to it. You're always playing catchup to the threat landscape. Snort is the classic signature-based IDS.

**Anomaly-Based IDS.** Different approach. First, learn what "normal" looks like on the network or host. This is the baseline. Then watch for stuff that deviates from normal. Doesn't need signatures, can theoretically catch zero-day attacks because it's not looking for known patterns, it's looking for weird behavior.

Sounds amazing, except in practice these things produce a LOT of false positives. Because the line between "weird because malicious" and "weird because the marketing team is doing something new" is really blurry. You spend a lot of time tuning the baseline so it stops crying wolf at every legitimate weird thing. Still useful, especially for catching novel threats, but you need analysts willing to chase a lot of nothing-burgers.

**Hybrid IDS.** Both at once. Use signatures for known stuff (fast and accurate when applicable), use anomaly detection for the unknown stuff (slower, noisier, but catches things signatures miss). Most modern serious IDS/IPS products are hybrid. The two methods complement each other really well.

There's a tradeoff thing going on. Signature-based is fast and cheap to run, but limited in what it catches. Anomaly-based and hybrid catch more, but they need more compute and more tuning. A small business with a small threat surface might be fine with just signature-based. An enterprise with a giant attack surface and the budget to handle the noise wants hybrid all day.

**Which type of IDS is deployed to detect threats throughout the network?** `Network Intrusion Detection System`

**Which IDS leverages both signature-based and anomaly-based detection techniques?** `Hybrid IDS`

---

## Task 3 — IDS Example: Snort {#task-3}

Time for the star of the show. Snort. Open-source, been around since 1998, originally written by Marty Roesch, now maintained by Cisco (who bought Sourcefire who owned Snort). It's the standard open-source IDS and probably the easiest way to learn how this stuff works.

Snort is signature-based at its core, with some anomaly detection capabilities. It comes with a big pile of built-in rules covering known attack patterns, but the real power is you can write your own rules for anything specific to your environment. You can also disable any built-in rules that don't apply to you and stop them from generating useless noise.

### The three modes of Snort

Snort can be run in three different modes depending on what you want to do with it.

**Packet sniffer mode.** Just reads packets off the wire and displays them. No analysis, no detections. Basically a worse tcpdump. Why would you ever use this? Mostly for quick network troubleshooting when you already have Snort installed and don't want to go grab another tool. The room mentions network performance issues as a use case, where you just want to see what's flowing past without any rules getting in the way.

**Packet logging mode.** Reads packets and logs them to a file in PCAP format. Useful when you want to capture traffic for later analysis (forensic investigation, replaying through different tools, that kind of thing). You can do detection while logging too, so you get both the alerts and the raw traffic dump.

**Network Intrusion Detection System (NIDS) mode.** The main one. Real-time traffic monitoring with rule matching. This is what you're using Snort for. The other modes are just nice extras.

The room says you'll mostly use NIDS mode, which is correct. The packet sniffer and packet logging modes are useful to know about but they're not why you installed Snort.

**Which mode of Snort helps us to log the network traffic in a PCAP file?** `Packet Logging Mode`

**What is the primary mode of Snort called?** `Network Intrusion Detection System Mode`

---

## Task 4 — Snort Usage {#task-4}

Hands on time.

Quick note about "promiscuous mode" the task mentions. By default, a network interface only processes packets addressed TO that host. Promiscuous mode tells the interface "hand me ALL packets you see, even ones not for me." This is what lets Snort run as a NIDS watching all traffic on a network segment. If you only want to monitor traffic for your own host, you don't need promiscuous mode. For real network-wide IDS, you do.

### The Snort directory

Everything Snort lives in `/etc/snort`. Let's see what's in there:

```bash
ubuntu@tryhackme:~$ ls /etc/snort
classification.config  reference.config  snort.debian.conf
community-sid-msg.map  rules             threshold.conf
gen-msg.map            snort.conf        unicode.map
```

The two things you care about right now:

- `snort.conf` is THE main config file. It sets up which rule files to load, what your home network range is (the `$HOME_NET` variable), output options, all the global settings.
- `rules/` is the directory where rule files live. Each `.rules` file is just a text file with rules in it. One of them is `local.rules` which is conventionally where you put your own custom rules so they don't get clobbered when you update the built-in ones.

### Anatomy of a Snort rule

Snort rules look weird at first but they're pretty logical once you see the pattern. Let me give you a sample rule and break it apart.

Sample rule for detecting any ICMP traffic (ping) going to anything on the home network:

```bash
alert icmp any any -> $HOME_NET any (msg:"Ping Detected"; sid:10001; rev:1;)
```

Reading left to right:

**Action.** `alert`. What to do when the rule matches. Other actions exist (log, pass, drop in inline mode) but `alert` is the standard for detection.

**Protocol.** `icmp`. The protocol to match. Can be tcp, udp, icmp, ip.

**Source IP.** `any`. Where the traffic comes from. You could also put a specific IP, a CIDR range, or a variable like `$HOME_NET`.

**Source port.** `any`. Where traffic came from. For ICMP this doesn't really matter, ICMP doesn't have ports.

**Direction operator.** `->`. Means "from source to destination." There's also `<>` which means bidirectional. There is NO `<-` operator, you just flip the source and destination if you want the other direction. The operator is one-way or two-way only.

**Destination IP.** `$HOME_NET`. The variable defined in `snort.conf` that represents your network range. Using variables is way cleaner than hardcoding IPs.

**Destination port.** `any`. Same deal.

Then the parenthesized part is the rule metadata:

- `msg:"Ping Detected"` is the alert message that shows up when this fires.
- `sid:10001` is the Signature ID, a unique number for this rule. Numbers below 1,000,000 are reserved for the official Snort rules. Custom rules should use 1,000,000 and above. The room uses some lower numbers in examples but in practice keep yours above a million to avoid collisions.
- `rev:1` is the revision number. Bump this every time you edit the rule so you can track changes.

Every rule follows this format.

### Adding a custom rule

Time to add one. Open the custom rules file with nano:

```bash
sudo nano /etc/snort/rules/local.rules
```

Don't delete what's already in there (Task 5 needs those existing rules). Just add this new rule at the bottom:

```bash
alert icmp any any -> 127.0.0.1 any (msg:"Loopback Ping Detected"; sid:10003; rev:1;)
```

This is going to fire any time someone pings 127.0.0.1 (the loopback address). Easy to test because we can just ping ourselves.

Save with `Ctrl+X`, then `y`, then Enter.

### Running Snort

Now fire up Snort in NIDS mode:

```bash
sudo snort -q -l /var/log/snort -i lo -A console -c /etc/snort/snort.conf
```

Breaking that down:

- `-q` quiet mode, don't dump the giant Snort banner to the console.
- `-l /var/log/snort` write logs to this directory.
- `-i lo` listen on the loopback interface. If your loopback is called something else (rare), use that name.
- `-A console` send alerts to the console output so you can see them in real time.
- `-c /etc/snort/snort.conf` use this config file.

Now open a second terminal (don't kill the first one) and ping the loopback:

```bash
ping 127.0.0.1
```

Back in the Snort terminal, alerts start flooding in:

```bash
07/24-10:46:52.401504  [] [1:1000001:1] Loopback Ping Detected [] [Priority: 0] {ICMP} 127.0.0.1 -> 127.0.0.1
07/24-10:46:53.406552  [] [1:1000001:1] Loopback Ping Detected [] [Priority: 0] {ICMP} 127.0.0.1 -> 127.0.0.1
07/24-10:46:54.410544  [] [1:1000001:1] Loopback Ping Detected [] [Priority: 0] {ICMP} 127.0.0.1 -> 127.0.0.1
```

Boom, your rule is working. The format is timestamp, then `[generator:sid:rev]`, then the alert message, then the protocol and src -> dst.

### Running Snort on a PCAP

Same general command but instead of `-i lo` to read from an interface, use `-r` to read from a PCAP file:

```bash
sudo snort -q -l /var/log/snort -r Task.pcap -A console -c /etc/snort/snort.conf
```

Replace `Task.pcap` with whatever your file is. This applies ALL the loaded rules against the captured traffic and prints any alerts that fire. This is exactly what forensic investigators do when they have a packet capture from after an incident and want to figure out what happened.

**Where is the main directory of Snort that stores its files?** `/etc/snort`

**Which field in the Snort rule indicates the revision number of the rule?** `rev`

**Which protocol is defined in the sample rule created in the task?** `icmp`

**What is the file name that contains custom rules for Snort?** `local.rules`

---

## Task 5 — Practical Lab {#task-5}

Forensic investigator hat on. The company hands you a PCAP file with traffic from when they got attacked, and you have to run Snort on it to figure out what happened. The PCAP is at `/etc/snort/Intro_to_IDS.pcap`.

Change into the snort directory first:

```bash
cd /etc/snort
```

Then run Snort against the PCAP using the same kind of command from Task 4, but pointed at this PCAP file:

```bash
sudo snort -q -l /var/log/snort -r Intro_to_IDS.pcap -A console -c /etc/snort/snort.conf
```

Snort processes the whole file and dumps alerts as it finds them. You'll see two different alert messages firing on this PCAP.

One of them is a Ping Detected alert (the same kind of ICMP detection from Task 4). The other one is for SSH activity. That's the interesting one.

The SSH alerts look something like this:

```bash
[] [1:1000002:1] SSH connection attempt [] [Priority: 0] {TCP} 10.11.90.211:XXXXX -> ...:22
```

The `[1:1000002:1]` part is `[generator:sid:rev]` so the sid for the SSH rule is `1000002`. The source IP at the start of the line (10.11.90.211) is the attacker connecting in.

For the "other rule message besides SSH" question, look at the other alerts that aren't SSH-related. You'll see the Ping Detected messages firing from ICMP traffic in the PCAP. That's your answer.

If you want to see only certain alerts and the output is too noisy, you can pipe it through grep, like `... | grep SSH` to only see SSH-related alerts. Useful for big PCAPs.

**What is the IP address of the machine that tried to connect to the subject machine using SSH?** `10.11.90.211`

**What other rule message besides the SSH message is detected in the PCAP file?** `Ping Detected`

**What is the sid of the rule that detects SSH?** `1000002`

---