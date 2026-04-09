---
title: "Become a Hacker — TryHackMe Pre Security Path"
date: 2026-04-03
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Become a Hacker room - Explore offensive security, the hacker mindset, and hack a web app to improve security!"
image: "/images/blog/52.png"
readtime: "20 min read"
draft: false
---

# Become a Hacker

After all the theory, the networking concepts, the CIA Triad, the cryptography stuff, TryHackMe is finally saying: alright, time to actually break something. In a legal and controlled way. But still. We are doing hacking now.

---

## Tasks

- [Task 1 — What is Offensive Security](#task-1)
- [Task 2 — Finding Weaknesses](#task-2)
- [Task 3 — Exploiting Weaknesses](#task-3)
- [Task 4 — Where to Go From Here](#task-4)

---

## Task 1 — What is Offensive Security {#task-1}

Offensive security is about proactively testing systems by attempting to break into them before real attackers can. The idea is that if you find the weaknesses first, you can fix them before someone with bad intentions finds them instead.

The room points out that if you have been going through the Pre Security path, you have already been building the foundation for this. All that stuff about how computers work, how networks talk to each other, how web applications are structured. That was not just background knowledge. That was setup for this exact moment.

An offensive security mindset starts with questions. What is exposed? What can be accessed? What assumptions is the system making? A hacker applies those questions methodically and pays attention to how systems respond to unexpected input.

The room is clear that when it says hacking here, it means penetration testing. Ethical, legal, structured. A hacker in this context is someone using those skills to improve security, not damage it.

By the end of the room you should be able to explain what offensive security is and why it exists, understand the common terminology and methodology, get hands-on with real tools in a safe environment, and know what to learn next.

---

## Task 2 — Finding Weaknesses {#task-2}

Before jumping into the actual exercise, the room goes through the key terms you will keep seeing as you go deeper into offensive security. Good to know these properly so they do not confuse you later.

Red Teaming is a structured and authorized attack methodology that simulates a real adversary to test how well defenses hold up, within a defined scope.

A Penetration Test is a structured security assessment where an authorized tester tries to find and exploit vulnerabilities within a defined scope to understand real-world risk.

A Vulnerability is a weakness or flaw in a system, application, or configuration that an attacker could abuse.

An Exploit is the technique or method used to actually take advantage of a vulnerability to get some outcome, like accessing restricted data or functionality.

Scope is the boundary of what is allowed during a test. It defines which systems and actions are permitted and what is completely off limits.

The room makes one thing very clear across all of these. Permission. Ethical hacking only works when it is explicitly authorized. In the real world, organizations hire penetration testers or red teams to simulate attacks against their own systems. The goal is not damage. It is to find the gaps so they can be fixed.

### The scenario

Mike has built a website and is about to launch it. He is nervous, reasonably, because businesses get targeted by attackers all the time. Before going live he wants to know if any sensitive or unintended pages have been left publicly accessible. You have been asked to assess his web application and find anything that should not be there.

The split-screen setup gives you a simulated browser showing `http://www.onlineshop.thm/` and a terminal in the bottom half.

### Manual testing first

The first approach is dead simple. You just try adding different paths to the URL and see what comes back. A 404 means the page does not exist. If something loads, you found something.

The pages to test manually:

`http://www.onlineshop.thm/sitemap`

`http://www.onlineshop.thm/mail`

`http://www.onlineshop.thm/register`

`http://www.onlineshop.thm/login`

`http://www.onlineshop.thm/admin`


Go through them one by one in the simulated browser. Most will 404. One will not.

### Using Gobuster

Doing this manually with five pages is fine. Doing it with hundreds of pages would be miserable. That is where Gobuster comes in. It automates the scanning and does in seconds what would take you ages manually.

Head to the terminal and run:

```shell
gobuster dir --url http://www.onlineshop.thm/ -w /usr/share/wordlists/dirbuster/directory-list.txt
```

Breaking down what that command does:

`gobuster` is the tool

`dir` tells it to run in directory and file enumeration mode

`--url http://www.onlineshop.thm/` is the target

`-w /usr/share/wordlists/dirbuster/directory-list.txt` is the wordlist it uses to guess directory and file names

Watch the output roll in. It will flag anything that exists with a status code next to it. A 200 means the page loaded successfully. That is what you are looking for.

**Question: Using either method, what hidden web page did you discover?** `/login`

**Question: Based on your Gobuster scan results, what status code is returned when accessing the hidden page?** `200`

---

## Task 3 — Exploiting Weaknesses {#task-3}

Finding the hidden page was only the first step. On its own, knowing that `/login` exists is not catastrophic. But the room introduces a concept here: chaining weaknesses.

Think of security weaknesses like dominoes. One domino falling on its own does not cause much damage. But when they are lined up close together, knocking over the first one can trigger a chain reaction that brings everything down. The hidden login page was the first domino. A weak password is the second.

### Thinking like a hacker

The room lists some mindset points that are worth keeping in mind going forward.

Ask questions. Do not assume a feature works exactly as intended. Ask what happens if it does not.

Test the unexpected. Try inputs and actions that the developers probably never considered.

Chain small weaknesses. Something tiny and seemingly harmless on its own might connect to something else and become a real problem.

Think like an adversary. How would someone with bad intentions actually approach this target?

### Why credentials matter

Once an attacker has valid credentials they can get into private areas of an application. And once they are in, a lot opens up. Sensitive functionality like modifying data or triggering restricted processes. User data like names, email addresses, and account details. Administrative features that can let someone manage users or change settings. And further attack opportunities because authenticated access often exposes even more vulnerabilities.

### Manual password testing

You found the hidden `/login` login page. Now you need credentials. The most common username to try first is `admin`, so start there. The room gives a short list of passwords to try manually:

`abc123`

`123456`

`password`

`qwerty`

`654321`

Go through them one by one on the login page. One of them works.

### Using Hydra

Trying five passwords manually is fine. Trying thousands is not. Hydra is a password testing tool that automates login attempts using a wordlist. The technique is called a dictionary attack because it relies on a predefined list of possible passwords rather than trying every possible combination.

Head back to the terminal and run:

```shell
hydra -l admin -P passlist.txt www.onlineshop.thm http-post-form "/login:username=^USER^&password=^PASS^:F=incorrect" -V
```

Breaking down the command:

`hydra` is the tool

`-l admin` sets the username to try

`-P passlist.txt` is the password list

`www.onlineshop.thm` is the target

`http-post-form` tells Hydra this is an HTTP POST form login

`"/login:username=^USER^&password=^PASS^:F=incorrect"` tells Hydra how the login request is structured and how to tell when an attempt has failed

`-V` enables verbose output so you can watch every attempt as it happens

The valid password shows up on the second to last line of the results. Watch it go through the list and find the match. Much faster than doing it by hand.

Once you have the password, log in with `admin` and the password you found. A flag will be waiting for you on the page.

**Question: What password did you discover for the admin user?** `qwerty`

**Question: After logging in, what secret message is displayed on the page?** `THM{born_to_hack!}`

**Question: How many failed password attempts were made before the correct password was found?** `17`

---

## Task 4 — Where to Go from Here {#task-4}

The room wraps up with a recap and a look at what is next.

The key terms one more time, some of which are new additions from this task:

Scope is the exact systems and actions allowed during a security test. Vulnerability is a hidden weakness that an attacker could use to break in. Exploit is the method that takes advantage of a vulnerability. Enumeration is the process of collecting details about a system, users, and services to find weak points. Credentials are login details like usernames and passwords. Authentication is the step that checks if someone is actually who they claim to be. Dictionary attack is trying a predefined wordlist to guess a password.

### What comes next

The room is honest that starting out in cyber security can feel overwhelming because there is so much to learn. The advice it gives is pretty solid though. Break the field down, pick an area that actually interests you, and practice regularly with hands-on exercises. A little bit every day builds up faster than you expect.

If offensive security felt interesting, that is one direction. If the idea of defending systems and detecting attacks appeals more, that is another. Both are valid and both connect to each other.

Some career paths the room points to:

Penetration Tester or Ethical Hacker focuses on safely exploring vulnerabilities within a defined scope. Vulnerability Researcher identifies and validates undiscovered weaknesses in software and hardware. Red Team Operator simulates real-world adversaries to test an organization's detection and response capabilities.

And for further learning, TryHackMe suggests Become a Defender to see the other side of the coin, and then paths like Cyber Security 101, Jr Penetration Tester, or SOC Level 1 depending on where your interests land.

---