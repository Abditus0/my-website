---
title: "DNS in Detail — TryHackMe Pre Security Path"
date: 2026-03-30
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's DNS in Detail room - Learn how DNS works and how it helps you access internet services."
image: "/images/blog/16.png"
readtime: "10 min read"
draft: false
---

# DNS in Detail

This room is all about DNS. How it works, what the different record types do, and what actually happens behind the scenes when you type a website into your browser. Turns out there's a lot going on.

---

## Tasks

- [Task 1 — What is DNS?](#task-1)
- [Task 2 — Domain Hierarchy](#task-2)
- [Task 3 — Record Types](#task-3)
- [Task 4 — Making a Request](#task-4)
- [Task 5 — Practical](#task-5)

---

## Task 1 — What is DNS? {#task-1}

Every device on the internet has an IP address. Something like `104.26.10.229`. Four sets of numbers, each between 0 and 255, separated by dots. That's how computers find each other.

The problem is nobody wants to memorise that. So **DNS (Domain Name System)** exists to bridge the gap. Instead of typing `104.26.10.229` into your browser, you type `tryhackme.com` and DNS handles the translation behind the scenes.

Think of it like a contacts list on your phone. You don't remember anyone's number, you just tap the name.

**Question: What does DNS stand for?** `Domain Name System`

---

## Task 2 — Domain Hierarchy {#task-2}

Domain names have a structure to them. It's not just random words. Let's break it down using `admin.tryhackme.com` as the example.

**TLD (Top-Level Domain)**

The TLD is the last part of a domain. In `tryhackme.com`, that's `.com`.

There are two flavours:

- **gTLD (Generic Top-Level Domain)**: meant to hint at the purpose of the site. `.com` for commercial, `.org` for organisations, `.edu` for education, `.gov` for government. There are over 2000 of these now, including newer ones like `.club`, `.online`, `.biz`
- **ccTLD (Country Code Top-Level Domain)**: tied to a specific country. `.ca` for Canada, `.co.uk` for the UK, and so on

**Second-Level Domain**

In `tryhackme.com`, the `tryhackme` part is the second-level domain. This is the bit you actually register when you buy a domain name. It's capped at 63 characters and can only use letters, numbers, and hyphens (-). No starting or ending with a hyphen though, and no two hyphens in a row.

**Subdomain**

The subdomain sits to the left of the second-level domain. In `admin.tryhackme.com`, `admin` is the subdomain. Same rules apply as the second-level domain: 63 characters max, letters, numbers, and hyphens only.

You can stack multiple subdomains like `jupiter.servers.tryhackme.com`, but the whole thing has to stay under 253 characters total. There's no cap on how many subdomains you can create.

**Question: What is the maximum length of a subdomain?** `63`

**Question: Which of the following characters cannot be used in a subdomain ( 3 b _ - )?** `_`

**Question: What is the maximum length of a domain name?** `253`

**Question: What type of TLD is .co.uk?** `ccTLD`

---

## Task 3 — Record Types {#task-3}

DNS isn't just for websites. There are different record types depending on what you're trying to look up.

**A Record**
Maps a domain to an IPv4 address. Like `104.26.10.229`. This is the most common one.

**AAAA Record**
Same idea but for IPv6 addresses. Like `2606:4700:20::681a:be5`. The four A's are a hint that it's the bigger address format.

**CNAME Record**
Points a domain to another domain instead of an IP. For example, `store.tryhackme.com` might return a CNAME pointing to `shops.shopify.com`. Then a second DNS lookup happens to get the actual IP of that domain.

**MX Record**
Tells you where to send emails for a domain. An MX record for `tryhackme.com` might point to something like `alt1.aspmx.l.google.com`. These records also have a priority value so if the main mail server goes down, your email knows which backup to try next.

**TXT Record**
A free text field. Can hold basically anything. Common uses are proving you own a domain when signing up for a third party service, or listing which servers are allowed to send email on behalf of your domain. That second one helps fight spam.

**Question: What type of record would be used to advise where to send email?** `MX`

**Question: What type of record handles IPv6 addresses?** `AAAA`

---

## Task 4 — Making a Request {#task-4}

Here's what actually happens when you type a domain into your browser. There are a few stops along the way.

**1. Local Cache**
Your computer checks if it already looked this domain up recently. If it has a saved answer, it uses that and skips everything else.

**2. Recursive DNS Server**
If there's no cached answer, the request goes to your Recursive DNS Server. This is usually provided by your ISP, though you can set your own. It also has its own cache. For popular sites like Google or X, the answer is almost always sitting here already. If not, it goes looking.

**3. Root DNS Servers**
The recursive server reaches out to one of the internet's root servers. These don't know the answer themselves, but they know who does. They look at the TLD in your request, like `.com`, and point you to the right TLD server.

**4. TLD Server**
The TLD server knows which authoritative server is responsible for the domain you're asking about. It sends you there.

**5. Authoritative DNS Server**
This is where the actual DNS records live. It's the source of truth for that domain. It sends the answer back to the recursive server, which caches it for next time and passes it back to you.

Every DNS record has a **TTL (Time To Live)** value. It's a number in seconds that tells your computer how long to keep that answer cached before it needs to ask again. This cuts down on unnecessary lookups.

**Question: What field specifies how long a DNS record should be cached for?** `TTL`

**Question: What type of DNS Server is usually provided by your ISP?** `Recursive DNS Server`

**Question: What type of server holds all the records for a domain?** `Authoritative DNS Server`

---

## Task 5 — Practical {#task-5}

Interactive task where you use a tool to make real DNS queries against `website.thm` and inspect the results.

Spend a little time reviewing this, and it will help you better understand what you just learned about DNS.

**Question: What is the CNAME of shop.website.thm?** `shops.myshopify.com`

**Question: What is the value of the TXT record of website.thm?** `THM{7012BBA60997F35A9516C2E16D2944FF}`

**Question: What is the numerical priority value for the MX record?** `30`

**Question: What is the IP address for the A record of www.website.thm?** `10.10.10.10`

---

That's DNS. It runs quietly in the background of basically everything you do online. Every click, every page load, every email. That’s actually what happens each time.

---