---
title: "Windows Fundamentals 2 — TryHackMe Cyber Security 101"
date: 2026-04-10
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Windows Fundamentals 2 room — In part 2 of the Windows Fundamentals module, discover more about System Configuration, UAC Settings, Resource Monitoring, the Windows Registry and more..."
image: "/images/blog/64.png"
readtime: "22 min read"
draft: false
---

# Windows Fundamentals 2

Continuing the Windows journey. Part 1 was about the desktop, the file system, user accounts, and UAC. This one goes a bit deeper into the tools and utilities that Windows has built in. A lot of these are things you might have seen mentioned somewhere before but never actually opened. After this room you will know what they are and what they do.

Same VM setup as before by the way. Connect via Remote Desktop with these:

User: `administrator`
Password: `letmein123!`

Accept the certificate and you are in. Give it a couple minutes to load if it is being slow.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — System Configuration and Advanced System Settings](#task-2)
- [Task 3 — Change UAC Settings](#task-3)
- [Task 4 — Computer Management](#task-4)
- [Task 5 — System Information](#task-5)
- [Task 6 — Resource Monitor](#task-6)
- [Task 7 — Command Prompt](#task-7)
- [Task 8 — Registry Editor](#task-8)
- [Task 9 — Conclusion](#task-9)

---

## Task 1 — Introduction {#task-1}

Nothing much here. The room just tells you what was covered in part 1 (desktop, file system, UAC, control panel, settings, task manager) and says this module is going to go over some other utilities and different ways to access them. Start the machine and move on.

---

## Task 2 — System Configuration and Advanced System Settings {#task-2}

This task covers two things. First is MSConfig, then Advanced System Settings.

**System Configuration (MSConfig)**

MSConfig is a troubleshooting utility. Its main job is to help diagnose startup issues but it also gives you access to a bunch of other tools from one place. You need local admin rights to open it. You can launch it from the Start Menu or just type `msconfig` in the Run prompt.

It has five tabs: General, Boot, Services, Startup, and Tools.

The General tab is where you pick what Windows loads at startup. You have three options: Normal (loads everything), Diagnostic (loads only basic stuff), or Selective (you choose what gets loaded). Useful when you are trying to figure out if something is causing boot problems.

The Boot tab is where you configure boot options for the OS. Things like safe boot, timeout, and other low level stuff.

The Services tab shows every service on the system whether it is running or stopped. A service is basically an application that runs in the background without a visible window.

The Startup tab is a bit of a dead end on this VM. On a normal Windows 10 or 11 machine it would show your startup programs and redirect you to Task Manager to manage them. But because this is a Windows Server machine, startup items work differently. Task Manager on this VM does not even have a Startup tab. The only reliable way to check startup items on a Windows server is through the Startup folder itself. Press Win+R and type `shell:startup` to open it. That is where any programs set to launch at login will show up as shortcuts or executables.

The Tools tab is the interesting one. It is basically a list of system utilities you can launch from right here. Each one has a short description and shows you the command for it. You can either click Launch or grab the command and run it yourself from the Run prompt or command line.

**Advanced System Settings**

This one you can find by searching "View advanced system settings" in the Start Menu. It opens a System Properties panel.

One thing in here is the page file setting. The page file is basically Windows using part of your hard drive as extra RAM when your actual RAM fills up. It is not as fast as real RAM but it stops things from crashing when memory gets tight. You can view or change it under Advanced at the top, then Settings under Performance. Inside there you will find a tab also called Advanced which shows you the current page file size (on this VM it is 704 MB) and lets you see which drive it is on, the initial size, the max size, and whether Windows is managing it automatically.

The other thing in Advanced System Settings worth knowing about is Startup and Recovery. Windows can write a crash dump file when it hits a critical error like a Blue Screen of Death. That dump file is how admins and analysts figure out what actually went wrong. You get to that setting under Advanced, then Settings under Startup and Recovery. The "Write debugging information" dropdown shows you what type of dump Windows is configured to save. The options are Automatic memory dump, Kernel memory dump, Small memory dump (256 KB), Complete memory dump, or None.

**Question: What is the name of the service that lists Systems Internals as the manufacturer?** `PsShutdown`

**Question: Whom is the Windows license registered to?** `Windows User`

**Question: What is the command for Windows Troubleshooting?** `C:\Windows\System32\control.exe /name Microsoft.Troubleshooting`

**Question: What command will open the Control Panel?** `control.exe`

---

## Task 3 — Change UAC Settings {#task-3}

UAC was covered properly in Windows Fundamentals 1 so this task is pretty short. It is just pointing out that you can actually change the UAC level using a slider with four positions.

The levels from top to bottom are:

Always notify, which is the strictest setting. Windows prompts you for every single change whether an app is doing it or you are doing it yourself. The screen also dims (that is called Secure Desktop, it blocks other apps from interacting with the prompt).

Notify for apps is the default. Windows only prompts you when an app tries to make a change, not when you change settings yourself. Screen still dims.

Notify without dimming is basically the same as above but the screen does not dim. Slightly less secure because other software could potentially interact with the prompt.

Never notify turns everything off. No warnings at all, ever. Not recommended unless you have a very specific reason for it.

**Question: What is the command to open User Account Control Settings?** `UserAccountControlSettings.exe`

---

## Task 4 — Computer Management {#task-4}

Computer Management is one of those utilities that has a lot packed into it. You open it with `compmgmt.msc` and it splits into three sections: System Tools, Storage, and Services and Applications.

**System Tools**

Task Scheduler is the first thing under System Tools. This is where Windows keeps all the automated tasks that are configured to run at specific times or triggers. You can see every scheduled task by clicking Task Scheduler Library. Each task shows you what it runs, when it runs, and other details. Tasks can be set to run at login, at logoff, on a specific schedule like every five minutes, or just once at a specific time. To make a new one you click Create Basic Task in the right pane.

Event Viewer is next and this one is really useful. It is basically a log viewer for everything that happens on the system. Think of it as an audit trail. When something goes wrong you come here to figure out what happened and when. The left pane is a tree of log providers, the middle shows the events for whatever you have selected, and the right pane has actions. Events have five types: Information, Warning, Error, Critical, and Audit (Success and Failure). The standard logs live under Windows Logs and include Application, Security, Setup, System, and Forwarded Events.

Shared Folders shows you everything that is being shared on the machine. Under Shares you can see the default Windows shares like C$ and admin shares like ADMIN$. Under Sessions you can see who is currently connected to any of those shares. Under Open Files you can see what files connected users have open. Right clicking any share lets you check its permissions.

Local Users and Groups is the same `lusrmgr.msc` from Windows Fundamentals 1. Nothing new here.

Performance is where you find Performance Monitor (perfmon). This tool lets you watch performance data in real time or pull it from a saved log. Useful for tracking down what is eating your CPU or memory, either on the local machine or remotely.

Device Manager lets you view and manage hardware. You can see what is connected, update drivers, disable devices, and check for problems.

**Storage**

Disk Management lives here. It is the tool for managing drives and partitions. You can set up a new drive, extend or shrink a partition, and assign or change drive letters. The VM is a Windows Server so you also see Windows Server Backup here, which you would not normally find on a regular Windows 10 machine.

**Services and Applications**

The Services section shows all services on the machine with their status and other info. Right clicking any service and going to Properties gives you more detail including the actual service name (which can be different from the display name), the path to the executable, and the startup type. Startup type can be Automatic (starts every boot), Manual (only starts when triggered), or Disabled (should not run at all).

WMI Control is also in here. WMI stands for Windows Management Instrumentation and it is a service that lets scripting languages like PowerShell manage Windows systems locally or remotely. The old command line tool for this was WMIC but that has been deprecated since Windows 10 version 21H1 and PowerShell is the way to go now.

**Question: What is the command to open Computer Management?** `compmgmt.msc`

**Question: When is the npcapwatchdog scheduled task set to run at?** `At System Startup`

**Question: What is the name of the hidden folder that is shared?** `sh4r3dF0Ld3r`

---

## Task 5 — System Information {#task-5}

System Information, or `msinfo32`, is a tool that pulls together a full overview of your hardware, system components, and software environment all in one place. Microsoft describes it as a diagnostic tool and that is pretty accurate. When you are trying to figure out what is on a machine or diagnose a problem, this is a good place to start.

The information is split into three sections.

Hardware Resources is the low level stuff like memory addresses, IRQs, and DMA channels. Not really something the average person needs to look at.

Components covers the hardware devices on the machine. Not everything shows data but things like Display and Input do.

Software Environment is the useful one for most purposes. It shows environment variables, running tasks, loaded modules, services, network connections, and more.

On the topic of environment variables, these are basically named values that the OS and programs use to find things. For example the WINDIR variable stores the path to the Windows installation. Programs query these instead of hardcoding paths. You can browse them in msinfo32 under Software Environment, but you can also get to them through Control Panel, System and Security, System, Advanced system settings, Environment Variables. Or through Settings, System, About, system info, Advanced system settings, Environment Variables. Either way works.

There is also a search bar at the bottom of msinfo32. If you select a section and type something in the search bar it will find entries matching your search across that section. The room asks you to try selecting Components and searching for IP address as an example.

**Question: What is the command to open System Information?** `msinfo32.exe`

**Question: What is listed under System Name?** `THM-WINFUN2`

**Question: Under Environment Variables, what is the value for ComSpec?** `%SystemRoot%\system32\cmd.exe`

---

## Task 6 — Resource Monitor {#task-6}

Resource Monitor, or `resmon`, is a step up from Task Manager when you need more detail about what is going on with your system. Microsoft describes it as showing per-process and aggregate CPU, memory, disk, and network usage. It also shows which processes are using specific file handles and modules which is the kind of detail Task Manager does not give you.

It has four sections and four matching tabs at the top: CPU, Memory, Disk, and Network. The Overview tab shows a summary of all four at once. On the far right there is a live graph pane that updates in real time for each section.

The filtering is what makes it actually useful. You can isolate data to one or more specific processes, start or stop services directly from the interface, and even close unresponsive applications. There is also a process analysis feature that can help identify deadlocked processes and file locking conflicts, which is handy when something is frozen and you are trying to figure out why.

This is definitely a tool aimed at people doing advanced troubleshooting rather than casual users but it is worth knowing it exists.

**Question: What is the command to open Resource Monitor?** `resmon.exe`

---

## Task 7 — Command Prompt {#task-7}

My favourite. The command prompt is `cmd`. Before graphical interfaces existed this was the only way to talk to the operating system, and even now it is still useful for plenty of things. The room covers a handful of commands worth knowing.

`hostname` prints the name of the computer. Simple but useful when you are on a remote machine and need to confirm where you are.

`whoami` prints the name of the currently logged in user.

`ipconfig` shows the network settings for the machine. IP address, subnet mask, default gateway, all of it. If you want more detail you run `ipconfig /all` which adds things like MAC addresses and DNS servers.

For any command you are not sure about, you can add `/?` to the end of it to pull up the help manual. So `ipconfig /?` shows you all the options for ipconfig. The exception is the `net` command which uses a different syntax for help. For that one you use `net help` and for subcommands you do `net help user` or `net help localgroup` and so on.

`netstat` shows protocol statistics and current network connections. Run it alone for a basic output or add parameters like `-a` to see all connections and listening ports. The help manual shows you all the options.

To clear the screen at any point just type `cls`.

**Question: In System Configuration, what is the full command for Internet Protocol Configuration?** `C:\Windows\System32\cmd.exe /k %windir%\system32\ipconfig.exe`

**Question: For the ipconfig command, how do you show detailed information?** `ipconfig /all`

---

## Task 8 — Registry Editor {#task-8}

The Windows Registry is a central database that Windows uses to store configuration information for the OS, users, applications, and hardware. It holds things like user profiles, installed application data, folder and icon settings, hardware info, and which ports are in use. Windows is constantly reading from it during normal operation.

The tool to view and edit it is the Registry Editor, opened with `regedit.exe`.

The room makes it very clear that this is for advanced users and you should be careful in here. Making the wrong change to the registry can break things, sometimes badly. Not the place to poke around randomly.

**Question: What is the command to open the Registry Editor?** `regedt32.exe`

---

## Task 9 — Conclusion {#task-9}

That is Windows Fundamentals 2 done. The main thing to take away from this room is that most of these tools can be launched directly without going through MSConfig at all. You can run them from the Start Menu, from the Run prompt, or from the command line using the commands covered throughout the tasks. MSConfig is just one convenient place that lists them together.

Some tools from MSConfig were not covered here because they were already in Windows Fundamentals 1 or are left for you to explore yourself. The next part of the module goes into Windows security tools like Windows Defender and the Firewall.

---