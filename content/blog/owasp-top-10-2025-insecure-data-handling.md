---
title: "OWASP Top 10 2025: Insecure Data Handling — TryHackMe Cyber Security 101"
date: 2026-08-28
category: "writeup"
excerpt: "Walkthrough of TryHackMe's OWASP Top 10 2025: Insecure Data Handling room — Learn about A04, A05, and A08 as they related to insecure data handling."
image: "/images/blog/149.png"
readtime: "18 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — A04: Cryptographic Failures](#task-2)
- [Task 3 — A05: Injection](#task-3)
- [Task 4 — A08: Software or Data Integrity Failures](#task-4)

---

## Task 1 — Introduction {#task-1}

Third OWASP room in the module. This one is all about insecure data handling, which is a fancy way of saying "the app got handed some data and trusted it way too much." All three categories here come down to the app not treating data with the suspicion it deserves.

The three we're covering:

- A04: Cryptographic Failures
- A05: Injection
- A08: Software or Data Integrity Failures

Yeah, Cryptographic Failures shows up AGAIN. It was in the design flaws room too. That's not a mistake, it genuinely appears in multiple spots because crypto gets messed up in so many different ways. This time it's a hands-on challenge instead of just theory.

Every task has its own practical on a different port. Crypto is on `:8001`, injection on `:8000`, and the deserialization one on `:8002`. Spin up the machine, give it a minute, and connect over the AttackBox or the VPN like usual.

No question on this task.

---

## Task 2 — A04: Cryptographic Failures {#task-2}

Quick refresher since we've seen this before. Cryptographic failures are when sensitive data isn't protected properly. No hashing on passwords, weak or ancient algorithms like MD5, SHA1, or DES, encryption keys left lying around, data sent in plain text over the wire.

The room drops one line that I really like: the classic failure of an app "rolling their own cryptography" instead of using the well-tested stuff everyone else uses. This is a cardinal sin in security. Real crypto algorithms have been beaten on by thousands of smart people for decades. Your homemade cipher has been reviewed by, uh, you. On a Tuesday. Guess which one breaks first.

The fix side is simple to say. Hash passwords with slow, strong functions like bcrypt, scrypt, or Argon2. Don't invent your own encryption, use trusted libraries. And never ever hardcode credentials into source code or config files, use a proper secrets manager.

### The challenge

Head to `http://MACHINE_IP:8001`. It's a note sharing service, and the page is titled something like "Weak XOR Cipher." That title is a giant spoiler for what's coming. The notes are locked up with XOR encryption using a weak shared key.

Here's the thing about XOR as "encryption." It's not encryption. XOR is a reversible math operation, and it's symmetric, meaning the same key that scrambles the data also unscrambles it. If you know even a tiny bit of the plaintext, or the key is short and guessable, the whole thing falls apart. It was never built to protect anything. People misuse it because it looks like magic if you don't know what it is.

The notes on the page are XOR encrypted and then Base64 encoded on top. So to read them you peel it back in reverse order: Base64 decode first, then XOR with the key.

The cleanest way to do this is CyberChef. If you've never used it, it's a free web tool that lets you chain data operations together like a recipe. Open it up in a new tab.

Build the recipe like this:

1. Drag in **From Base64**. This undoes the outer encoding and gives you the raw XOR ciphertext.
2. Drag in **XOR** below it.
3. Now you need the key. The room's key is `key1`. Set the XOR key to `key1` (as UTF8) and the decoded note pops out the bottom.

Paste one of the encrypted notes into the input, and the plaintext appears. Work through the notes and one of them has the flag sitting in it.

If you didn't know the key going in, this is where a bit of brute forcing comes in. XOR keys on a challenge like this are tiny and dumb on purpose, so you either test obvious guesses (`key1`, `key2`, `password`, that kind of thing) or throw Burp Intruder at it and let it grind through a list. Some people did it that way. But honestly on a box labeled "Weak XOR Cipher" the key being `key1` is about as weak as it gets, so trying obvious keys hits fast. That's the lesson, weak crypto means you don't even need to be clever.

**Decrypt the encrypted notes. One of them will contain a flag value. What is it?** `THM{WEAK_CRYPTO_FLAG}`

---

## Task 3 — A05: Injection {#task-3}

Injection. The old faithful of web hacking. It's been on the OWASP list forever and by 2025 it shows up TWICE, which tells you how stubborn this whole class of bug is.

Injection is when an app takes your input and, instead of treating it as plain data, feeds it straight into something that runs commands or queries. A database, a shell, a template engine, an API. The app was supposed to keep your input in its lane as data, but it lets your input become code. You've seen this with SQL injection where you sneak a query into a login form. Same idea, different targets:

- SQL Injection (into a database)
- Command Injection (into a shell)
- AI Prompt Injection (into an LLM, the new hotness)
- Server Side Template Injection, or SSTI (into a template engine)

The fix is always the same core idea: treat all user input as untrusted. Use parameterized queries for SQL so input can't become part of the query structure. Avoid functions that hand your input straight to the shell. Validate, sanitize, escape dangerous characters, enforce strict types before the app processes anything.

Small funny thing worth mentioning. The room text says "Today's practical will showcase command injection" and then immediately in the next sentence says "This example illustrates Server Side Template Injection (SSTI)." So the room contradicts itself in back to back sentences. It's SSTI. Ignore the command injection line, somebody fumbled the copy paste. This is the kind of thing that makes you second guess yourself for a minute before you realize no, the room just has a typo.

### The challenge

Go to `http://MACHINE_IP:8000`. There's an input field that renders whatever you type back onto the page. That "renders it back" behavior is the tell. If the app is dumb about it, it's shoving your input through a template engine, and this one is running Jinja2 (the templating engine Flask uses).

First thing you always do with suspected SSTI is the math test. Type this:

```
{{7*7}}
```

If the page prints `49` back at you, congratulations, it evaluated your input as a template expression instead of printing it literally. A safe app would show you the text `{{7*7}}` right back. This one does the math, which means it's running whatever you put inside those double curly braces. Now it's just a matter of climbing from "can do math" up to "can read files."

Jinja2 gives you access to a bunch of Python objects if it isn't locked down properly, and this one isn't. The goal is to reach Python's built-in `open()` function so you can read `flag.txt`. There are a couple of payloads floating around that both work, pick whichever lands:

```
{{ request.application.globals.builtins.open('flag.txt').read() }}
```

or the shorter one using `lipsum`:

```
{{ lipsum.globals.builtins.open('flag.txt').read() }}
```

Both do the same thing through slightly different doors. `lipsum` and `request` are objects Jinja2 hands you for free. From either one, `__globals__` gets you into the module's global namespace, `__builtins__` gets you Python's built-in functions, and from there `open('flag.txt').read()` works exactly like it would in any normal Python script. You're basically standing inside a Python interpreter that the web page politely handed you.

Paste the payload into the field, submit, and the contents of `flag.txt` print out on the page.

If you want to understand what you're doing instead of copy pasting, poke around with `{{ request.__dict__ }}` first. It dumps a big pile of Flask internals and lets you see the objects you have to work with. That's how people found these chains in the first place, just exploring what Jinja2 leaves exposed.

**Perform an SSTI attack on the practical. You need to read the contents of flag.txt that is located within the same directory as the web application.** `THM{SSTI_FLAG_OBTAINED}`

---

## Task 4 — A08: Software or Data Integrity Failures {#task-4}

Last one, and this is my favorite of the three because the exploit is so clean.

Software or Data Integrity Failures happen when an app trusts code, updates, or data without checking where it came from or whether it's been tampered with. Trusting a software update without verifying the signature. Loading a script from some sketchy source. Accepting a serialized blob of data and just... running it. The app assumes the data is safe because why wouldn't it be, and that assumption is the hole.

The fix is to set up trust boundaries and verify integrity. Use checksums and signatures on updates. Only let trusted sources modify the important files. And lock this down inside your build pipeline too, because CI/CD is a juicy target for this exact thing.

### The challenge

Go to `http://MACHINE_IP:8002`. This one demonstrates insecure deserialization in Python, specifically with the `pickle` module.

Here's why pickle is a loaded gun. Pickle turns Python objects into a byte stream so they can be saved or sent somewhere, and then turns them back into objects later. Sounds harmless. The problem is that during the "turn back into an object" step (deserializing), pickle will happily execute code baked into the object through a special method called `__reduce__`. So if an app deserializes pickle data that came from a user, the user gets to run code on the server. Full stop. That's game over.

The app on this box takes a Base64 pickle blob from you and deserializes it. So we craft a malicious object whose `__reduce__` method tells pickle "when you unpack me, run this code." Here's the script:

```python
import pickle
import base64

class Malicious:
    def __reduce__(self):
        # __reduce__ tells pickle what to call when it deserializes this object.
        # We hand it eval and a string of code to run.
        return (eval, ("open('flag.txt').read()",))

# Serialize our malicious object into a pickle byte stream
payload = pickle.dumps(Malicious())

# Base64 encode it so it survives being pasted into a web form
encoded = base64.b64encode(payload).decode()
print(encoded)
```

Run that on your own machine. It spits out a Base64 string that starts with `gASV...`. That's your weapon.

Now paste that Base64 string into the app's deserialize input box and submit. The server takes your blob, runs `pickle.loads()` on it, and the moment it does, your `__reduce__` fires, `eval` runs `open('flag.txt').read()`, and the flag comes back in the response.

The scary part is how simple the exploit is. The server had no way to know your blob was hostile. It trusted the data, unpacked it, and ran whatever was inside. No cleverness needed once you understand `__reduce__`. This is exactly why the security world screams "never deserialize untrusted data with pickle." If you need to accept structured data from users, use JSON, which is just data and can't smuggle code inside it.

**Use Python to pickle a malicious, serialised payload that reads the contents of flag.txt and submits it to the application. What are the contents of flag.txt?** `THM{INSECURE_DESERIALIZATION}`

---

## Wrap up

Solid room, and a fun one because all three tasks are hands-on with a real payload instead of just clicking through theory.

Quick recap of what each taught:

A04 Cryptographic Failures. The notes were "protected" with XOR, which is not protection, it's a light coat of paint. Base64 decode, XOR with a weak key, done. Never roll your own crypto and never call XOR encryption.

A05 Injection. The app rendered our input as a Jinja2 template, so `{{7*7}}` becoming `49` was the crack in the door. From there we climbed through Python's built-ins to read the flag file. Treat every scrap of user input as untrusted.

A08 Data Integrity. The app deserialized a pickle blob we controlled, and pickle's `__reduce__` let us run code on the server the instant it unpacked our payload. Never deserialize untrusted data with pickle, use JSON.

The thread tying all three together is the room's whole point: don't trust data just because it showed up. Weak crypto trusts that nobody will look too hard. SSTI trusts that input is just text. Deserialization trusts that a blob is just a blob. In all three, the app assumed the best about data it had no business trusting, and that assumption is the vulnerability every single time.

Couple notes from running it. On the XOR task, if `key1` doesn't work on your instance, try the other obvious short keys or just brute force it, the whole point is that the keyspace is tiny. On the SSTI task, if one payload gets filtered, try the other one, `lipsum` and `request` are two different roads to the same place. And on the pickle task, make sure you run the script on a machine that has the same-ish Python version as the target or you can get weird unpickling errors, though for a simple `eval` payload like this it's rarely a problem.

---