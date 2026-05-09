---
title: "Hydra — TryHackMe Cyber Security 101"
date: 2026-05-09
category: "writeup"
excerpt: "Walkthrough of TryHackMe's Hydra room — Learn about and use Hydra, a fast network logon cracker, to bruteforce and obtain a website's credentials."
image: "/images/blog/116.png"
readtime: "16 min read"
draft: false
---

## Tasks

- [Task 1 — Hydra Introduction](#task-1)
- [Task 2 — Using Hydra](#task-2)

---

## Task 1 — Hydra Introduction {#task-1}

Hydra. Finally. This is one of those tools that has a name big enough that you've probably heard about it before you ever touched it, and honestly it earns the reputation. I love this thing. It's not fancy, it's not pretty, it just hammers logins until something works.

So what is it. Hydra is an online password cracker. The "online" part matters. It's not cracking hashes you already have sitting on your disk (that's offline cracking, hashcat / john territory). Hydra goes after live services, the actual login page or SSH port or FTP server, and tries username and password combos one after another until one gets in. That's it. That's the whole pitch.

The reason this is useful is that humans are lazy with passwords. If a service has a default login like `admin:admin` or `admin:password` and nobody changed it, Hydra finds that in about half a second. If someone picked `summer2023` or their dog's name, Hydra finds that too, just slower. The whole strategy depends on the password being something a wordlist would contain.

The list of protocols Hydra supports is honestly ridiculous. Off the top of my head from the docs: SSH, FTP, HTTP forms (GET and POST), HTTPS forms, SMB, SMTP, POP3, IMAP, RDP, VNC, MySQL, MS-SQL, PostgreSQL, Telnet, LDAP, IRC, SNMP, Cisco stuff, Oracle, Subversion, TeamSpeak, XMPP, and a whole lot more. Basically if a service has a username and password somewhere, Hydra probably has a module for it. The full list is on the official GitHub repo if you want to scroll through it.

This whole room is also a giant advertisement for picking a real password. If your password is on a list of the top hundred million leaked passwords (and there's a lot of them, RockYou is the famous one), Hydra is going to find it fast. CCTV cameras, routers, random web admin panels, half the time those things still have the factory default and nobody touched it after install. That's the kind of thing Hydra eats for breakfast.

---

## Task 2 — Using Hydra {#task-2}

Setup first. Hydra is preinstalled on the AttackBox so if that's what you're using you don't have to do anything. If you're on Kali same deal, it's already there. If you're on Ubuntu or Fedora or whatever else it's `apt install hydra` or `dnf install hydra` and you're done.

Start the AttackBox, start the target machine, give the target the full three minutes to boot because TryHackMe machines never come up as fast as the timer says they do.

### How the command actually looks

The structure of a Hydra command shifts a little depending on what you're attacking. The thing that doesn't change is the username flag (`-l` for one user, `-L` for a list of users) and the password flag (`-p` for one password, `-P` for a wordlist). Capital letter means file, lowercase means single value. Easy to remember once you trip on it once.

For FTP for example, if you knew the username was `john` and you had a wordlist called `passlist.txt`:

```bash
hydra -l john -P passlist.txt ftp://MACHINE_IP
```

That's it. Hydra figures out the rest because FTP is a simple protocol, no weirdness about where the login form is or what counts as a failure, the server just tells it.

### SSH

Same idea for SSH:

```bash
hydra -l <username> -P <full path to passwordlist> MACHINE_IP -t 4 ssh
```

The new thing here is `-t 4` which sets the number of threads. Threads are basically how many login attempts run in parallel. More threads, faster results, BUT a lot of services will lock you out or rate limit you if you go too hard. SSH especially is touchy about this. The default is 16 threads, the room drops it to 4 to be polite. For real work you'll often go even lower if the service is fragile. Or higher if I don't care about being noisy.

So if you wanted to try the password list `passwords.txt` against the user `root`:

```bash
hydra -l root -P passwords.txt MACHINE_IP -t 4 ssh
```

Hydra cycles through every password in the file as `root`, four at a time, until one works or the file runs out.

### POST web form

This is where it gets less obvious and where most people I've watched do it for the first time get tripped up. Web forms aren't a protocol the way SSH is. There's no standard "this is what a failed login looks like" the way SSH says "permission denied". Every site does it differently. So you have to tell Hydra a few extra things.

The command shape:

```bash
hydra -l <username> -P <wordlist> MACHINE_IP http-post-form "<path>:<login_credentials>:<invalid_response>"
```

Three things shoved together with colons:

The **path** is just the URL where the form submits to. Could be `/login.php`, could be `/`, could be `/admin/login`. Whatever the form's `action` attribute points to.

The **login credentials** is the actual data the form posts when you submit it. This is where the `^USER^` and `^PASS^` placeholders go. So if the form sends `username=bob&password=hunter2`, you'd write `username=^USER^&password=^PASS^`. Hydra swaps the placeholders for whatever it's currently trying.

The **invalid response** is the part that takes a minute to wrap your head around. You need to give Hydra a string that shows up in the response when the login fails. Like the word "incorrect" or "wrong password" or whatever the site spits out. Hydra checks every response for that string. If the string is there, login failed, move on. If the string is NOT there, login succeeded, stop and report. You write `F=` for failure string. There's also `S=` if you want to flip it and define a success string instead, useful when the failure message is too generic to match cleanly.

A more complete example:

```bash
hydra -l <username> -P <wordlist> MACHINE_IP http-post-form "/:username=^USER^&password=^PASS^:F=incorrect" -V
```

The `-V` is verbose mode. Shows every attempt as it happens. I always turn this on when I'm running web form attacks because if the failure string is wrong, the verbose output tells you fast that EVERY attempt is "succeeding" (because the failure string never matched), and you know to stop and fix your command instead of waiting for the wordlist to finish.

If the web server is on a weird port, add `-s <port>`:

```bash
hydra -l <username> -P <wordlist> MACHINE_IP http-post-form "/:username=^USER^&password=^PASS^:F=incorrect" -s 8080 -V
```

### How to actually find the failure string

This is the part the room kind of glosses over. When you go to do this on the target machine, you'll need to:

1. Open the login page in your browser.
2. Type in a wrong username and password on purpose.
3. Submit it.
4. Look at the page that comes back. What does it say? Maybe "Your username or password is incorrect" or "Login failed" or just "incorrect". Pick a word that's clearly only on the failure page, not on success.
5. Open the browser's dev tools (F12), go to the Network tab, redo the login attempt with bad creds, click the request that got sent, and look at the form data section. That tells you the exact field names. They might be `username` and `password`, or they might be `user` and `pass`, or `email` and `pwd`. Don't assume, check.
6. Also check whether it's POST or GET in the same network tab. Most logins are POST but not all.

Once you have the failure string AND the field names AND the path the form posts to, you have enough to build the Hydra command.

### Wordlists

Hydra needs a wordlist. The room expects you to have one but doesn't really tell you which. On the AttackBox and Kali, the standard one to reach for is `rockyou.txt`. It lives at `/usr/share/wordlists/rockyou.txt` on Kali. On the AttackBox same path usually. Sometimes it's gzipped (`rockyou.txt.gz`) and you have to extract it first with `gunzip /usr/share/wordlists/rockyou.txt.gz`.

There are smaller more focused lists in `/usr/share/wordlists/` and `/usr/share/seclists/` (if SecLists is installed). For a CTF room with a known small set of passwords, a small targeted list is way faster than rockyou. Rockyou has 14 million entries, you don't always need that.

### Putting it together for the questions

The room has two questions, both about a user named `molly`. One is a web form on the target's HTTP service, one is SSH. Same user, two different attacks.

For the web one: hit `http://MACHINE_IP` in the browser, find the login form, work out the field names and the failure string the way I described above, then build something like:

```bash
hydra -l molly -P /usr/share/wordlists/rockyou.txt MACHINE_IP http-post-form "/login.php:username=^USER^&password=^PASS^:F=incorrect" -V
```

(Adjust the path, field names and failure string to whatever the form actually has.) When Hydra hits the right password it stops and shows it. Log into the form with that and grab the flag.

For SSH:

```bash
hydra -l molly -P /usr/share/wordlists/rockyou.txt MACHINE_IP -t 4 ssh
```

Wait. SSH is slower because most servers throttle login attempts and Hydra is being polite with `-t 4`. Could take a few minutes. When it finds the password, ssh in normally:

```bash
ssh molly@MACHINE_IP
```

Type the password, you're in, look around the home directory for the second flag.

**Use Hydra to brute-force molly's web password. What is the value of flag 1?** `THM{2673a7dd116de68e85c48ec0b1f2612e}`

**Use Hydra to brute-force molly's SSH password. What is the value of flag 2?** `THM{c8eeb0468febbadea859baeb33b2541b}`

---

## Wrap up

Short room but Hydra is a tool I keep coming back to. It's blunt, it's loud, it's about as subtle as a sledgehammer, and on real engagements you usually want something quieter. But for CTFs, for default credential checks, for that one dusty admin panel nobody's looked at in five years, Hydra still slaps.

Two tips from getting burned doing this in real boxes. One, always start with a small targeted wordlist before you reach for rockyou. If the password is `admin` you don't need to wait through 14 million guesses to find out. Two, when web forms aren't working, the failure string is wrong 95% of the time. Use `-V`, look at what's actually happening, fix the string. Don't assume Hydra is broken, it's almost always your command.

---