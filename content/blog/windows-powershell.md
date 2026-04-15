---
title: "Windows PowerShell — TryHackMe Cyber Security 101"
date: 2026-04-14
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Windows PowerShell room — Discover the 'Power' in PowerShell and learn the basics."
image: "/images/blog/76.png"
readtime: "25 min read"
draft: false
---

# Windows PowerShell

If you did the Windows Command Line room before this one, welcome back. If you jumped straight here, no worries, you will be fine. This room is about PowerShell, which is basically the older `cmd.exe`'s way more powerful sibling. Same idea, completely different league.

Connect via SSH. Launch Remmina on the AttackBox, pick SSH from the dropdown, paste the machine IP, and log in with:

Username: `captain`
Password: `JollyR0ger#`

Once you are in, type `powershell` and hit Enter to launch it. You will see the prompt change to `PS` and you are good to go.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — What Is PowerShell](#task-2)
- [Task 3 — PowerShell Basics](#task-3)
- [Task 4 — Navigating the File System and Working with Files](#task-4)
- [Task 5 — Piping, Filtering, and Sorting Data](#task-5)
- [Task 6 — System and Network Information](#task-6)
- [Task 7 — Real-Time System Analysis](#task-7)
- [Task 8 — Scripting](#task-8)
- [Task 9 — Conclusion](#task-9)

---

## Task 1 — Introduction {#task-1}

The point is simple: PowerShell is powerful, you should learn it, and that is what this room is for. It covers what PowerShell actually is, the basic structure of how its commands work, some essential commands, and how it fits into cyber security work on both the defensive and offensive sides.

---

## Task 2 — What Is PowerShell {#task-2}

PowerShell is Microsoft's answer to the question "what if `cmd.exe` was actually good." The official definition calls it a cross-platform task automation solution made up of a command-line shell, a scripting language, and a configuration management framework. That is a lot of words. The short version: it is a shell and scripting tool built on .NET that works on Windows, macOS, and Linux.

The history bit is actually interesting. Back in the early 2000s, Windows was being used more and more in complex enterprise environments and `cmd.exe` with its batch scripts was not enough. A Microsoft engineer named Jeffrey Snover noticed that Windows and Unix handled system operations very differently. Unix treats everything as text files. Windows uses structured data and APIs. So instead of porting Unix tools over, he built something new that worked with objects instead of plain text. PowerShell launched in 2006. Then in 2016 they released PowerShell Core, the open-source cross-platform version.

The big thing to understand here is that PowerShell is object-oriented. When you run a command in `cmd.exe` you get back a wall of text that you then have to parse yourself. When you run a cmdlet in PowerShell you get back an object with actual properties and methods attached to it. That makes everything way more flexible and useful.

**Question: What do we call the advanced approach used to develop PowerShell?** `Object-Oriented`

---

## Task 3 — PowerShell Basics {#task-3}

Before getting into anything else, a few things to know about how PowerShell commands are structured.

PowerShell commands are called cmdlets, pronounced "command-lets." They follow a `Verb-Noun` format which makes them pretty readable once you get used to it. `Get-Content` gets the content of a file. `Set-Location` sets your location. You can usually guess what a cmdlet does just from its name which is nice.

`Get-Command` lists every cmdlet, function, alias, and script available in the current session. The output is massive so you can filter it. For example if you only want functions:

```powershell
Get-Command -CommandType "Function"
```

`Get-Help` is your friend when you have no idea what a cmdlet does or what parameters it takes. Give it any cmdlet name and it will show you the syntax, description, and related links. Add `-Examples` at the end to see actual usage examples, which is usually way more useful than reading the description.

```powershell
Get-Help Get-Date -Examples
```

PowerShell also has aliases for a lot of familiar commands so the transition from `cmd.exe` is not that painful. `dir` works. `cd` works. `cat` works. They are just shortcuts pointing to the actual PowerShell cmdlets. `Get-Alias` lists all of them.

**Question: How would you retrieve a list of commands that start with the verb `Remove`?** `Get-Command -Name Remove*`

**Question: What cmdlet has its traditional counterpart `echo` as an alias?** `Write-Output`

**Question: What is the command to retrieve some example usage for the cmdlet `New-LocalUser`?** `Get-Help New-LocalUser -Examples`

---

## Task 4 — Navigating the File System and Working with Files {#task-4}

This is the part where things start feeling familiar if you have used any command line before, just with different names for everything.

`Get-ChildItem` is your `dir` or `ls`. It lists files and folders in the current directory or whatever path you give it with `-Path`. `Set-Location` moves you around, same as `cd`.

Where PowerShell gets cleaner than `cmd.exe` is that you use one cmdlet for creating both files and folders. `New-Item` does both, you just tell it what type you want:

```powershell
New-Item -Path ".\myfolder" -ItemType "Directory"
New-Item -Path ".\myfolder\myfile.txt" -ItemType "File"
```

Same story for deleting. `Remove-Item` handles both files and directories, no need for separate `del` and `rmdir` commands.

Copying and moving work as expected. `Copy-Item` copies, `Move-Item` moves. To read a file, use `Get-Content` which is the equivalent of `type` in `cmd.exe` or `cat` on Linux.

```powershell
Get-Content -Path ".\somefile.txt"
```

**Question: What cmdlet can you use instead of the traditional Windows command `type`?** `Get-Content`

**Question: What PowerShell command would you use to display the content of the "C:\Users" directory?** `Get-ChildItem -Path C:\Users`

**Question: How many items are displayed by the command described in the previous question?** `4`

---

## Task 5 — Piping, Filtering, and Sorting Data {#task-5}

This is where PowerShell really starts to show off. Piping works the same as in `cmd.exe`, you chain commands together with `|` and the output of one becomes the input of the next. The difference is that in PowerShell you are passing actual objects through the pipe, not just text. That means the receiving cmdlet can work with the properties of those objects directly.

`Sort-Object` sorts whatever comes through the pipe by a property you specify. Want to sort files by size?

```powershell
Get-ChildItem | Sort-Object Length
```

`Where-Object` filters the results down to only the objects that match a condition. Want only `.txt` files?

```powershell
Get-ChildItem | Where-Object -Property "Extension" -eq ".txt"
```

The comparison operators you will use most are `-eq` (equal), `-ne` (not equal), `-gt` (greater than), `-ge` (greater than or equal), `-lt` (less than), `-le` (less than or equal), and `-like` for pattern matching with wildcards.

`Select-Object` lets you pick specific properties to display or limit how many results you get back. Useful when the default output is giving you way more columns than you care about.

`Select-String` searches inside files for a pattern, like `grep` on Linux or `findstr` on Windows. It supports regex too which makes it pretty powerful for digging through logs.

```powershell
Select-String -Path ".\somefile.txt" -Pattern "keyword"
```

You can chain all of these together. The room gives a fun example of finding the largest file in a directory:

```powershell
Get-ChildItem | Sort-Object Length -Descending | Select-Object -First 1
```

**Question: How would you retrieve the items in the current directory with size greater than 100?** `Get-ChildItem | Where-Object -Property Length -gt 100`

---

## Task 6 — System and Network Information {#task-6}

This task is about pulling system and network info, which is basically what you do every time you land on a new machine and need to figure out what you are looking at.

`Get-ComputerInfo` gives you everything about the system in one shot. OS version, hardware specs, BIOS info, all of it. Way more detailed than `systeminfo` from `cmd.exe`.

`Get-LocalUser` lists all local user accounts on the machine with their name, whether they are enabled, and a description. This is where the fun starts for this task.

For network info, `Get-NetIPConfiguration` gives you the same kind of output as `ipconfig /all`, covering IP addresses, DNS servers, and gateway info. `Get-NetIPAddress` goes even further and shows every IP address configured on the system including ones that are not currently active.

Now for the practical part. Running `Get-LocalUser` on the machine reveals a suspicious account hiding in the list:

```powershell
Get-LocalUser
```

Sure enough, tucked in there between the normal accounts is `p1r4t3`. Enabled. Shady. The description reads: `A merry life and a short one.` Bold of him to put his whole motto right there in the account description.

Next, navigate to his home folder to find what he left behind:

```powershell
Set-Location -Path "C:\Users\p1r4t3"
Get-ChildItem
```

Poke around in there and you will find the hidden treasure file. `Get-Content` it to read what is inside.

**Question: Other than your current user and the default "Administrator" account, what other user is enabled on the target machine?** `p1r4t3`

**Question: What is the motto he has so bluntly put as his account's description?** `A merry life and a short one.`

**Question: Can you navigate the filesystem and find the hidden treasure inside this pirate's home?** `THM{p34rlInAsh3ll}`

---

## Task 7 — Real-Time System Analysis {#task-7}

This task is about monitoring what is actually happening on the system right now, which is super useful for incident response or just figuring out what is running.

`Get-Process` shows all running processes with CPU usage, memory, and PIDs. Think of it as Task Manager from the command line.

`Get-Service` lists all services and their current status. Running, stopped, or paused. This one is really useful for spotting anything that should not be there, or anything that has been messed with.

`Get-NetTCPConnection` shows active TCP connections. Local address, remote address, ports, state, and which process owns the connection. Very handy for spotting something phoning home that should not be.

`Get-FileHash` generates a hash of a file. By default it uses SHA256. This is useful for verifying file integrity or checking a file against known malware hashes.

```powershell
Get-FileHash -Path .\somefile.txt
```

The room also covers Alternate Data Streams (ADS) which are hidden streams that can be attached to files on NTFS. You can view them with:

```powershell
Get-Item -Path ".\somefile.txt" -Stream *
```

Now for the practical parts. First, get the hash of the treasure file you found in the previous task:

```powershell
Get-FileHash -Path ".\big-treasure.txt"
```

The hash comes back as `71FC5EC11C2497A32F8F08E61399687D90ABE6E204D2964DF589543A613F3E08`.

For the tampered service, the hint is that `p1r4t3` changed a service's DisplayName to match his motto. So filter `Get-Service` output looking for that motto in the DisplayName:

```powershell
Get-Service | Where-Object -Property DisplayName -like "A merry*"
```

That returns the service with the messed up DisplayName. The actual service name is `p1r4t3-s-compass`. Someone had fun with that.

**Question: What is the hash of the file that contains the treasure?** `71FC5EC11C2497A32F8F08E61399687D90ABE6E204D2964DF589543A613F3E08`

**Question: What property retrieved by default by `Get-NetTCPConnection` contains information about the process that has started the connection?** `OwningProcess`

**Question: Can you find the service name?** `p1r4t3-s-compass`

---

## Task 8 — Scripting {#task-8}

The room does not actually teach you to write PowerShell scripts here, it just makes the case for why scripting matters and introduces one important cmdlet.

The short version is that PowerShell scripts are text files full of cmdlets that run automatically in sequence. Instead of typing the same ten commands every time you land on a machine, you write them once, save the script, and run it whenever you need it. Fewer mistakes, way less time wasted.

For blue teamers, scripts are useful for automating log analysis, hunting for indicators of compromise, or scanning systems for signs of intrusion. For red teamers, PowerShell is basically essential. Deep integration with Windows systems, ability to run commands in memory without touching disk, easy to obfuscate. It shows up constantly in real attacks for exactly these reasons. For sysadmins, scripting handles the repetitive stuff like enforcing security policies and monitoring system health across a fleet of machines.

The cmdlet the room highlights here is `Invoke-Command`. This lets you run commands on remote machines. You can point it at a remote computer and pass it either a script file or a block of commands to run directly:

```powershell
Invoke-Command -ComputerName Server01 -Credential Domain01\User01 -ScriptBlock { Get-Culture }
```

The `-ScriptBlock {}` part is what actually gets executed on the remote machine. You can put any command or sequence of commands in there and it runs as if you typed it locally on that remote system. Useful for legitimate remote management. Also very useful for attackers, which is why it is worth knowing about from both sides.

**Question: What is the syntax to execute the command `Get-Service` on a remote computer named "RoyalFortune"?** `Invoke-Command -ComputerName RoyalFortune -ScriptBlock { Get-Service }`

---

## Task 9 — Conclusion {#task-9}

Room done. The pirate theme wraps up here too, the room sends you off with fair winds and whatever. Honestly not a bad room. The progression from basic cmdlets to piping to system analysis to scripting makes sense and the practical challenges in tasks 6 and 7 are actually fun once you figure out what you are looking for.

A few things worth remembering after this room:

`Get-Help` is always your first stop when you are confused about a cmdlet. Add `-Examples` to get straight to the useful stuff.

Piping is where PowerShell gets powerful. The more comfortable you get chaining cmdlets together, the faster you can work.

`Get-Service` and `Get-NetTCPConnection` are going to come up constantly in any kind of security work. Get comfortable with filtering their output.

---