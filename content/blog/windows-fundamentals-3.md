---
title: "Windows Fundamentals 3 — TryHackMe Cyber Security 101"
date: 2026-04-11
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Windows Fundamentals 3 room — In part 3 of the Windows Fundamentals module, learn about the built-in Microsoft tools that help keep the device secure, such as Windows Updates, Windows Security, BitLocker, and more..."
image: "/images/blog/65.png"
readtime: "18 min read"
draft: false
---

# Windows Fundamentals 3

Part 3 of the Windows Fundamentals series. Part 1 was the desktop, file system, and user accounts. Part 2 went into the system utilities and tools. This one is all about security. The built in stuff Windows ships with to try and keep your machine safe.

Same VM setup as the previous two rooms. Connect via Remote Desktop:

User: `administrator`
Password: `letmein123!`

Accept the certificate, give it a minute or two to load, and you are in.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Windows Updates](#task-2)
- [Task 3 — Windows Security](#task-3)
- [Task 4 — Virus & Threat Protection](#task-4)
- [Task 5 — Firewall & Network Protection](#task-5)
- [Task 6 — App & browser control](#task-6)
- [Task 7 — Device Security](#task-7)
- [Task 8 — BitLocker](#task-8)
- [Task 9 — Volume Shadow Copy Service](#task-9)
- [Task 10 — Conclusion](#task-10)

---

## Task 1 — Introduction {#task-1}

Quick recap and then you start the machine. Part 1 covered the desktop, file system, user account control, control panel, settings, and task manager. Part 2 covered utilities like System Configuration, Computer Management, Resource Monitor and so on. This part is focused on the security features built into Windows. Start the VM and move on.

---

## Task 2 — Windows Updates {#task-2}

Windows Update is the service Microsoft uses to push security patches, feature updates, and fixes to your Windows device. It also covers other Microsoft products like Defender. Most of the time updates come out on the second Tuesday of every month, which is called Patch Tuesday. That said, if something critical comes up Microsoft does not wait for the next Patch Tuesday. They push it out whenever it is ready.

You can get to Windows Update through Settings, or if you want to feel fancy about it you can open the Run dialog and type `control /name Microsoft.WindowsUpdate`.

Now, Windows users have had a long history of just... ignoring updates. Clicking "remind me later" forever, rebooting at the worst possible time, you know how it goes. Microsoft got tired of this and with Windows 10 they basically said, you do not get to skip updates anymore. You can delay them but eventually Windows is going to update and restart whether you like it or not. Which is annoying but also kind of fair given how many attacks exploit unpatched systems.

On the VM the update settings are managed, meaning someone else is controlling them. There are also no available updates because the VM has no internet access so it cannot check with Microsoft for anything new.

**Question: There were two definition updates installed in the attached VM. On what date were these updates installed?** `5/3/2021`

---

## Task 3 — Windows Security {#task-3}

Windows Security is the main dashboard for all the protection features on your device. Microsoft calls it your home to manage the tools that protect your device and your data, which is a reasonable description.

You can get to it through Settings, or you can just search for it in the Start Menu.

Inside Windows Security there are four main protection areas:

Virus and threat protection handles antivirus and malware scanning. Firewall and network protection controls what traffic is allowed in and out. App and browser control is about SmartScreen and keeping dodgy downloads away from you. Device security covers hardware level protection like TPM and memory integrity.

Each area has a status icon. Green means everything is fine and there is nothing you need to do. Yellow means there is a recommendation you should probably look at. Red means something needs your attention right now, do not ignore it.

On the VM, one of those areas is showing red.

**Question: Checking the Security section on your VM, which area needs immediate attention?** `Virus & threat protection`

---

## Task 4 — Virus and Threat Protection {#task-4}

This section is split into two parts: Current threats and Virus and threat protection settings.

**Current threats**

This is where you run scans and check what Defender has found. You have three scan options. Quick scan checks the folders where threats are most commonly found and is the fastest option. Full scan goes through every single file and running program on the drive, which can take over an hour so do not kick that off if you are in a hurry. Custom scan lets you pick specific files or folders to check.

Under threat history you can see the results of the last scan, any threats that have been quarantined (isolated so they cannot run), and anything you have manually allowed to run even though Defender flagged it. That last one is a bit spicy. Only allow something through if you are completely sure what it is.

**Virus and threat protection settings**

Real-time protection is the main thing here. It watches for malware trying to install or run and stops it. On the VM this is turned off to keep performance reasonable since the VM has no internet access anyway. On your own machine you want this on.

Cloud-delivered protection connects to Microsoft's cloud to get the most up to date threat data faster than a normal definition update would provide.

Automatic sample submission sends suspicious files to Microsoft so they can analyze them and improve protection for everyone.

Controlled folder access is an interesting one. When it is on, only approved apps are allowed to make changes to protected folders. This is specifically useful against ransomware because ransomware needs to modify your files to encrypt them. If it cannot touch those folders it cannot do its job. You enable it under Manage controlled folder access and flip the toggle on.

Exclusions lets you tell Defender to skip certain files or folders during scans. This is for situations where you know something is safe and Defender keeps flagging it as a false positive. Use this carefully because anything excluded is essentially invisible to the antivirus.

There is also a manual update option under Virus and threat protection updates so you can force a definition update without waiting for the automatic schedule.

**Question: Specifically, what is turned off that Windows is notifying you to turn on?** `Real-time protection`

---

## Task 5 — Firewall and Network Protection {#task-5}

A firewall controls what traffic is allowed to pass through the ports on your device. Think of ports as doors into and out of your computer. The firewall is the bouncer checking what is trying to come in or go out and deciding whether to let it through.

Windows Defender Firewall has three profiles and each one is meant for a different type of network.

Domain profile is used when your machine is connected to a network where it can authenticate against a domain controller. This is the corporate network scenario.

Private profile is what you set manually for networks you trust, like your home network.

Public profile is the default for any network you have not specifically marked as trusted. If you connect to airport Wi-Fi, coffee shop Wi-Fi, or any random network, this is the profile that activates. It is the most restrictive of the three which makes sense because you do not know what else is on that network.

If you click into any of the three profiles you get two options: turn the firewall on or off for that profile, and block all incoming connections. Leave the firewall on unless you have a very specific reason to turn it off.

You can also manage which apps are allowed through the firewall. Under Allow an app through firewall you can see which applications have permissions on which profiles and adjust them.

For more advanced stuff there is the Windows Defender Firewall with Advanced Security, which you can open with `WF.msc`. That is where you create custom inbound and outbound rules. It is a bit more involved but worth knowing it exists.

**Question: If you were connected to airport Wi-Fi, what most likely will be the active firewall profile?** `Public network`

---

## Task 6 — App and Browser Control {#task-6}

This section is about Microsoft Defender SmartScreen. SmartScreen's job is to protect you from phishing sites, malware sites, dodgy apps, and suspicious file downloads.

The main setting you will see is the status for Check apps and files. This can be set to Block, Warn, or Off. Warn means it will flag something and ask you what you want to do. Block just stops it outright. Off means SmartScreen is not doing anything at all.

There is also an Exploit protection section here. Exploit protection is built into Windows 10 and Windows Server 2019 and it is designed to protect your device against attacks that try to exploit software vulnerabilities. The default settings are fine and the room specifically says to leave them alone unless you know exactly what you are changing.

---

## Task 7 — Device Security {#task-7}

This one is a short task about the hardware level security features in Windows. Most people will never touch these settings.

Core isolation has a feature called Memory Integrity. When this is on it stops attacks from sneaking malicious code into high security processes. Again, leave the defaults alone here unless you have a reason to change them.

The more interesting thing covered in this task is the Trusted Platform Module, or TPM.

TPM is a physical chip that lives on your motherboard. It is a secure crypto-processor, meaning its whole job is to handle cryptographic operations. Things like storing encryption keys securely, verifying that the system has not been tampered with, and providing hardware based security functions that software alone cannot fake. Because it is hardware, malicious software cannot tamper with it the way it might be able to manipulate a software based security solution. It is used by things like BitLocker (covered in the next task) and Windows Hello.

**Question: What is the TPM?** `Trusted Platform Module`

---

## Task 8 — BitLocker {#task-8}

BitLocker is Windows' built in drive encryption feature. It encrypts the entire drive so that if someone steals your laptop or pulls the drive out of your machine, they cannot read anything on it without the key. Microsoft specifically describes it as addressing threats from lost, stolen, or improperly disposed of computers.

BitLocker works best when the machine has a TPM chip. When TPM is present, BitLocker uses it to store the encryption key securely and also verifies that the system has not been messed with while it was powered off. If everything checks out at boot, the drive unlocks automatically. You do not have to do anything.

On machines without TPM version 1.2 or later, BitLocker can still work but you need a removable drive that contains a startup key. You plug it in at boot and that is what unlocks the drive instead of the TPM doing it automatically.

The VM does not have BitLocker available so there is nothing to poke at here, just read through it.

**Question: We should use a removable drive on systems without a TPM version 1.2 or later. What does this removable drive contain?** `startup key`

---

## Task 9 — Volume Shadow Copy Service {#task-9}

The Volume Shadow Copy Service, or VSS, is a Windows feature that creates snapshots of your data at a specific point in time. These snapshots are called shadow copies. The idea is that you can use them to restore files or the entire system to an earlier state if something goes wrong.

Shadow copies are stored in the System Volume Information folder on each drive that has protection enabled. If VSS is running and System Protection is turned on, you get access to things like creating restore points, performing a system restore, configuring restore settings, and deleting old restore points.

This is relevant from a security angle too and not in a good way. Ransomware authors know about VSS. A lot of ransomware is specifically coded to find shadow copies and delete them before or after encrypting your files. The reason is obvious: if your shadow copies are gone you cannot just restore from a snapshot, which means you are stuck and more likely to pay the ransom. The way around this is offline or off-site backups that the ransomware cannot reach.

**Question: What is VSS?** `Volume Shadow Copy Service`

---

## Task 10 — Conclusion {#task-10}

That is Windows Fundamentals 3 done, and with it the whole Windows Fundamentals module wrapped up.

This room went through the main security tools that come built into Windows. Windows Update for keeping the system patched, Windows Security as the central dashboard, Virus and Threat Protection with Defender, the Firewall and its three profiles, SmartScreen in App and Browser Control, Device Security with TPM and Memory Integrity, BitLocker for drive encryption, and VSS for snapshots and restore points.

There is a lot more to Windows than what these three rooms cover but this is a solid foundation.

One last thing the room mentions is worth keeping in mind for the future. Attackers do not always bring their own tools. A lot of the time they use the stuff that is already on the machine, the built in Windows utilities, to move around and do damage without triggering alerts. This is called Living Off The Land, and knowing what these tools are and what they do is part of understanding how that kind of attack works.

---