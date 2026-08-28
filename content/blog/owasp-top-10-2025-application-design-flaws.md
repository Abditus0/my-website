---
title: "OWASP Top 10 2025: Application Design Flaws — TryHackMe Cyber Security 101"
date: 2026-08-27
category: "writeup"
excerpt: "Walkthrough of TryHackMe's OWASP Top 10 2025: Application Design Flaws room — Learn about A02, A03, A06, and A10 and how they related to design flaws in the application."
image: "/images/blog/148.png"
readtime: "30 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — AS02: Security Misconfigurations](#task-2)
- [Task 3 — AS03: Software Supply Chain Failures](#task-3)
- [Task 4 — AS04: Cryptographic Failures](#task-4)
- [Task 5 — AS06: Insecure Design](#task-5)
- [Task 6 — Conclusion](#task-6)

---

## Task 1 — Introduction {#task-1}

Second OWASP room in the module. The last one was about IAAA failures, the stuff around users and logins. This one is about design flaws, which is a different beast. These are bugs that got baked into the app from the very start because someone made a bad assumption while building it. You can't just patch these with a quick code fix a lot of the time, the whole thing was built wrong.

Four categories in this one:

1. AS02: Security Misconfigurations
2. AS03: Software Supply Chain Failures
3. AS04: Cryptographic Failures
4. AS06: Insecure Design

Unlike the IAAA room where everything was a static site, this one has a real target machine. So spin up the AttackBox (or connect over the VPN with your own box) and hit the green "Start Machine" button. Give it the usual couple minutes to boot.

Every challenge in this room lives on a different port of the same machine. Task 2 is on `:5002`, task 3 on `:5003`, task 4 on `:5004`, task 5 on `:5005`. Easy to remember. Just swap `MACHINE_IP` for your target IP throughout.

No question on this task.

---

## Task 2 — AS02: Security Misconfigurations {#task-2}

Security misconfigurations are the boring, dumb mistakes. Not clever code bugs, just someone deploying with bad settings. Default passwords nobody changed. An admin panel exposed to the whole internet. A cloud storage bucket left public. Debug mode still on in production. That kind of thing.

The room throws a bunch of examples at you. Default creds left unchanged, unnecessary services exposed, misconfigured S3 buckets, verbose error messages that leak stack traces, outdated software with known holes. The real-world example is the 2017 Uber breach where a backup AWS S3 bucket was left publicly accessible, so attackers just downloaded driver and rider data straight out of it. No password needed. One deploy mistake, huge breach.

The fix side is the usual hardening checklist. Change defaults, kill unused services, lock down cloud permissions, patch your stuff, and stop showing stack traces to users.

### The challenge

Navigate to `MACHINE_IP:5002`. It's a User Management API. When you hit it you get a welcome message telling you how to use it:

```
Welcome to the User Management API. Use the endpoints below to interact with the system.
GET /api/user/<user_id>
GET /api/user/123
Retrieve user information by ID. User ID must be numeric.
```

So the endpoint is `/api/user/<user_id>`. Let's hit it with a valid numeric ID like it wants:

```bash
curl http://MACHINE_IP:5002/api/user/123
```

Comes back with normal looking user data:

```
email "john@example.com"
id "123"
name "John Doe"
```


Fine. My first instinct was to just churn through user IDs looking for something juicy. You could fire up Burp Intruder and throw a bunch of numbers at it. Problem is, they all come back with basically the same thing. Dead end. I sat there for a bit wondering if I was missing a specific user ID somewhere.

Then I went back and re-read the welcome message. "User ID must be numeric." That line is doing a lot of work. It's basically telling you the app expects a number, so the interesting question is what happens when you DON'T give it a number. How does the app handle input it wasn't expecting?

So instead of a number, feed it text:

```bash
curl http://MACHINE_IP:5002/api/user/test
```

And the app completely falls apart in the best way. Instead of a clean "bad input" message, it dumps a full Python traceback right into the response, flag and all:

```
flag "THM{V3RB0S3_3RR0R_L34K}"
error "Invalid user ID format: test. Flag: THM{V3RB0S3_3RR0R_L34K}"
traceback 'Traceback (most recent call last):
File "/app/app.py", line 21, in get_user
raise ValueError(f"Invalid user ID format: {user_id}. Flag: {FLAG}")
ValueError: Invalid user ID format: test. Flag: THM{V3RB0S3_3RR0R_L34K}'
```

There it is. The app crashed on bad input and instead of hiding the error it spat the whole internal traceback back at the user, including a variable that happened to hold the flag. This is exactly the "verbose error messages exposing stack traces" pattern from the theory. In a real app that traceback might leak file paths, database queries, internal variable names, all kinds of stuff an attacker can use.

**What's the flag?** `THM{V3RB0S3_3RR0R_L34K}`

---

## Task 3 — AS03: Software Supply Chain Failures {#task-3}

This one is about the stuff you didn't write. Modern apps pull in dozens or hundreds of third-party libraries, packages, APIs, and these days AI models too. If any one of those is compromised, outdated, or just sketchy, your app inherits that problem. And you might never have touched the vulnerable code yourself.

The example the room uses is the 2021 SolarWinds Orion attack. Attackers slipped malicious code into a trusted software update, and every org that auto-installed that update got compromised. It wasn't a bug in SolarWinds' own logic, it was the update pipeline itself that got poisoned. That's what makes supply chain attacks so nasty, they ride in on things you trusted.

The prevention advice is basically "trust nothing blindly." Verify third-party components before using them, patch dependencies, sign and audit your updates, lock down your CI/CD pipeline, and keep an eye on where all your components come from.

### The challenge

Navigate to `MACHINE_IP:5003`. It's a Data Processing Service. The hint says the code imports an old `lib/vulnerable_utils.py` component and asks if you can "debug" it. That word is emphasized in the room and it's a big fat clue, hold onto it.

The task gives you the source code of the app so you can see what it's doing. Here's the important chunk:

```python
from flask import Flask, render_template, request, jsonify
import sys
import os

# Import from local unverified library
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'lib'))
from vulnerable_utils import process_data, format_output, debug_info

app = Flask(__name__)

@app.route('/api/process', methods=['POST'])
def process():
    """Process user input using third-party library"""
    try:
        data = request.json.get('data', '')
        if not data:
            return jsonify({'error': 'Missing data parameter'}), 400

        # Check for debug mode
        if data == 'debug':
            return jsonify(debug_info())

        processed = process_data(data)
        formatted = format_output(processed)

        return jsonify({
            'result': formatted,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

Read the `/api/process` route carefully. It takes a `data` value out of a POST request. And there's this line sitting right in the middle:

```python
if data == 'debug':
    return jsonify(debug_info())
```

So if you send the exact string `debug` as your data, the app calls `debug_info()` from that shady unverified library and hands you whatever it returns. That's the "debug" the hint was pointing at. Not you debugging the app, you triggering the app's own hidden debug mode. Nice little wordplay.

The endpoint is a POST that wants JSON, so you send it with curl like this:

```bash
curl -X POST http://MACHINE_IP:5003/api/process \
  -H "Content-Type: application/json" \
  -d '{"data":"debug"}'
```

The app runs the debug function from the vulnerable library and dumps the flag back at you. The whole lesson here is that some third-party component nobody vetted had a debug feature wired into it, and that feature made it all the way to production. That's a supply chain failure, the danger came from a dependency, not from the app's own core code.

**What's the flag?** `THM{SUPPLY_CH41N_VULN3R4B1L1TY}`

---

## Task 4 — AS04: Cryptographic Failures {#task-4}

Crypto failures are when encryption gets used wrong or not at all. Weak algorithms, keys hardcoded right into the source, no key rotation, sensitive data sent or stored in plain text. Basically anything that means the "encryption" isn't really protecting anything.

The room lists the usual suspects. Deprecated algorithms like MD5, SHA-1, or ECB mode. Hardcoded secrets in the code. Bad key management. No encryption on data at rest or in transit. Self-signed certs. The fix is to use modern algorithms (AES-GCM, ChaCha20-Poly1305, TLS 1.3), use a proper key management service instead of hardcoding, and rotate your keys.

### The challenge

Navigate to `MACHINE_IP:5004`. It's a "Secure Document Viewer." Air quotes doing heavy lifting on the word secure. The page shows you an encrypted blob and this smug little message:

```
This confidential document is encrypted for security. Only authorized personnel can access the decryption key.
Note: The decryption feature is currently unavailable. Contact your administrator for access.

Encrypted Document:
Nzd42HZGgUIUlpILZRv0jeIXp1WtCErwR+j/w/lnKbmug31opX0BWy+pwK92rkhjwdf94mgHfLtF26X6B3pe2fhHXzIGnnvVruH7683KwvzZ6+QKybFWaedAEtknYkhe
```

"Only authorized personnel can access the decryption key." Okay. Except this is a web page, and web pages ship their JavaScript straight to your browser. So let's look at what the page loaded. First just grab the raw HTML:

```bash
curl http://MACHINE_IP:5004
```

Near the bottom of the page there's a script tag pulling in a JS file:

```html
<script src="/static/js/decrypt.js"></script>
```

A file literally called `decrypt.js`. On a page that just told me decryption wasn't available. Sure. Let's read it:

```bash
curl http://MACHINE_IP:5004/static/js/decrypt.js
```

And there it is, right at the top of the file, in plain text:

```javascript
// Configuration
const SECRET_KEY = "my-secret-key-16";
const ENCRYPTION_MODE = "ECB";
const KEY_SIZE = 128;
```

So we've got everything. The key is `my-secret-key-16` (which is exactly 16 characters, matching AES-128). The mode is ECB, which is one of the weak ones the theory warned about. And this is all sitting in a file anyone can download. This is the whole vulnerability in one shot, the secret key was hardcoded on the client side where any visitor can read it. "Authorized personnel only" my foot.

Now we just decrypt the blob ourselves. The document is base64 encoded, then AES-128-ECB encrypted with that key. Small Python script does it:

```python
from Crypto.Cipher import AES
import base64

# Hardcoded key straight from the JS file
key = b"my-secret-key-16"

# Encrypted blob from the page
enc = "Nzd42HZGgUIUlpILZRv0jeIXp1WtCErwR+j/w/lnKbmug31opX0BWy+pwK92rkhjwdf94mgHfLtF26X6B3pe2fhHXzIGnnvVruH7683KwvzZ6+QKybFWaedAEtknYkhe"

# base64 decode, then AES-128-ECB decrypt
ciphertext = base64.b64decode(enc)
cipher = AES.new(key, AES.MODE_ECB)
plaintext = cipher.decrypt(ciphertext)

# strip padding and print
plaintext = plaintext.rstrip(b"\x00").decode('utf-8', errors='ignore')
print(plaintext)
```

If you don't have pycryptodome installed, quick `pip install pycryptodome` first. Run it and the flag pops out. The decryption feature wasn't unavailable at all, they just moved the button off the page and left the key sitting in a JS file two clicks away.

**What's the flag?** `THM{CRYPTO_FAILURE_H4RDCOD3D_K3Y}`

---

## Task 5 — AS06: Insecure Design {#task-5}

Last one. Insecure design is the deepest kind of flaw because it's a mistake in how the system was thought out, not how it was coded. Skipped threat modelling, bad assumptions about how people will use the app, no security requirements from the start. You can't patch these easily because the flaw is the design itself.

The room leans hard into AI examples here (prompt injection, blindly trusting model output, poisoned models) but the core lesson is older than any of that. The example they give is Clubhouse, the audio app. Its early design assumed everyone would only ever use the official mobile app. So the backend API had no proper authentication, because hey, only our app talks to it, right? Wrong. Researchers hit the API directly and could pull user data, room info, even "private" conversations. The whole "private" promise fell apart because the design trusted the client.

### The challenge

Navigate to `MACHINE_IP:5005`. It's a chat app called SecureChat. The hint asks: "Have they assumed that only mobile devices can access it?" That's basically the Clubhouse story again, told as a challenge.

So the app front end probably does some check to make it look mobile-only. But here's the thing, that restriction is on the front end. The backend API is a separate thing, and if the devs assumed nobody would ever talk to it except through their app, they might have left it wide open. Front end restrictions are basically decorations, anyone can skip past them and hit the API directly with curl.

Let's just poke the API and see what's there. A users endpoint is always a good first guess:

```bash
curl http://MACHINE_IP:5005/api/users
```

And it answers. No auth, no mobile check, nothing. Comes back with a list of users including an `admin` account. So the backend is completely exposed, the "only mobile can access this" assumption never protected the API at all.

Now that we know admin exists, let's see if we can read their messages. Try a messages endpoint for that user:

```bash
curl http://MACHINE_IP:5005/api/messages/admin
```

And there's the admin's private messages, flag sitting right in them. No login, no token, just asking the API nicely and it hands over everything. This is the exact insecure design failure from the theory, the whole security model rested on the assumption "only our mobile app will ever call this," and that assumption was never true. The API needed its own authentication and never got it.

**What's the flag?** `THM{1NS3CUR3_D35IGN_4SSUMPT10N}`

---

## Task 6 — Conclusion {#task-6}

Good room. Four different flavors of design flaw and they all really do come from the same root, weak foundations. You can't bolt security on at the end and hope it holds.

Quick recap of what each one taught:

AS02 Security Misconfigurations. The app crashed on bad input and leaked a full traceback with the flag in it. Lesson: hide your errors, don't ship debug output to users.

AS03 Software Supply Chain Failures. A hidden debug feature buried in an unverified third-party library made it to production. Lesson: vet your dependencies, you inherit their bugs.

AS04 Cryptographic Failures. The "secret" decryption key was hardcoded in a JavaScript file anyone could download, using weak ECB mode. Lesson: never put keys on the client, never call ECB secure.

AS06 Insecure Design. The whole security model assumed only the mobile app would ever hit the API, so the backend had no auth at all. Lesson: never trust the client, the API needs its own guards.

Big thing that ties them together: treat defaults with suspicion, treat every dependency as a possible risk, and keep your design simple enough that you can actually reason about where the trust boundaries are. Get the design right early and you save yourself a mountain of preventable incidents later.

The nice part about this room is that three of the four challenges were solvable with nothing but curl and a bit of reading. No fancy tooling. Just looking at what the app was handing you and noticing it was handing you way too much. That's most of web hacking honestly, paying attention to the stuff developers assumed you'd never look at.

---