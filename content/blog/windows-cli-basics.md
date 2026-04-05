---
title: "Windows CLI Basics — TryHackMe Pre Security Path"
date: 2026-03-25
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Windows CLI Basics room - Explore what Windows CLI is, how to navigate, and interact with the system using Windows CLI."
image: "/images/blog/38.png"
readtime: "18 min read"
draft: false
---

# Windows CLI Basics

So you survived the Linux terminal. Good. Now we are doing the same thing but on Windows. And before you think "wait I already know Windows", sure, but do you know it without the GUI? No Start menu, no File Explorer, no right clicking anything. Just a black Command Prompt window and your keyboard. That is what this room is about.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Windows CLI: Navigating Files and Finding Your First File](#task-2)
- [Task 3 — Gathering System Information on Windows](#task-3)
- [Task 4 — Conclusion](#task-4)

---

## Task 1 — Introduction {#task-1}

Day 2 of the internship. Your supervisor shows up, gives you a quick update on what you are doing today, and then disappears again. Same energy as day one honestly.

The room follows the same story driven format as the Linux CLI Basics room. You are an IT Support Engineer, you have a task to complete, and you are going to learn by actually doing it instead of just reading about it.

The focus this time is the Windows Command Prompt, or CMD. Most people who use Windows have never opened it in their life. But in cyber security you will be using it constantly because a huge chunk of real world attacks and investigations involve Windows machines. Knowing how to poke around one without a GUI is genuinely useful.

By the end of the room you should be able to navigate folders, find files, read them, and pull basic system and network information, all from the command line.

---

## Task 2 — Windows CLI: Navigating Files and Finding Your First File {#task-2}

**Quick note about the terminal**

Same deal as the Linux room. The terminal is just a text based way to talk to the operating system. You type a command, the system does the thing. Cyber security people use it because it is faster, gives more control, and a lot of tools simply do not have a graphical version. It becomes natural with time.

Start the machine, open the Terminal file on the desktop, and you are in.

**The mission**

Your supervisor left a note saying there is a file called `task_brief.txt` somewhere in your user folder. You need to find it using only the command line. You are not told where it is, just the name.

**Step 1: Where am I**

On Linux you used `pwd` to check your location. On Windows the command is just `cd` on its own with nothing after it. Run it and it prints your current directory path.

You are in `C:\Users\Administrator`. Makes sense, that is the default landing spot.

**Step 2: What is around me**

To list the contents of the current directory you use `dir`. It shows you all the files and folders in your current location, along with some basic info like dates and sizes. From the output you can see 16 directories listed.

**Step 3: Are there hidden files?**

Just like Linux, Windows hides certain files and folders by default. They are not secret, just not shown in a normal listing. To see everything including hidden items you add the `/a` flag:
```cmd
dir /a
```

Run that and suddenly more than 12 extra hidden folders appear that were not there before. Good habit to always check this when you are investigating a system.

**Step 4: Moving around**

To move between folders you use `cd` followed by the folder name, same concept as Linux. So `cd Documents` drops you into the Documents folder. To go back up a level you use `cd ..`, also the same as Linux. That part at least is consistent between the two.

Use `dir` and `dir /a` as you move around to see what is inside each folder. The file is not going to be somewhere obvious though, just a heads up.

**Step 5: Finding the file**

Instead of digging through every folder manually, you can make Windows search for you. The command is:
```cmd
dir /s task_brief.txt
```

The `/s` flag tells Windows to search through all subfolders starting from wherever you currently are. If the file exists anywhere under that location it will find it and print the full path.

Running it from `C:\Users\Administrator` finds the file at:
`C:\Users\Administrator\Documents\Notes\research_yn6\exports_imv\screenshots\notes_wi6`
That is a deeply buried path. You would have been clicking around for ages trying to find that manually.

**Step 6: Navigate to the file**

Now that you have the path, use `cd` to get there:
```cmd
cd C:\Users\Administrator\Documents\Notes\research_yn6\exports_imv\screenshots\notes_wi6
```

Then run `dir` to confirm `task_brief.txt` is actually in that folder.

**Step 7: Read the file**

On Linux you used `cat` to read files. On Windows the equivalent is `type`. Run:
```cmd
type task_brief.txt
```

And the contents print to the terminal. The message inside is your flag, and it also sets up the next task which is about gathering system information.

**Question: What is the full path of the task_brief.txt found on the system?** `C:\Users\Administrator\Documents\Notes\research_yn6\exports_imv\screenshots\notes_wi6`

**Question: What message and flag are written inside task_brief.txt?** `TASK-BRIEF-FOUND`

---

## Task 3 — Gathering System Information on Windows {#task-3}

Now that you can move around and read files, time to actually ask the system some questions about itself. This is something analysts and IT staff do at the very start of working on any machine. Before you can fix something or investigate something you need to know what you are even dealing with.

**Step 1: Who are you logged in as?**

Same command as Linux, this one carries over:
```cmd
C:\Users\Administrator>whoami
thmlab\administrator
```

The format is `domain\username`. So the machine is part of a domain called `thmlab` and you are logged in as the `administrator` account on it.

**Step 2: What is the name of this computer?**

Every Windows machine on a network has a name. To see it you run:
```cmd
hostname
```

The computer name is `THMLAB`. In a workplace environment these names help identify which machine is which on the network.

**Step 3: What version of Windows is this?**

This one dumps a lot of information at once:
```cmd
systeminfo
```

There is a lot in that output and you are not expected to know what all of it means right now. The parts worth focusing on are the OS Name, OS Version, and System Type. The OS version here is `10.0.17763 N/A Build 17763`, which corresponds to Windows Server 2019.

**Step 4: How is this machine connected to the network?**

Last one. To see network configuration you run:
```cmd
ipconfig
```

This shows you the machine's network setup. The two things to pay attention to are the IPv4 Address, which is the machine's address on the local network, and the Default Gateway, which is usually the router it connects through. Analysts use this to understand how a machine sits within a network.

**Question: What is the computer name shown by hostname?** `THMLAB`

**Question: What Windows version is listed in the systeminfo output?** `10.0.17763 N/A Build 17763`

---

## Task 4 — Conclusion {#task-4}

And that is Windows CLI Basics done. Two days into this internship and you have already learned to navigate both Linux and Windows from the command line without touching a single icon or menu. Not a bad start.

Quick recap of everything covered:

`cd` on its own prints your current directory path on Windows.

`dir` lists files and folders in the current location.

`dir /a` does the same but also shows hidden items.

`cd folder_name` moves you into a folder and `cd ..` takes you back up a level.

`dir /s filename` searches all subfolders for a specific file and gives you the full path.

`type filename` reads and prints the contents of a file in the terminal.

`whoami` shows your current username and domain.

`hostname` shows the name of the computer.

`systeminfo` prints detailed information about the OS, version, and hardware.

`ipconfig` shows the machine's network configuration including IP address and gateway.

---