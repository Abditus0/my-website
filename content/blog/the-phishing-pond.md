---
title: "The Phishing Pond"
date: 2026-04-01
category: "ctf"
excerpt: "Walkthrough of the TryHackMe Phishing Pond challenge - Catch the phish before the phish catches you."
image: "/images/blog/20.png"
readtime: "10 min read"
draft: false
---

## The Challenge

This one is a bit different. No exploits, no reverse engineering. I had to identify phishing emails from real ones. The rules were simple: 30 seconds per email to decide if it's a scam or not, 3 lives, and 10 email scenarios to get through. Let's go.

![](/images/blog/the-phishing-pond/1.png)

---

## Email 1 - Phishing

![](/images/blog/the-phishing-pond/2.png)

First one and already phishing. I looked closely at the link and it was a dead giveaway.

![](/images/blog/the-phishing-pond/3.png)

---

## Email 2 - Legit

![](/images/blog/the-phishing-pond/4.png)

This one checked out. Nothing suspicious.

---

## Email 3 - Legit

![](/images/blog/the-phishing-pond/5.png)

Legit again. Moving on.

---

## Email 4 - Phishing

![](/images/blog/the-phishing-pond/6.png)

This one was calling for immediate action and was trying to collect credentials. That combination is almost always a red flag.

![](/images/blog/the-phishing-pond/7.png)

---

## Email 5 - Phishing

![](/images/blog/the-phishing-pond/8.png)

Same thing here. Immediate action required. Phishing emails love to create urgency to pressure you into clicking without thinking.

![](/images/blog/the-phishing-pond/9.png)

---

## Email 6 - Phishing

![](/images/blog/the-phishing-pond/10.png)

This one claimed I won a random $2000 refund and was asking for personal info. Classic scam. If something sounds too good to be true, it's probably scam.

![](/images/blog/the-phishing-pond/11.png)

---

## Email 7 - Phishing

![](/images/blog/the-phishing-pond/12.png)

This was the sneaky one. Someone was trying to impersonate a real person. Easy to miss if you're not paying attention. I had to look carefully at the sender details to catch it.

![](/images/blog/the-phishing-pond/13.png)

---

## Email 8 - Legit

![](/images/blog/the-phishing-pond/15.png)

Legit. No issues here.

---

## Email 9 - Phishing

![](/images/blog/the-phishing-pond/16.png)

The link in this one was trying to mimic a real URL. At a quick glance it looked fine but looking closely the domain was slightly off. That's a classic phishing trick.

---

## Email 10 - Legit

![](/images/blog/the-phishing-pond/17.png)

Last one and it's legit. 10 out of 10, no lives lost.

---

![](/images/blog/the-phishing-pond/18.png)

That was actually a fun one. A good reminder that phishing is not always technical. Sometimes all it takes is a fake link or a sense of urgency to trick someone.

- Urgent language like "immediate action required" is almost always a red flag
- Always hover over links and check the actual domain before clicking anything
- If an email is promising you money or a refund out of nowhere, ignore it
- Impersonation emails can be very convincing, always double check the sender
