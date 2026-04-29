---
title: "Metasploit: Introduction — TryHackMe Cyber Security 101"
date: 2026-04-28
category: "writeup"
excerpt: "Walkthrough of TryHackMe's Metasploit: Introduction room — An introduction to the main components of the Metasploit Framework."
image: "/images/blog/102.png"
readtime: "20 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction to Metasploit](#task-1)
- [Task 2 — Main Components of Metasploit](#task-2)
- [Task 3 — Msfconsole](#task-3)
- [Task 4 — Working with Modules](#task-4)
- [Task 5 — Summary](#task-5)

---

## Task 1 — Introduction to Metasploit {#task-1}

So what actually is Metasploit? The short answer is it's a framework that covers basically everything you need during a pentest. Information gathering, scanning, exploitation, post-exploitation, all of it. It's been around forever and it's still the go-to tool for most people in the field.

There are two versions of it:

**Metasploit Pro** is the paid commercial one. It has a GUI and lets you automate and manage bigger engagements. If you work at a company that bought it, cool. Most people learning security don't have access to this one.

**Metasploit Framework** is the free, open-source, command-line version. This is what we're using. It comes pre-installed on the AttackBox and pretty much every pentesting Linux distro you'll ever touch.

The main pieces you'll interact with are:

- `msfconsole` — the main command-line interface where you do everything
- Modules — the actual tools inside the framework (exploits, scanners, payloads, etc.)
- Standalone tools like `msfvenom` which we'll get to in a later room

This room is about getting comfortable with msfconsole and understanding what's inside Metasploit before you start using it to actually do things. Good foundation stuff.

---

## Task 2 — Main Components of Metasploit {#task-2}

Before you can do anything useful in Metasploit you need to understand how it's organized. There are a few terms that come up constantly so let's get them out of the way first.

**Exploit** — a piece of code that takes advantage of a vulnerability. This is the thing that "breaks in."

**Vulnerability** — the flaw in the target system. A bug in the code, a bad design decision, a logic error. The exploit uses this to do something it shouldn't be able to do.

**Payload** — the code that runs on the target after the exploit works. The exploit gets you in, the payload is what you actually do once you're in. Getting a shell, running a command, whatever your goal is.

These three things work together. Exploit gets you in, payload does the work.

Now the modules. Metasploit organizes everything into categories and they're all sitting in folders you can browse if you want. Here's what each one is:

**Auxiliary** — supporting modules. Scanners, crawlers, fuzzers. Stuff that helps you gather information and poke around without necessarily exploiting anything yet.

**Encoders** — these let you encode your exploit and payload so that antivirus signatures might not catch them. The room is upfront that this has limited success because modern AV does a lot more than just signature matching, so don't get excited thinking encoders are a magic bypass. They're not really.

**Evasion** — more serious attempts at getting past antivirus. These actually try to evade detection rather than just encoding things. All the ones that come with Metasploit are Windows-focused.

**Exploits** — the actual exploits, organized by target OS. Android, Windows, Linux, iOS, you name it. There's a lot here.

**NOPs** — No Operation instructions. They literally do nothing. In the Intel x86 world a NOP is `0x90` and it just tells the CPU to sit there for a cycle and do nothing. They get used as padding to make payloads a consistent size. You probably won't mess with these much as a beginner.

**Payloads** — this one has a bit more to it. There are four subfolders:

- **Adapters** — wrap single payloads and convert them into different formats, like turning a payload into a PowerShell command
- **Singles** — self-contained payloads that do one thing and don't need to download anything else. Add a user, open Notepad, whatever
- **Stagers** — set up the connection between Metasploit and the target. Used with staged payloads where you send a small initial piece first, then download the rest
- **Stages** — the second part that the stager downloads. This lets you use bigger payloads than you could send all at once

There's also a handy way Metasploit tells you whether a payload is inline (single) or staged just from the name. Look at these two:

- `generic/shell_reverse_tcp` — the underscore between "shell" and "reverse" means it's a single, inline payload
- `windows/x64/shell/reverse_tcp` — the slash between "shell" and "reverse" means it's staged

Underscore = inline. Slash = staged. Once you know this it's actually a really clean naming system.

**Post** — post-exploitation modules. Stuff you run after you already have access to the target. Gathering info, moving around the network, escalating privileges.

**Question: What is the name of the code taking advantage of a flaw on the target system?** `Exploit`

**Question: What is the name of the code that runs on the target system to achieve the attacker's goal?** `Payload`

**Question: What are self-contained payloads called?** `Singles`

**Question: Is "windows/x64/pingback_reverse_tcp" among singles or staged payload?** `Singles`

---

## Task 3 — Msfconsole {#task-3}

You launch it with just `msfconsole` in the terminal and you get the Metasploit banner and a prompt that looks like `msf6 >`.

One thing that's actually nice about msfconsole is that it behaves like a regular Linux terminal for the most part. You can run `ls`, `ping`, `cd`, all that stuff. It runs your system commands and just prefixes the output with `[*] exec:` so you know it handed off to the system.

What it doesn't support is output redirection. So if you try something like `help > help.txt` expecting it to dump the help menu into a file, it just throws an error. A little annoying but not a big deal.

Some other useful basic commands:

`history` — shows you commands you've typed before in the session. Handy when you ran something and forgot exactly what you typed.

Tab completion works too. Start typing a command and hit tab, it'll fill it in. This becomes really useful when you're navigating module paths because those can get long.

**Context** is one of the most important concepts to get your head around early. When you select a module using the `use` command, you enter that module's context. The prompt changes to show you what you're working in, like `msf6 exploit(windows/smb/ms17_010_eternalblue) >`. Any parameters you set while in this context belong to this module only. If you switch to a different module with `use`, those settings are gone.

This trips people up a lot. You spend time setting RHOSTS and LHOST and then switch to a different module and wonder why nothing is set. The answer is: context. Each module is its own isolated thing.

To leave a module context and go back to the main prompt you use `back`.

The `info` command inside a module context gives you everything about that module. Who wrote it, what CVEs it covers, what the options mean, links to references. It's not a help menu, it's actual detailed documentation. Worth reading before you run anything especially if you're new to a particular exploit. Some of them have warnings like "may cause system instability and crashes" which you probably want to know about before you fire it.

The `search` command is how you find modules. You can search by CVE number, by keyword, by exploit name. Running `search ms17-010` for example pulls up everything in Metasploit related to that vulnerability. The results show you the module name, type, rank, and a short description.

The rank column is worth paying attention to. Exploits get rated from manual all the way up to excellent based on how reliable they are. The room makes a good point here though: a lower-ranked exploit might work perfectly on your specific target, and a highly-ranked one might crash the machine. The ranking is a general guide, not a guarantee.

You can also filter your searches with keywords. `search type:auxiliary telnet` will only show you auxiliary modules that match "telnet." `search platform:windows type:exploit smb` and so on. Once you have a big list of results, being able to filter it saves a lot of time.

**Question: How would you search for a module related to Apache?** `search apache`

**Question: Who provided the auxiliary/scanner/ssh/ssh_login module?** `todb`

---

## Task 4 — Working with Modules {#task-4}

This task is where things get practical. You pick a module, you set its parameters, you run it.

First, the room goes through the five different prompts you'll see in Metasploit because mixing them up is a real easy way to confuse yourself:

`root@ip-10-10-XX-XX:~#` — regular Linux shell, Metasploit isn't even open

`msf6 >` — Metasploit is open but no module selected, this is the base prompt

`msf6 exploit(windows/smb/ms17_010_eternalblue) >` — you're inside a module context

`meterpreter >` — you have a Meterpreter session open on a target

`C:\Windows\system32>` — you have a straight command shell on the target system


Each one lets you do different things. Running a context-specific command like `set RHOSTS` from the base `msf6 >` prompt does nothing useful. You have to be inside a module context first.

**Setting parameters** is all done with `set PARAMETER_NAME VALUE`. The parameters you'll use most are:

- `RHOSTS` — the target's IP address. Can be a single IP, a range, or even a file with a list of targets
- `RPORT` — the port on the target you're connecting to
- `PAYLOAD` — which payload to use with the exploit
- `LHOST` — your own machine's IP (the one you want the reverse connection to come back to)
- `LPORT` — the port on your machine to listen on for that reverse connection
- `SESSION` — for post-exploitation modules, which existing session to use

A thing to watch out for: some parameters have defaults. RPORT might be pre-set to 80 for a web exploit, but if the target is running on port 8080 you need to change it. Always check with `show options` before you run anything. Don't assume the defaults are right for your specific situation.

You can use `unset PARAMETER_NAME` to clear a single parameter, or `unset all` to wipe everything and start fresh.

**setg and unsetg** are the global versions. If you use `setg RHOSTS 10.10.10.10`, that value will carry over to every module you switch to for the rest of your session. You don't have to re-type it every time. Really useful when you're doing multiple things against the same target. `unsetg` clears global values.

To actually run a module you use either `exploit` or `run`. They're identical, `run` was added because typing "exploit" when you're running a scanner feels weird. The `-z` flag runs the exploit and immediately backgrounds the session when it opens, dropping you back to the module prompt. Useful when you want to open a bunch of sessions without interacting with each one right away.

**Sessions** are the connections Metasploit maintains to target systems. Each time you successfully exploit something and get a shell or Meterpreter, that gets a session ID. You can see all open sessions with `sessions` from any prompt. To jump into a specific one use `sessions -i` followed by the session number. To send a session to the background from inside it, use `background` or just hit `CTRL+Z`.

The `check` command is worth knowing too. Some modules support it, and it will test whether the target is vulnerable without actually running the exploit. Good for reconnaissance without risk of crashing things.

**Question: How would you set the LPORT value to 6666?** `set LPORT 6666`

**Question: How would you set the global value for RHOSTS to 10.10.19.23?** `setg RHOSTS 10.10.19.23`

**Question: What command would you use to clear a set payload?** `unset PAYLOAD`

**Question: What command do you use to proceed with the exploitation phase?** `exploit`

---

## Task 5 — Summary {#task-5}

That's the introduction done. Metasploit has a lot going on but the core workflow is always the same: find your module, set your parameters, run it. Everything else is just learning what each module does and which parameters it needs.

The room wraps up by pointing forward to more detailed Metasploit rooms that cover Meterpreter and post-exploitation properly. This was the foundation. Understanding the difference between singles and staged payloads, knowing how context works, and getting comfortable with `search` and `show options` will make the harder rooms a lot less confusing.

On to the next one.

---