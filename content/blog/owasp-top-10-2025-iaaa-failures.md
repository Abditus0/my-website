---
title: "OWASP Top 10 2025: IAAA Failures — TryHackMe Cyber Security 101"
date: 2026-08-21
category: "writeup"
excerpt: "Walkthrough of TryHackMe's OWASP Top 10 2025: IAAA Failures room — Learn about A01, A07, and A09 in how they related to failures in the applied IAAA model."
image: "/images/blog/147.png"
readtime: "15 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — What is IAAA?](#task-2)
- [Task 3 — A01: Broken Access Control](#task-3)
- [Task 4 — A07: Authentication Failures](#task-4)
- [Task 5 — A09: Logging & Alerting Failures](#task-5)
- [Task 6 — Conclusion](#task-6)

---

## Task 1 — Introduction {#task-1}

OWASP Top 10. If you've poked around web security for any amount of time you've seen this list. It's basically the greatest hits of "ways web apps get owned" and it gets updated every few years. The 2025 version is the latest.

This room only covers three of the ten categories, but they're all related to one thing: how apps handle users. Who they are, whether they're really who they say they are, what they're allowed to do, and whether anyone's keeping track of any of it. That whole bundle has a name, IAAA, which we'll get into next task.

The three categories covered here are:

1. A01: Broken Access Control
2. A07: Authentication Failures
3. A09: Logging & Alerting Failures

Room says it's for beginners and assumes no prior security knowledge, which is mostly true. Just click through and read.

No question on this task.

---

## Task 2 — What is IAAA? {#task-2}

IAAA. Four letters, each one a thing the app needs to do correctly, in order. You can't skip any of them. If step one fails, none of the later steps even matter.

Here's the breakdown:

- **Identity** is just the unique account that represents a person. Usually an email or user ID. It's the "who are you claiming to be" part.
- **Authentication** is proving you're that person. Password, OTP code, passkey, whatever the site uses to verify it's really you.
- **Authorisation** is what you're allowed to do once you're in. A regular user can read their own profile. An admin can delete users. The app has to enforce this.
- **Accountability** is logging all of it. Who did what, when, from where. So when something goes wrong, you can figure out what happened.

If any of these four are broken, an attacker gets to either access stuff that isn't theirs or do things they shouldn't be able to do. That's basically what the rest of this room is about.

**What does IAAA stand for?** `Identity, Authentication, Authorisation, Accountability`

---

## Task 3 — A01: Broken Access Control {#task-3}

This is the one where the server doesn't check if you're allowed to do the thing you're trying to do. It just trusts whatever the request says. Big mistake.

The classic example here is IDOR, Insecure Direct Object Reference. Mouthful of a name for a really simple bug. The URL has an ID in it, like `?id=7`, and that ID points to your account. What happens if you change it to `?id=6`? On a properly built app, the server checks "wait, this user isn't allowed to see account 6" and blocks you. On a broken app, the server just goes "sure here's account 6's data."

That's it. That's the whole bug. And it's everywhere. You'd think after twenty years of people writing about this, devs would stop doing it. They don't.

There's two flavors of privilege escalation that come out of broken access control:

- **Horizontal** is when you stay at your role level but jump to a different user's stuff. Like going from your account to someone else's account. Same kind of access, just on data that isn't yours.
- **Vertical** is when you jump UP a role. Regular user accessing admin-only pages. That's the scarier one because suddenly you can delete things, change settings, etc.

### The static site

The task has a little static site attached. It shows a list of accounts and you can change the `accountID` in the URL to view different ones. Start poking through them. You're looking for the user with more than a million bucks.

When you find the right account ID, there's a note attached to it. That's your flag.

**If you don't get access to more roles but can view the data of another users, what type of privilege escalation is this?** `Horizontal`

**What is the note you found when viewing the user's account who had more than $1 million?** `THM{Found.the.Millionare!}`

---

## Task 4 — A07: Authentication Failures {#task-4}

So authentication is the "are you really you" step. When that breaks, an attacker gets to log in as someone they aren't. There's a bunch of ways this happens:

- **Username enumeration** is when the login form tells you "user not found" vs "wrong password." Now you know which usernames exist on the site. Free info for an attacker.
- **Weak passwords with no lockout** is what it sounds like. If the site lets you guess passwords forever with no rate limit, you can just brute force every common password until something hits.
- **Logic flaws in the login or registration flow** is the fun one. This is where the dev wrote the code in a way that lets you sneak in sideways. Like the bug in this task.
- **Insecure session or cookie handling** is when cookies are guessable, never expire, or get bound to the wrong account.

### The static site

The task here is great because it shows a really subtle one. You want to break into the `admin` account. You don't know the password. What do you do?

Try registering an account called `aDmiN`. Different casing.

The bug is that the registration form doesn't realize `aDmiN` and `admin` are the same user. So you create a new account with that name and set whatever password you want. Then when you log in, the login form normalizes the casing back to `admin` and you end up inside the admin's account. Boom.

This is the kind of bug that sounds fake until you realize a lot of real systems do exactly this. They check usernames case-sensitively when creating accounts but case-insensitively when logging in. Or vice versa. Either way, you end up with two "different" accounts that point to the same dashboard.

The fix is to enforce uniqueness on the normalized version of the username. Always store it in lowercase or always check lowercase. Pick one and stick with it.

Register the `aDmiN` account, log in, grab the flag off the dashboard.

**What is the flag on the `admin` user's dashboard?** `THM{Account.confusion.FTW!}`

---

## Task 5 — A09: Logging & Alerting Failures {#task-5}

Last one. This is the boring one that nobody cares about until they need it.

Logging and alerting is about recording what happens on your app so that when something goes wrong, you can figure out what happened. If you don't log auth events, you can't tell when someone got brute-forced. If you don't alert on weird stuff, an attacker can sit in your system for months before anyone notices. If your logs are stored on the same server that got hacked, the attacker can just delete them on their way out.

Common ways this fails:

- No logs at all for login attempts (so you can't see brute force).
- Logs exist but are too vague to be useful ("an error occurred" cool thanks).
- No alerting, so nobody notices until much later.
- Short retention, so by the time you want to investigate, the logs are gone.
- Logs stored where the attacker can edit or delete them.

### The static site

This one flips the script. Instead of attacking, you're investigating. The task gives you a log viewer and you need to figure out what happened in an attack.

Read through the logs carefully. You're looking for three things:

1. An IP that's hammering the login endpoint over and over. That's the brute force.
2. The successful login that came after the brute force, and which account it landed on.
3. What that compromised account did once it got in. There should be a request to some specific endpoint that obviously shouldn't have been hit.

The whole point of this exercise is to feel what it's like to investigate WITH good logs, and then imagine doing it without them. If the logs didn't have IPs, you couldn't track the attacker. If they didn't have timestamps, you couldn't tell what came before what. If success and failure looked the same in the log, you couldn't tell when they got in. Every field in those logs is there for a reason and if any are missing the investigation falls apart.

**It looks like an attacker tried to perform a brute-force attack, what is the IP of the attacker?** `203.0.113.45`

**Looks like they were able to gain access to an account! What is the username associated with that account?** `admin`

**What action did the attacker try to do with the account? List the endpoint the accessed.** `/supersecretadminstuff`

---

## Task 6 — Conclusion {#task-6}

Quick recap.

A01 Broken Access Control is about the server not checking if you're allowed to do the thing. Fix is simple to say and hard to do, check on every single request, server side, never trust the client.

A07 Authentication Failures is about the app not being able to reliably tell if you are who you say you are. Fix is to enforce unique usernames properly (including casing), lock out or rate limit brute force attempts, and rotate sessions when stuff like passwords or roles change.

A09 Logging & Alerting Failures is about not knowing what's happening on your own app. Fix is to log everything important (failed and successful logins, password changes, role changes, admin actions), store the logs somewhere the attacker can't touch them, keep them around long enough to use, and alert on stuff that looks weird.

Decent intro room. The static sites are tiny but they demonstrate the bugs in a way that sticks better than just reading about them. The `aDmiN` one in particular is the kind of thing that will probably stick with you for the rest of your career because it's so dumb and so real.


---