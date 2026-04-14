---
title: "Windows Command Line — TryHackMe Cyber Security 101"
date: 2026-04-13
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Windows Command Line room — Learn the essential Windows commands."
image: "/images/blog/74.png"
readtime: "15 min read"
draft: false
---

# Windows Command Line

This room is all about `cmd.exe`, the Windows command line interpreter. If you have ever avoided it in favour of clicking through menus, this room will change that. It covers the basics of system info, network troubleshooting, file management, and process management, all from the command line.

Connect via SSH from the AttackBox:

```
ssh user@MACHINE_IP
```

Username: `user`
Password: `Tryhackme123!`

First time connecting it will ask you to trust the connection. Type `yes` and enter the password. Note that the password will not show as you type it, that is normal.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Basic System Information](#task-2)
- [Task 3 — Network Troubleshooting](#task-3)
- [Task 4 — File and Disk Management](#task-4)
- [Task 5 — Task and Process Management](#task-5)
- [Task 6 — Conclusion](#task-6)

---

## Task 1 — Introduction {#task-1}

The room opens by making the case for CLI over GUI. Yes, GUIs are intuitive and easy to poke around in. But CLIs are faster, use fewer resources, are way easier to automate with scripts, and are essential for remote management over SSH, especially on servers with limited resources or slow connections.

The goal of this room is to get comfortable with `cmd.exe` for system info, network troubleshooting, file management, and process management.

**Question: What is the default command line interpreter in the Windows environment?** `cmd.exe`

---

## Task 2 — Basic System Information {#task-2}

A few quick commands to pull system info from the command line.

`ver` gives you the OS version. Fast and simple.

`systeminfo` is the more detailed one. It dumps the hostname, OS name and version, processor info, memory, installed hotfixes, and more all in one go. The output is long so if you want to scroll through it page by page, pipe it through `more`:

```
systeminfo | more
```

Press spacebar to move a page forward. `CTRL + C` to exit. Same trick works with `driverquery` or anything else with a long output.

Two other useful ones to know: `help` gives you info on a specific command, and `cls` clears the screen.

**Question: What is the OS version of the Windows VM?** `10.0.20348.2655`

**Question: What is the hostname of the Windows VM?** `WINSRV2022-CORE`

---

## Task 3 — Network Troubleshooting {#task-3}

This is where `cmd.exe` really earns its place. Several solid networking commands here.

`ipconfig` gives you the basics: IP address, subnet mask, default gateway. Add `/all` to get more detail including your MAC address, DNS servers, DHCP status, and lease info.

```
ipconfig /all
```

`ping` checks connectivity to a target. It sends ICMP packets and waits for replies. If you get replies back you can reach the target. You also get round trip time stats which is handy.

```
ping example.com
```

`tracert` traces the full network route to a destination hop by hop. Each router along the path is listed with its response time. The `* * *` lines mean that particular router is not responding, which happens a lot and does not necessarily mean something is broken.

```
tracert example.com
```

`nslookup` does DNS lookups. Give it a domain and it returns the IP. You can also specify a custom DNS server to use:

```
nslookup example.com 1.1.1.1
```

`netstat` shows current connections and listening ports. Running it plain shows established connections. The more useful version is `netstat -abon` which gives you all ports, the executable behind each one, and the PID.

```
C:\>netstat -abon

  TCP    0.0.0.0:22    0.0.0.0:0    LISTENING    2116
 [sshd.exe]
  TCP    0.0.0.0:135   0.0.0.0:0    LISTENING    820
  RpcSs
 [svchost.exe]
```

**Question: Which command can we use to look up the server's physical address (MAC address)?** `ipconfig /all`

**Question: What is the name of the service listening on port 135?** `RpcSs`

**Question: What is the name of the service listening on port 3389?** `TermService`

---

## Task 4 — File and Disk Management {#task-4}

Navigating and managing files from `cmd.exe`.

`cd` with no arguments shows your current location. `dir` lists everything in the current directory. Useful flags:

`dir /a` shows hidden and system files too

`dir /s` lists files in the current directory and all subdirectories

`tree` gives you a visual representation of the folder structure from where you are.

Moving around: `cd folder_name` to go into a folder, `cd ..` to go up one level.

Creating and removing directories:

```
mkdir backup_files
rmdir backup_files
```

Reading files: `type filename.txt` dumps the contents to the terminal. For longer files use `more filename.txt` to page through it.

Copying, moving, and deleting files:

```
copy test.txt test2.txt
move test2.txt C:\somewhere\
del test2.txt
```

`erase` works the same as `del`. Wildcards work too, so `copy *.txt C:\Backup` copies every `.txt` file in one go.

For the practical, navigate to `C:\Treasure\Hunt` and read the file there:

```
cd C:\Treasure\Hunt
type flag.txt
```

**Question: What are the file's contents in C:\Treasure\Hunt?** `THM{CLI_POWER}`

---

## Task 5 — Task and Process Management {#task-5}

`tasklist` shows all running processes with their PID, session, and memory usage. The output is massive so filtering helps. Use `/FI` to filter by image name:

```
tasklist /FI "imagename eq sshd.exe"
```

That will only return processes matching that name. To kill a process by PID:

```
taskkill /PID 1234
```

**Question: What command would you use to find the running processes related to notepad.exe?** `tasklist /FI "imagename eq notepad.exe"`

**Question: What command can you use to kill the process with PID 1516?** `taskkill /PID 1516`

---

## Task 6 — Conclusion {#task-6}

Room done. A few extra commands the room mentions but did not cover in detail:

`chkdsk` checks the file system and disk volumes for errors and bad sectors

`driverquery` lists all installed device drivers

`sfc /scannow` scans and repairs corrupted system files

Worth remembering: almost every command supports `/?` to display its help page. And `more` works two ways, reading files directly with `more file.txt`, or piping long output with `some_command | more`.

**Question: What is the command you can use to restart a system?** `shutdown /r`

**Question: What command can you use to abort a scheduled system shutdown?** `shutdown /a`

---