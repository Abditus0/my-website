---
title: "The CIA Triad — TryHackMe Pre Security Path"
date: 2026-04-01
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's The CIA Triad room - Understand the CIA Triad and how it shapes cyber security mindset."
image: "/images/blog/50.png"
readtime: "10 min read"
draft: false
---

# The CIA Triad

Okay so we are finally here. After all those rooms about computers, operating systems, networks, and the web, TryHackMe is now officially starting the cyber security part. Like actual cyber security. And the first thing they want you to understand is not a tool or an attack or a defense technique. It is a concept. Three concepts actually. And they are important.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Understanding the CIA Triad](#task-2)
- [Task 3 — The Security Mindset](#task-3)
- [Task 4 — Conclusion](#task-4)

---

## Task 1 — Introduction {#task-1}

The room opens with a question. We always hear that cyber security protects systems and networks and applications. But what exactly is being protected inside those things?

Like what is the actual thing we are trying to keep safe?

The answer is data. And not just keeping it safe in one way. There are three specific things you need to make sure about that data. The room calls these the three key aspects of cyber security and the whole room is built around explaining them.

There is also a hands-on exercise at the end which I will get to.

---

## Task 2 — Understanding the CIA Triad {#task-2}

So back in the day, information lived on paper. Physical files, folders, cabinets. Today that same information is digital, sitting on servers and flying across networks. And without proper security, three bad things can happen to it. It can be seen by the wrong people, changed without permission, or just completely unavailable when you need it.

Those three problems map directly to the three pillars of the CIA Triad.

Confidentiality, Integrity, and Availability.

Together they form the CIA Triad, and the room is pretty clear that almost everything in cyber security connects back to at least one of them. Whether you are defending or attacking, you are dealing with these three things.

### Confidentiality

This one is about making sure only the right people can access data. If confidentiality breaks, unauthorized people see things they should not see, and that can mean financial loss, privacy violations, or legal trouble depending on what was exposed.

The room gives a good real world example. You are at a coffee shop, you log into your social media on the public wifi, and suddenly you are locked out. Someone on the same network intercepted your login credentials while you were typing them in. Your data was seen by someone who had no business seeing it. Confidentiality failed.

To protect confidentiality, things like encryption and access controls are used. The room mentions these are topics you will dig into later, which is fine because right now just understanding the concept is the goal.

### Integrity

This one is about making sure data is not changed without permission. Even if nobody steals your data, if someone can quietly modify it, you can no longer trust it. And untrustworthy data can cause serious damage.

The example here is a bank transfer. You send money from your phone, someone intercepts the transaction mid way and changes the receiving account number, and your money goes somewhere it was never supposed to go. Nothing was stolen from you directly, but the data was tampered with and the result was still very bad.

Integrity being broken basically means you cannot trust what you are looking at anymore, and that is a scary place to be.

### Availability

This one is about making sure data and services are actually accessible when authorized users need them. The room is upfront that even though this is the third pillar, it is not less important than the other two.

The analogy here is a bank that keeps your money perfectly safe but is just closed whenever you need it because of a power failure. Your money is secure, nobody touched it, but you still cannot use it. That is an availability problem.

In the digital world a classic example is when attackers flood a website with so many requests that it cannot handle them and just goes down. No data is leaked, nothing is modified, but the service is gone and the business suffers. Availability is the reason that kind of attack is still considered a serious threat.

**Question: Which pillar of the CIA focuses on preventing unauthorized modification of data?** `Integrity`

**Question: Which pillar of the CIA focuses on preventing unauthorized access to data?** `Confidentiality`

**Question: Which CIA pillar ensures data is available to users when needed?** `Availability`

**Question: Which CIA pillar gets impacted if the data becomes untrustworthy?** `Integrity`

**Question: What is the term used collectively for all these pillars?** `CIA Triad`

---

## Task 3 — The Security Mindset {#task-3}

This task reframes the CIA Triad in a useful way. It is not just a list of definitions. It is a way of thinking about any security incident.

When something goes wrong, security professionals ask three questions. Was data exposed to someone who should not have seen it? Was data changed without permission? Were systems unavailable when they should have been up? Those three questions cover pretty much every angle of what can go wrong.

Then comes the hands-on exercise. You are given nine different security incidents and you have to drag and drop each one into the CIA pillar it affects the most.

![](/images/blog/the-cia-triad/1.png)

![](/images/blog/the-cia-triad/2.png)

**Question: What is the flag received after solving the exercise?** `THM{CIA_IS_ABOUT_BALANCE}`

**Question: CIA Triad is not just a set of definitions; it's a mindset. What type of mindset is it?** `Security mindset`

---

## Task 4 — Conclusion {#task-4}

The room wraps up by recapping the three terms.

Confidentiality is about making sure digital information is not available to unauthorized individuals. Integrity is about making sure digital information is not modified without permission. Availability is about making sure digital information is not unavailable when needed.

Three pillars. Simple definitions. But the room makes a good point that these will keep showing up everywhere as you go deeper into cyber security. Understanding them now means everything else will have a bit more context to it.

---