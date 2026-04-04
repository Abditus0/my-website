---
title: "Windows Basics — TryHackMe Pre Security Path"
date: 2026-04-04
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Windows Basics room - Learn to navigate Windows, manage files, and use essential system tools."
image: "/images/blog/36.png"
readtime: "22 min read"
draft: false
---

# Windows Basics

If you have ever used a computer at school, at work, or at home, there is a good chance it was running Windows. It is the most widely used desktop operating system in the world and honestly it is hard to avoid. This room takes everything from the previous OS introduction room and applies it to a real system you have probably already used before.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Exploring the Windows Workspace](#task-2)
- [Task 3 — Configuring and Securing Windows](#task-3)
- [Task 4 — Conclusion](#task-4)

---

## Task 1 — Introduction {#task-1}

The scenario this time is that you just started your first day at a company called TryHatMe (clever). You log into your workstation and your job is basically to get familiar with it. Your supervisor walks you through the desktop, the file system, some system settings, the Task Manager, and the built-in security tools. Pretty normal onboarding stuff, just with a CTF flag hidden in a text file which is a bit less normal.

By the end of the room you should feel comfortable navigating Windows and handling the kind of everyday tasks you would actually be expected to do.

Start the machine and proceed to Task 2.

---

## Task 2 — Exploring the Windows Workspace {#task-2}

**A bit of history**

Windows did not start out looking anything like it does today (duhh). Before all the icons and menus, Microsoft had MS-DOS, which was just a black screen where you typed commands. In 1985 they released Windows 1.0, which introduced a basic graphical interface on top of DOS. Actual windows, menus, mouse support. Over the decades it kept evolving and what you use today is the result of all those changes stacked on top of each other.

**Logging in**

Before you even see the desktop you have to authenticate, basically prove to the system who you are. Windows supports a few account types with different levels of access.

A Guest account is the most restricted. It is meant for temporary access and cannot change anything about the system.

A Standard account is what most everyday users have. You can run apps and change your own personal settings but you cannot touch system-wide stuff.

An Administrator account has full control. You can install software, change system settings, manage other users, basically anything. In this room you are automatically logged in as an Administrator so nothing is off limits.

**The desktop**

The room keeps using the airport analogy from the previous room which is actually still useful here. If logging in is the security checkpoint, the desktop is the terminal. Everything you need branches out from here.

There are two main areas when you first land on the desktop.

The desktop itself is your main workspace. Files, folders, and shortcuts live here. You can put whatever you want on it.

The taskbar runs along the bottom and is basically your control strip. Start menu, search, open apps, system tray with the clock and notifications, all of it lives down there.

Breaking down the taskbar a bit more: on the left you have the Start menu button which is the Windows logo. Next to it is search, then Task View for switching between open windows. Further along are your pinned apps and folders. On the right side you have network and audio settings, the date and time, and notifications.

**The Start menu**

Clicking the Windows logo in the bottom left opens the Start menu. This is your main hub for finding anything on the system. Apps, files, settings, power options. If you do not know where something is, the Start menu or the search bar next to it is always the first place to check.

**Built-in tools**

Windows comes with a bunch of useful tools already installed. Notepad for editing text files, File Explorer for navigating your files and folders, the Settings app for configuring basically everything. You do not need to install anything to get started, it is all there.

**Checking the system**

There is a shortcut on the desktop called About your PC. Opening it takes you to the Device specifications section in Settings and gives you a full overview of the machine you are working with.

The device name is TryHatMe, it has 4.00 GB of RAM installed, and it is running Windows Server 2019 Datacenter version 1809.

**File Explorer and folder structure**

Windows organizes everything in a hierarchical folder structure. Folders inside folders, files inside folders, branching out from a few common starting points like the Desktop, Documents, and Downloads. Understanding this makes navigating the system way easier because once you know the structure it all starts to make sense.

File Explorer is the built-in tool for browsing all of this. You can open it from the taskbar, the Start menu, or just by clicking any folder. At the top you can see the full path to wherever you are, something like `C:\Users\Administrator\Desktop\TryHatMe Onboarding`, which tells you exactly where you are in the folder structure.

Opening the TryHatMe Onboarding folder on the desktop and finding Welcome.txt inside gives you the first flag.

**Question: What is the Device name specified?** `TryHatMe`

**Question: How much RAM is installed on your new work PC?** `4.00 GB`

**Question: Which Version of Windows Server 2019 Datacenter is installed?** `1809`

**Question: What is the flag value found within Welcome.txt?** `THM{welcome_to_tryhatme!}`

---

## Task 3 — Configuring and Securing Windows {#task-3}

**Keeping things updated**

Keeping your OS and apps up to date is one of those things that sounds boring but matters A LOT. Updates fix security holes, patch bugs, and sometimes improve performance. Skipping them is how systems end up vulnerable to stuff that was already fixed months ago.

Windows has a built-in tool called Windows Update that handles OS updates and some native app updates automatically. For third-party apps it varies. Some update themselves in the background, some remind you every time you open them, and some you just have to manually check and download a new installer yourself. 

Microsoft drops security patches every second Tuesday of the month, a schedule known as Patch Tuesday. 2026 is reported to be the year with the most Windows vulnerabilities ever found, and a lot of that has to do with bad actors using AI to find security holes faster than ever before.

**Installing and removing apps**

There are two main ways to install new software on Windows.

The Microsoft Store is a controlled place where you can grab apps safely. Not always available depending on the version of Windows you are on though, and in this room it is not available since it is Windows Server.

The more common method in most environments is just downloading an installer directly from a vendor's website. Usually comes as an `.exe` or `.msi` file and walks you through the setup. That is what happens here with the TryHatMeWelcome installer sitting in the onboarding folder.

Double-clicking it, running through the installation, and then opening the app gives you the flag.

For uninstalling, Windows gives you a few options. You can use the Microsoft Store for apps installed through there, the Add or remove programs section in Settings, the Control Panel, or sometimes the app itself has its own uninstaller.

**Settings and Control Panel**

There are two places in Windows where you can configure things and it is a little confusing at first because they overlap.

Windows Settings is the modern one. Clean interface, covers most things you would need day to day. System preferences, display, audio, user accounts, network, security, accessibility. Windows is trying to completely replace Control Panel with Windows Settings in the upcoming future.

Control Panel is the older one that Microsoft has been slowly replacing but never fully got rid of. Some older configuration tools still only live there so it is worth knowing it exists.

Checking the Time and Language section of Windows Settings shows the region is set to United States.

**Task Manager**

Task Manager is one of those tools you will open constantly once you know it exists. It shows you everything happening on your system in real time.

The Processes tab shows all running apps and background processes along with how much CPU and memory each one is using. Useful for figuring out what is slowing your machine down.

The Performance tab shows graphs for CPU, memory, and network usage over time.

The Users tab shows who is currently logged in and what resources they are using. In this case it is just the Administrator account.

The Details tab is a more technical view of running processes including their process IDs.

The Services tab shows Windows services and whether they are running or stopped.

**Windows Security**

Before you install any third-party antivirus or security tool, Windows already has a bunch of protection running in the background. The Windows Security app is the central dashboard for all of it.

Virus and threat protection handles malware detection and removal with real-time scanning and custom scans.

Firewall and network protection controls what network traffic is allowed in and out of your machine.

App and browser control protects you from sketchy apps, files, and websites.

Device security covers hardware-level protections.

The task walks you through running a custom scan on the TryHatMe Onboarding folder. To do it you open Windows Security, go to Virus and threat protection, hit Scan options, pick Custom scan, then point it at the onboarding folder on the desktop.

The scan finds a test file called `tryhatmemaldoc.txt`. It is a safe test file, basically a standard way to verify that antivirus scanning is actually working, but Windows flags it anyway which is exactly what you want to see.

**Windows Defender Firewall**

The built-in firewall monitors network connections and decides what is allowed through based on rules you can configure. It works across three network profiles.

Domain is for when your machine is connected to an organisation's network.

Private is for trusted networks like your home or a lab setup.

Public is for untrusted networks like public Wi-Fi where you want stricter rules.

In the Advanced settings you can see all the inbound and outbound rules in detail, create new ones, or filter the existing view.

**Question: What is the flag value you receive after installing and running the application?** `THM{your_first_day!}`

**Question: Which country or region is your computer currently set to?** `United States`

**Question: Which account is currently logged in?** `Administrator`

**Question: What is the file name shown in the Affected items section?** `tryhatmemaldoc.txt`

---

## Task 4 — Conclusion {#task-4}

That is Windows Basics done. We went through the desktop and taskbar, checked system specs, navigated the file system, installed an app, poked around Settings and the Control Panel, used the Task Manager, and ran a security scan. Not a bad first day at TryHatMe huh?

The big takeaway here is that Windows is not just a pretty interface sitting on top of nothing. Everything you see connects back to the OS concepts from the previous room. The login screen is authentication. The taskbar and Start menu are how you interact with running processes. File Explorer is the OS file system management made visual. Task Manager is process and memory management you can actually watch in real time. Windows Security is the OS doing its job as a security foundation before anything else is even installed.

Quick recap of the key terms from this room:

Desktop is the main workspace where files, folders, and shortcuts live.

Taskbar is the control strip at the bottom giving you access to apps, tools, settings, and notifications.

Start Menu is the main hub for finding apps, settings, files, and power options.

File Explorer is the built-in tool for browsing and managing files and folders.

Windows Update is the built-in tool that keeps your OS and native apps up to date.

Windows Settings is the modern centralized place for configuring your system.

Control Panel is the older configuration interface that still handles some things Settings does not cover.

Task Manager is the real-time monitor for everything running on your system.

Windows Security is the central dashboard for Windows built-in protection tools.

Windows Defender Firewall is the built-in firewall that controls network traffic in and out of your machine.

---