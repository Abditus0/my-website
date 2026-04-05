---
title: "Linux CLI Basics — TryHackMe Pre Security Path"
date: 2026-03-24
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Linux CLI Basics room - Get comfortable navigating through the Linux CLI."
image: "/images/blog/37.png"
readtime: "25 min read"
draft: false
---

# Linux CLI Basics

If Windows was the friendly room with a GUI and buttons you could click, this one is different. No icons, no mouse, just a black screen with a blinking cursor waiting for you to type something. Welcome to Linux. If you are planning to get into cyber security, you are going to be spending a LOT of time here, so might as well get comfortable.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Navigation Mission: "Find the Missing Notes"](#task-2)
- [Task 3 — Investigating the System](#task-3)
- [Task 4 — Conclusion](#task-4)

---

## Task 1 — Introduction {#task-1}

The storyline for this room is actually fun. You just started as an IT Support Engineer on a Cyber Operations Support Team. Sounds cool right? Except your supervisor ran out the door the second you walked in to deal with some urgent incident, left you a sticky note, and now you are completely alone staring at a terminal with zero idea what to do.

The whole room is built around that setup. You are basically learning the Linux CLI by figuring out what your supervisor left for you. Each task has a little mission attached to it and that is what drives everything forward.

The learning objectives are pretty simple. By the end you should know what the terminal is, why it's important, and how to move around a Linux system using basic commands. Nothing crazy, just the foundations.

**Question: What does "CLI" stand for?** `Command-Line Interface`

---

## Task 2 — Navigation Mission: "Find the Missing Notes" {#task-2}

**A quick word about the terminal**

Before anything else the room asks you to actually start the machine and open a terminal. You double click the Terminal file on the desktop and boom, there it is. That blinking cursor just sitting there judging you.

The terminal is a text based way to control a Linux system. Instead of clicking around a graphical interface you type commands and the system does what you say. Cyber security people love it because it is faster, gives you way more control, and a ton of security tools flat out only work in the terminal. No GUI option, terminal or nothing.

If it feels weird at first, that is fine. It felt weird for everyone at first.

**Step 1: Where even am I**

First thing you learn is `pwd`. It stands for "print working directory" which is just a fancy way of saying "tell me what folder I am currently in". You run it and it spits back something like:
```shell-session
ubuntu@tryhackme:~$ pwd
/home/ubuntu
```

OK so you are in `/home/ubuntu`. Good to know.

**Step 2: What is actually here**

Now you want to see what files and folders are around you. That is `ls`. Run it and you get a list of everything in your current directory.
```shell-session
ubuntu@tryhackme:~$ ls
Desktop    Downloads  Pictures  Templates  logs
Documents  Music      Public    Videos     projects
```

If you want more detail, like file sizes, permissions, dates, you add `-l` to it:
```shell-session
ubuntu@tryhackme:~$ ls -l
total 44
drwxr-xr-x 2 ubuntu ubuntu 4096 Feb 27  2022 Desktop
drwxr-xr-x 6 ubuntu ubuntu 4096 Dec 11 12:45 Documents
drwxr-xr-x 2 ubuntu ubuntu 4096 Feb 16  2024 Downloads
...
```

There is also `ls -la` which shows hidden files too. Hidden files in Linux are not really secret, they just start with a dot like `.something` and Linux hides them by default. Using `-a` forces them to show up.

**Step 3: Moving around**

To actually move between folders you use `cd` followed by where you want to go. So `cd Documents` drops you into the Documents folder. To go back up a level you use `cd ..`. That double dot just means "one folder up from here".
```shell-session
ubuntu@tryhackme:~$ cd Documents/
ubuntu@tryhackme:~/Documents$ pwd
/home/ubuntu/Documents
ubuntu@tryhackme:~/Documents$ cd ..
ubuntu@tryhackme:~$ pwd
/home/ubuntu
```

Simple enough.

**Step 4: Finding the file**

Your supervisor mentioned leaving a file called `mission_brief.txt` somewhere in the home directory. Cool, but WHERE? That is where the `find` command comes in. The basic format is: `find <starting_point> -name <filename>`
You start from the home directory symbol `~` and tell it what to look for:
```shell-session
ubuntu@tryhackme:~$ find ~ -name mission_brief.txt
/home/ubuntu/Documents/.research/archive/mission_brief.txt
```

It takes a second because it is checking every single folder inside your home directory one by one. But it finds it. The full path is `/home/ubuntu/Documents/.research/archive/mission_brief.txt`. Notice the `.research` folder in there, that is a hidden folder. You would have never spotted that just by browsing normally, which is probably the whole point of this step.

You then `cd` into that folder and run `ls` to confirm the file is actually there.

**Step 5: Reading the file**

To read the contents of a file you use `cat`. You run `cat mission_brief.txt` and your supervisor's message finally shows up:
```shell-session
ubuntu@tryhackme:~/home/ubuntu/Documents/.research/archive$ cat mission_brief.txt 
Great job finding your way around the terminal.

Your next assignment is to collect a small system report:
- Who you're logged in as
- The kernel version
- Total disk space
- The name of this Linux distribution

Once you gather those details, you'll be ready for the next step.

FLAG: MISSION-FOUND
```

**Question: What is the full path of the mission_brief.txt file found on the system using the find command?** `/home/ubuntu/Documents/.research/archive/mission_brief.txt`

**Question: What is the flag hidden inside the mission_brief.txt file?** `MISSION-FOUND`

---

## Task 3 — Investigating the System {#task-3}

So the mission brief gave you four things to figure out. Who you are logged in as, what kernel version is running, how much disk space there is, and what Linux distribution this is. Your supervisor wants a system report and you are going to put it together one command at a time.

**Step 1: Who are you**

This one is almost too easy. You just run `whoami` and it tells you your current username.
```shell-session
ubuntu@tryhackme:~$ whoami
ubuntu
```

Yep. You are ubuntu. Moving on.

**Step 2: What system are you on**

To get proper system info you use `uname -a`. The `-a` flag means "give me everything".
```shell-session
ubuntu@tryhackme:~$ uname -a
Linux tryhackme 6.14.0-1018-aws #17-Ubuntu SMP Mon Sep  2 13:48:07 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux
```

That one line tells you a lot. The system is running Linux, the hostname is tryhackme, the kernel version is `6.14.0-1018-aws`, the hardware is 64-bit, and the OS is GNU/Linux. If you just want the bare OS name without all that, you can run `uname` by itself and it just says `Linux`. But `uname -a` is way more useful for actually understanding the environment.

**Step 3: Disk space**

For storage info you use `df -h`. The `-h` flag stands for human readable, which means it shows you sizes in G and M instead of some massive number in bytes that you have to do math on.
```shell-session
ubuntu@tryhackme:~$ df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/root        --G   12G   58G  17% /
tmpfs           1.9G     0  1.9G   0% /dev/shm
tmpfs           774M  1.2M  773M   1% /run
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           387M  192K  387M   1% /run/user/1000
tmpfs           387M  172K  387M   1% /run/user/114
```

The main disk is `/dev/root`. It has 12G used and 58G free, sitting at 17% full. The `tmpfs` entries are just temporary filesystems that live in RAM, not on the actual physical disk, so you do not need to stress about those.

**Step 4: Reading the OS release file**

Linux keeps a lot of useful info in plain text files inside the `/etc` directory. You `cd /etc` to get there and then `ls` to see what is inside. There is a ton of stuff in there. Like a ridiculous amount of stuff. But the one you want is `os-release`.
```shell-session
ubuntu@tryhackme:/etc$ cat os-release 
PRETTY_NAME="Ubuntu 24.04.1 LTS"
NAME="Ubuntu"
VERSION_ID="24.04"
VERSION="24.04.1 LTS (Noble Numbat)"
VERSION_CODENAME=noble
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://www.ubuntu.com/"
...
```

There is your distribution info. Ubuntu 24.04.1 LTS. Clean and easy to read, honestly clearer than what `uname -a` gives you for the distro name.

**Mini challenge: find day1_report.txt on your own**

At this point the room pulls the training wheels off. You are told the file is called `day1_report.txt` and it is somewhere in your home directory. Just go find it yourself using what you learned.

So you do the same thing as before. Run `find` command with the correct syntax, get the path, `cd` into that folder, and `cat` the file.

The message inside is `END-OF-DAY1`.

First day done. Fun right?

**Question: What is the username returned by the whoami command?** `ubuntu`

**Question: What is the kernel version shown by uname -a?** `6.14.0-1018-aws`

**Question: How much free disk space does df -h report?** `58G`

**Question: What is the message written inside day1_report.txt?** `END-OF-DAY1`

---

## Task 4 — Conclusion {#task-4}

That is Linux CLI Basics. We went from staring at a terminal with no idea what to do to navigating the filesystem, finding hidden files, reading file contents, and pulling system information using only the command line. Not bad for a first day.

The terminal is not trying to be difficult. It is just a different way of talking to the computer. Once you stop expecting a GUI to help you and start just typing what you want, it starts to make more sense. `pwd` tells you where you are. `ls` tells you what is around you. `cd` moves you. `find` hunts things down. `cat` reads them. That's it. That is the foundation.

Quick recap of everything covered:

`pwd` prints your current working directory so you always know where you are in the filesystem.

`ls` lists files and folders in the CURRENT directory. Add `-l` for details and `-a` to show hidden files too.

`cd` changes your directory. Use a folder name to go in and `cd ..` to go back up.

`find` searches for files starting from a location you specify. Essential for tracking down files when you have no idea where they are.

`cat` reads and prints the contents of a file straight to the terminal.

`whoami` shows your current username.

`uname -a` shows detailed system and kernel info.

`df -h` shows disk space in a readable format.

`/etc/os-release` is a system file that tells you exactly what Linux distribution you are running.

---