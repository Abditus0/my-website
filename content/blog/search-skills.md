---
title: "Search Skills — TryHackMe Cyber Security 101"
date: 2026-04-05
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Search Skills room - Learn to efficiently search the Internet and use specialized search engines and technical docs."
image: "/images/blog/54.png"
readtime: "18 min read"
draft: false
---

# Search Skills

Okay so this is the Cyber Security 101 path now. I skipped the first two rooms because I already covered them back in Pre Security, so we are jumping straight into room three which is Search Skills.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Evaluation of Search Results](#task-2)
- [Task 3 — Search Engines](#task-3)
- [Task 4 — Specialized Search Engines](#task-4)
- [Task 5 — Vulnerabilities and Exploits](#task-5)
- [Task 6 — Technical Documentation](#task-6)
- [Task 7 — Social Media](#task-7)
- [Task 8 — Conclusion](#task-8)

---

## Task 1 — Introduction {#task-1}

The room opens with a fun little reality check. A Google search for "learn cyber security" returns around 600 million results. A search for "learn hacking" returns more than double that. So yeah, information is not exactly in short supply.

The point the room is making here is that being surrounded by information is useless if you do not know how to find what actually matters. Anyone can Google something. The skill is in finding the right thing, quickly, and knowing whether to trust it.

The room covers six things: evaluating sources, using search engines properly, specialized search engines, reading technical documentation, using social media, and checking news outlets.

---

## Task 2 — Evaluation of Search Results {#task-2}

This one is about not being naive on the internet, which sounds obvious, but the room makes a good point. Anyone can publish anything online. Blog posts, wiki edits, social media takes. None of that automatically makes someone an authority on the subject.

So when you are reading something, the room says to think about four things.

The first is the source. Who wrote this and do they actually know what they are talking about?

The second is evidence and reasoning. Are the claims backed by actual facts and logical arguments, or is it just someone's opinion dressed up as truth?

The third is objectivity and bias. Is the person writing this trying to push something? Sell a product? Attack a competitor?

The fourth is corroboration. Can you find other independent, reliable sources that say the same thing? If only one sketchy website is claiming something, that is a red flag.

This stuff matters a lot in cyber security because there is so much noise out there. Bad advice, outdated tutorials, outright misinformation. Learning to filter it early saves you a lot of headaches.

**Question: What do you call a cryptographic method or product considered bogus or fraudulent?** `Snake oil`

**Question: What is the name of the command replacing netstat in Linux systems?** `ss`

---

## Task 3 — Search Engines {#task-3}

Most people use Google by just typing words and hoping for the best. There is a whole layer of search operators that most people never touch, and they are useful.

The room goes through a few of the main ones for Google.

Putting something in double quotes like `"passive reconnaissance"` tells Google you want that exact phrase. Not words scattered around a page, the actual phrase in that order.

The `site:` operator limits results to a specific domain. So if you want to find something only on TryHackMe you would search `site:tryhackme.com whatever you are looking for`.

The minus sign lets you exclude words. Searching for `pyramids -tourism` gives you results about pyramids without all the travel blog garbage cluttering it up.

And `filetype:`. You can search specifically for PDF files, Word docs, PowerPoint presentations. So something like `filetype:ppt cyber security` would find you actual slide decks on the topic.

The room also points to a full list of advanced search operators if you want to go deeper, but these four cover most situations you will run into.

**Question: How would you limit your Google search to PDF files containing the terms cyber warfare report?** `filetype:pdf cyber warfare report`

**Question: What phrase does the Linux command ss stand for?** `socket statistics`

---

## Task 4 — Specialized Search Engines {#task-4}


### Shodan

Shodan is basically Google but for devices connected to the internet. Servers, routers, webcams, industrial control systems, IoT devices. You can search for specific software versions running on exposed devices across the whole internet.

The example the room gives is searching for `apache 2.4.1` and seeing every server still running that version, broken down by country. Which is kind of terrifying when you think about it. All of that is visible.

### Censys

Censys looks similar to Shodan on the surface but the focus is a bit different. Shodan is more about devices and systems. Censys focuses on hosts, websites, certificates, and internet assets. You can use it to enumerate domains, check open ports and services, or spot assets within a network that maybe should not be there.

### VirusTotal

VirusTotal lets you upload a file or paste a URL and it scans it against dozens of antivirus engines all at once. You can also put in a file hash to check results for something that was already scanned before. The room mentions that sometimes a file gets flagged as a virus when it is actually fine, and the community comments section is where people can weigh in and explain what is actually going on.

### Have I Been Pwned

Have I Been Pwned does exactly one thing. You put in an email address and it tells you if that address showed up in any known data breach. Which sounds simple but is actually really important. If someone's email is in a breach, there is a good chance their password is out there too. And since a lot of people reuse passwords across different sites, one breach can unlock a bunch of other accounts.

**Question: What is the top country with lighttpd servers?** `United States`

**Question: What does BitDefenderFalx detect the file with the hash 2de70ca737c1f4602517c555ddd54165432cf231ffc0e21fb2e23b9dd14e7fb4 as?** `Android.Riskware.Agent.LHH`

---

## Task 5 — Vulnerabilities and Exploits {#task-5}

### CVE

CVE stands for Common Vulnerabilities and Exposures and the room describes it as basically a dictionary of vulnerabilities. Every known vulnerability gets assigned a standardized ID like `CVE-2024-29988`. That ID means everyone, researchers, vendors, IT teams, is talking about the exact same thing when they reference it.

The CVE system is maintained by the MITRE Corporation. You can look up any CVE on the CVE Program website or the National Vulnerability Database. The room uses Heartbleed, which is CVE-2014-0160, as an example. It was a massive vulnerability in OpenSSL that exposed encrypted data.

### Exploit Database

The Exploit Database is a resource for finding actual working exploit code. The room is careful to point out that you should not be running exploits against anything you do not have permission to touch, usually locked in with a legally binding agreement.

But if you are doing a legitimate red team assessment and you need to find a working exploit for a known vulnerability, this is one of the places to look. Some of the exploits are marked as verified, which means someone actually tested them.

GitHub is also mentioned here. A lot of CVE-related tools and proof-of-concept exploit code ends up on GitHub too. It is worth knowing how to search there as well.

**Question: What utility does CVE-2024-3094 refer to?** `xz`

---

## Task 6 — Technical Documentation {#task-6}

This task is about one of the most underrated skills in tech in general: actually reading the documentation.

### Linux Man Pages

Before the internet existed, if you wanted to know how a Linux command worked you read the manual page. Man pages still exist on every Linux and Unix-like system and they are still one of the best ways to understand exactly what a command does and what options it supports.

You run `man` followed by the command name. So `man ip` pulls up the full manual for the `ip` command. If you are on Windows or just prefer your browser, you can also search for the man page directly in Google and it will usually come up at the top.

The room also points out that man pages exist not just for commands but also for system calls, library functions, and config files. So it goes deeper than most people realize.

### Windows Documentation

Microsoft has an official Technical Documentation page for their products. Same idea. If you need to know what a specific Windows command does or what parameters it supports, that is the place to go rather than just hoping some random forum post from 2011 is still accurate.

### Product Documentation

Any serious software product has official documentation. The room lists Snort, Apache HTTP Server, PHP, and Node.js as examples. The point is that official documentation is always the most complete and up to date source of information about how something works. Third party tutorials and blog posts go stale. Official docs get maintained.

**Question: What does the Linux command cat stand for?** `concatenate`

**Question: What is the netstat parameter in MS Windows that displays the executable associated with each active connection and listening port?** `-b`

---

## Task 7 — Social Media {#task-7}

The room covers two angles here. The first is OSINT, which is open source intelligence. When you are assessing a company's security, social media is a goldmine of information about the people who work there. LinkedIn is the obvious one. You can find out someone's job title, what technologies they work with, what certifications they have. All of that helps an attacker build a picture of the target's infrastructure without touching a single system.

The other angle is oversharing. People post a lot on social media without thinking about what it reveals. The room uses the example of secret security questions. If someone's account recovery question is "which school did you go to as a child" and they have posts all over Facebook talking about their hometown and childhood memories, an attacker can just answer that question and walk right in. Facebook tends to have that kind of personal history content. LinkedIn is more professional background.

As a defender, part of your job is making sure the people you are protecting are not accidentally handing out this kind of information.

The second half of the task is about staying current. Cyber security moves fast. New threats, new techniques, new tools show up constantly. Following the right groups and channels on social media and subscribing to good news outlets is how you keep up with what is actually happening in the field.

**Question: You are hired to evaluate the security of a particular company. What is a popular social media website you would use to learn about the technical background of one of their employees?** `LinkedIn`

**Question: Continuing with the previous scenario, you are trying to find the answer to the secret question, “Which school did you go to as a child?”. What social media website would you consider checking to find the answer to such secret questions?** `Facebook`

---

## Task 8 — Conclusion {#task-8}

The tools and sources covered here are the most common ones cyber security professionals use, but the landscape keeps changing. New sources pop up, old ones go stale, communities shift. The best way to stay on top of it is to follow relevant groups and channels so you hear about new things as they emerge rather than playing catch up.

---