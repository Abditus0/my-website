---
title: "Windows Fundamentals 1 — TryHackMe Cyber Security 101"
date: 2026-04-09
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Windows Fundamentals 1 room - In part 1 of the Windows Fundamentals module, we'll start our journey learning about the Windows desktop, the NTFS file system, UAC, the Control Panel, and more..."
image: "/images/blog/63.png"
readtime: "20 min read"
draft: false
---

# Windows Fundamentals 1

Switching gears from Linux. This is the first part of the Windows Fundamentals module and it is pretty much a tour of the Windows operating system for people who want to understand what they are actually looking at when they use it. Less command line stuff for now, more poking around the interface and understanding how things are structured under the hood.

---

## Tasks

- [Task 1 — Windows Editions](#task-1)
- [Task 2 — The Desktop (GUI)](#task-2)
- [Task 3 — Introduction to Windows](#task-3)
- [Task 4 — The File System](#task-4)
- [Task 5 — The Windows\System32 Folders](#task-5)
- [Task 6 — User Accounts, Profiles, and Permissions](#task-6)
- [Task 7 — User Account Control](#task-7)
- [Task 8 — Settings and the Control Panel](#task-8)
- [Task 9 — Task Manager](#task-9)
- [Task 10 — Conclusion](#task-10)

---

## Task 1 — Windows Editions {#task-1}

Before anything else the room gives you a quick history lesson on Windows versions. The short version is that Windows has been around since 1985 and the history of it is honestly a bit of a mess. XP was great and people loved it way too much to let go. Vista came along and was a disaster. Windows 7 was solid but then Microsoft gave it an end of life date and everyone panicked trying to migrate. Windows 8 was weird and nobody really liked it. Then Windows 10 showed up and things stabilized for a while, and now Windows 11 is the current version for regular desktop users.

For servers it is a bit different. The current server version is Windows Server 2025, and the VM attached to this room is running Windows Server 2019 Standard specifically.

Windows 11 comes in two main flavors, Home and Pro. The difference matters depending on what you need. Home covers most people just fine but Pro unlocks some extra features that are useful in professional or security contexts.

**Question: What encryption can you enable on Pro that you can't enable on Home?** `BitLocker`

This one is about BitLocker, which is Microsoft's built in drive encryption tool. It is available on Pro but not Home.

---

## Task 2 — The Desktop (GUI) {#task-2}

This task walks through all the parts that make up the Windows desktop. Nothing too surprising if you have used Windows before but it is worth knowing the actual names for things.

The main components are:

The Desktop itself, which is where your shortcuts and files sit

The Start Menu, accessed by clicking the Windows logo in the bottom left

The Search Box, which is powered by Cortana

Task View, for switching between virtual desktops and seeing open windows

The Taskbar, which shows your running and pinned apps

Toolbars, which are optional and can be enabled or disabled

The Notification Area, which sits in the bottom right and shows the clock, network status, and other icons

**The Desktop**

Right clicking anywhere on the desktop brings up a context menu where you can change icon sizes, arrange items, paste things, or create new files and folders. From Display Settings you can change resolution and set up multiple monitors. Personalize lets you change the wallpaper, fonts, themes, and colors.

**The Start Menu**

The Start Menu has three main sections. On the left side there are quick shortcuts to your user account settings, your Documents and Pictures folders, the Settings gear, and the power button. Below that is a list of all your installed apps sorted alphabetically, with recently added ones at the top. On the right side there are tiles for pinned apps and utilities. You can right click any tile to resize it, unpin it, or check its properties.

**The Taskbar**

Anything you have open will appear in the taskbar. Hovering over an app in the taskbar shows a thumbnail preview which is handy when you have fifteen Chrome windows open and need to find the right one. Right clicking the taskbar gives you options to customize what shows up and what does not.

**The Notification Area**

Bottom right corner. Clock and date are always there. You will usually also see the volume icon, network icon, and a few others depending on what is installed. You can control which icons appear through Taskbar Settings.

**Question: Which selection will hide/disable the Search box?** `Hidden`

**Question: Which selection will hide/disable the Task View button?** `Show Task View button`

**Question: Besides Clock and Network, what other icon is visible in the Notification Area?** `Action Center`

---

## Task 3 — Introduction to Windows {#task-3}

This task is basically just telling you to start the VM and connect to it. The machine runs Windows Server 2019 and you can either use the browser based view or connect via Remote Desktop using these credentials:

User: `administrator`

Password: `letmein123!`

Accept the certificate prompt when it comes up and you are in. The VM can take a few minutes to fully load so do not panic if it is slow.

---

## Task 4 — The File System {#task-4}

Windows uses NTFS as its file system. Before NTFS there was FAT16, FAT32, and HPFS. You still see FAT partitions on USB drives and SD cards all the time but modern Windows installations use NTFS.

The reason NTFS is better comes down to a few things. It is a journaling file system, meaning it keeps a log of changes so if something crashes it can repair itself using that log. FAT cannot do that. NTFS also supports files larger than 4GB, which FAT32 cannot handle. On top of that NTFS gives you proper per file and per folder permissions, compression, and encryption through something called EFS, the Encrypting File System.

**NTFS Permissions**

You can set the following permissions on files and folders:

- Full Control
- Modify
- Read and Execute
- List Folder Contents
- Read
- Write

To check permissions on anything, right click it, go to Properties, then the Security tab. From there you can select a user or group and see exactly what they are allowed to do.

**Alternate Data Streams**

NTFS has a feature called Alternate Data Streams, or ADS. Every file has at least one data stream but NTFS allows a file to have more than one. Windows Explorer does not show these extra streams to you by default which is exactly why malware writers have used them to hide data. When you download a file from the internet, Windows actually uses ADS to tag it as downloaded from the internet. You can view ADS using PowerShell, which gets covered in a later room.

**Question: What is the meaning of NTFS?** `New Technology File System`

---

## Task 5 — The Windows\System32 Folders {#task-5}

The Windows folder lives at `C:\Windows` by default but it does not have to be on the C drive. It can technically be anywhere, which is why Windows uses environment variables to track where things actually are. The environment variable for the Windows directory is `%windir%`.

Inside the Windows folder there are a lot of subfolders. The most important one is System32. This folder contains the core files that Windows needs to actually run. DLLs, executables, drivers, all of it. A lot of the tools you will use throughout TryHackMe live in here.

The one thing to know about System32 is to not mess with it. Deleting or moving things in there can break Windows completely and not in a fixable way. Just navigate it carefully and treat it as read only unless you really know what you are doing.

**Question: What is the system variable for the Windows folder?** `%windir%`

---

## Task 6 — User Accounts, Profiles, and Permissions {#task-6}

Windows has two types of local user accounts. Administrators can do basically anything on the system, install software, add or remove users, change system settings. Standard Users are restricted to their own files and folders and cannot make system level changes.

When a user account is created and logs in for the first time, Windows automatically creates a profile folder for them at `C:\Users\username`. Inside that folder you get the standard set of folders like Desktop, Documents, Downloads, Music, and Pictures.

To manage users you can open Local Users and Groups by pressing Win+R and typing `lusrmgr.msc`. This gives you a proper view of all accounts and groups on the machine. Users can be added to groups and they inherit whatever permissions that group has.

**Question: What is the name of the other user account?** `tryhackmebilly`

Found it in lusrmgr.msc under Users.


**Question: What groups is this user a member of?** `Remote Desktop Users, Users`

Right clicked the account and checked Properties then the Member Of tab.

**Question: What built-in account is for guest access to the computer?** `Guest`

**Question: What is the account description?** `window$Fun1!`

Clicked on the Guest account in lusrmgr and checked the description field.

---

## Task 7 — User Account Control {#task-7}

Most home users run Windows as a local administrator, which means their account technically has the power to do anything on the system. The problem with that is if malware gets in, it also has the power to do anything on the system because it runs in the context of whoever is logged in.

Microsoft introduced UAC, User Account Control, back in Windows Vista to deal with this. The idea is that even if you are logged in as an administrator, your session does not run with full elevated privileges by default. When something needs higher privileges, like installing a program, Windows stops and asks you to confirm it first. That popup is UAC doing its job.

For standard users it goes a step further. If they try to do something that needs admin rights, UAC prompts for an administrator username and password rather than just a yes or no confirmation. If nobody enters the credentials within a short window the prompt disappears and the action does not go through.

The shield icon you sometimes see on program shortcuts is Windows telling you that UAC will prompt when you launch it. Worth knowing what that means when you see it.

Note that UAC does not apply to the built in local administrator account by default, which is one reason that account is treated carefully in security contexts.

**Question: What does UAC mean?** `User Account Control`

---

## Task 8 — Settings and the Control Panel {#task-8}

There are two places on Windows where you go to change things. The Settings menu and the Control Panel. Settings was added in Windows 8 and is designed to be cleaner and more touch friendly. Control Panel is the older one and has been around forever.

For most everyday changes Settings is fine and is what Microsoft pushes you toward now. But for more complex or specific configurations you often end up in the Control Panel anyway. Sometimes you start in Settings and Windows just silently opens a Control Panel window to finish what you were doing, which is a bit inconsistent but that is just how it is.

If you are not sure where a setting lives, the fastest way is to just search for it in the Start Menu. Type what you are looking for and Windows will usually point you to the right place.

To see installed programs you go to Control Panel, click Programs, then Programs and Features. That gives you a list of everything installed with names, publishers, and version numbers. Useful for auditing what is on a machine.

**Question: In the Control Panel, change the view to Small icons. What is the last setting in the Control Panel view?** `Windows Defender Firewall`

---

## Task 9 — Task Manager {#task-9}

Task Manager is the tool you open when something is being weird or you just want to see what is going on with your system. It shows you all running applications and processes, how much CPU and RAM each one is using, network activity, and more.

You open it by right clicking the taskbar and selecting Task Manager. When it first opens it shows a simplified view with just the running apps. Click More Details and you get the full picture with all background processes, performance graphs, startup programs, and everything else.

The keyboard shortcut is worth memorizing because it works even when things are frozen or the taskbar is not responding.

**Question: What is the keyboard shortcut to open Task Manager?** `Ctrl+Shift+Esc`

---

## Task 10 — Conclusion {#task-10}

That wraps up Windows Fundamentals Part 1. It was a broad overview of the OS rather than anything too deep, but knowing where things live and what they are called is good when you start doing more serious work. The next parts of the module go into the Windows folder, the management console, and security tools like Windows Defender and the Windows Firewall.

---