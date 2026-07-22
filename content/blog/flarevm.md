---
title: "FlareVM: Arsenal of Tools — TryHackMe Cyber Security 101"
date: 2026-07-16
category: "writeup"
excerpt: "Walkthrough of TryHackMe's FlareVM: Arsenal of Tools room — Learn the arsenal of investigative tools in FlareVM."
image: "/images/blog/141.png"
readtime: "25 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Arsenal of Tools](#task-2)
- [Task 3 — Commonly Used Tools for Investigation](#task-3)
- [Task 4 — Analyzing Malicious Files](#task-4)
- [Task 5 — Conclusion](#task-5)

---

## Task 1 — Introduction {#task-1}

FlareVM is basically what REMnux is but for Windows. Same idea, different OS. It's a Windows machine pre-loaded with a giant pile of tools for reverse engineers, malware analysts, incident responders, forensic investigators, and pentesters. Built by the FLARE team at FireEye (now Mandiant/Google), and the name stands for "Forensics, Logic Analysis, and Reverse Engineering".

The reason FlareVM exists is the same reason REMnux exists. Setting up a Windows analysis lab from scratch is awful. You need a hundred tools, half of them have weird licenses or installers, and you have to keep them updated. FlareVM does all that for you. Boot it up, everything's there.

In this room we walk through what's in the box, then use a handful of the most common tools to analyze some suspicious files.

---

## Task 2 — Arsenal of Tools {#task-2}

The room goes through a big list of tools grouped by category. I'm not going to repeat every single one verbatim because that's just reading a list back at you, but here's the categories and the key players in each.

**Reverse Engineering & Debugging**. Taking finished binaries apart to understand how they work. The heavy hitters are Ghidra (NSA-built, free, surprisingly good), x64dbg (open source debugger for 32-bit and 64-bit binaries), OllyDbg (older but still around for 32-bit), Radare2 (the unix-y one), Binary Ninja (commercial, slick), and PEiD (detects packers, cryptors, compilers).

**Disassemblers & Decompilers**. Turn machine code back into something readable. CFF Explorer for editing/analyzing PE files. Hopper for disassembling and decompiling. RetDec, an open-source decompiler.

**Static & Dynamic Analysis**. Static is looking at the file without running it. Dynamic is watching what it does when it runs. Process Hacker is a beefier Task Manager that lets you poke at process memory. PEview shows you the structure of PE files. Dependency Walker shows what DLLs an executable depends on. DIE (Detect It Easy) detects packers and cryptors.

**Forensics & Incident Response**. Volatility (memory forensics, same one REMnux has), Rekall (similar to Volatility), FTK Imager (disk imaging and analysis).

**Network Analysis**. Wireshark for packet capture and traffic analysis, Nmap for network mapping and vuln scanning, Netcat for raw network read/write.

**File Analysis**. FileInsight, Hex Fiend, HxD. Hex editors for poking at binary files. HxD is the one most people use on Windows because it's fast and free.

**Scripting & Automation**. Python and PowerShell Empire. Python for general automation, Empire for post-exploitation PowerShell frameworks.

**Sysinternals Suite**. The classic Microsoft sysadmin tools. Autoruns (shows what runs at boot), Process Explorer (better Task Manager), Process Monitor (real-time logging of process/registry/file activity). These three alone are reason enough to like FlareVM.

That's a lot of tools. The point of this task isn't to learn all of them, it's to know what's in the toolbox so you can grab the right thing for the right job.

**Which tool is an Open-source debugger for binaries in x64 and x32 formats?** `x64dbg`

**What tool is designed to analyze and edit Portable Executable (PE) files?** `CFF Explorer`

**Which tool is considered a sophisticated memory editor and process watcher?** `Process Hacker`

**Which tool is used for Disc image acquisition and analysis for forensic use?** `FTK Imager`

**What tool can be used to view and edit a binary file?** `HxD`

---

## Task 3 — Commonly Used Tools for Investigation {#task-3}

Out of that whole list, the ones you'll touch most often in the early phase of an investigation are these. The room calls them out specifically and we'll use them in the hands-on bit later.

### Process Monitor (Procmon)

Real-time logging tool. Watches the file system, registry, processes, and threads as stuff happens. When you run a suspicious binary you'd run Procmon at the same time and then go back and see exactly what files it touched, what registry keys it wrote, what processes it spawned. The output volume is INSANE so you have to filter aggressively, but it's the closest thing to a security camera on Windows internals.

In the example screenshot the room shows, you see `lsass.exe` reading `lsasrv.dll`. That's normal, LSASS is the Local Security Authority Subsystem and it loads authentication-related DLLs all day. But if you saw a non-LSASS process trying to read LSASS memory, that's a screaming Mimikatz-style credential dumping alert. Procmon catches that kind of thing.

### Process Explorer (Procexp)

Souped-up Task Manager. Shows running processes in a parent/child tree, what user owns each one, what DLLs they've loaded, what files they have open. If you ever wanted to know "which process is locking this file", Procexp tells you. It's a Sysinternals tool by Mark Russinovich, who has basically saved every IT person on Earth at least once.

The parent/child view is gold. A `cmd.exe` spawned by `explorer.exe` is normal. A `cmd.exe` spawned by `winword.exe` is suspicious as hell because why is Word launching a command prompt? That's macro-dropper behavior.

### HxD

Hex editor. Lets you look at and edit any file as raw bytes. Useful for spotting file types by their magic bytes. The room shows an example where a file called `possible_medusa.txt` (the `.txt` is misleading) starts with `4D 5A` in its first two bytes. That's "MZ" in ASCII which is the magic number for a Windows executable. So the file is an .exe pretending to be a text file. Classic.

HxD also has a Data Inspector panel that takes whatever byte you've highlighted and shows you what it'd be as an integer, a float, a string, etc. Useful for understanding structures inside the file.

### CFF Explorer

PE file editor and viewer. PE is Portable Executable, the format Windows uses for .exe and .dll files. CFF Explorer cracks one open and shows you everything about it. Headers, sections, imports, exports, resources, hashes (MD5, SHA-1, SHA-256). Great for quickly grabbing file info or noticing weird stuff like the file being compiled with an unusual compiler.

### Wireshark

Network traffic analyzer. Captures packets, lets you filter and inspect them. If you let malware run and Wireshark is capturing, you see every packet it tries to send. Even encrypted TLS traffic gives you the destination IP and SNI hostname, so you can identify C2 servers even without decrypting the payload.

### PEStudio

Static analysis tool specifically for PE files. You load a binary in and it tells you everything potentially interesting about it. Hashes, entropy, imports, strings, suspicious indicators. Color-coded so red things jump out at you. One of the best "first look" tools for an unknown binary.

The example the room shows is `PsExec.exe` (the legit Sysinternals tool). PsExec is interesting because it's totally legit when an admin uses it, but it's also a favorite of attackers for lateral movement. PEStudio flags it as suspicious not because PsExec itself is malware but because the indicators it has (remote execution capabilities, etc.) match what malware often does. False positive in this case but the tool is doing its job.

### FLOSS

FLARE Obfuscated String Solver. Same idea as the `strings` utility on Linux but smarter. Regular strings just dumps every printable sequence of bytes. FLOSS additionally tries to detect and de-obfuscate strings that are decoded at runtime, like strings that are XOR'd in the binary and only become readable after the program decrypts them. This is huge for malware analysis because malware authors love obfuscating their strings to hide C2 URLs and indicators.

The room shows running FLOSS on `cobaltstrike.exe` and getting 189 static strings, 0 decoded strings. The 0 decoded is interesting because Cobalt Strike beacons usually have heavily obfuscated strings, so either FLOSS missed them or the sample uses a technique FLOSS doesn't handle. Worth checking with another tool.

**Which tool was formerly known as FireEye Labs Obfuscated String Solver?** `FLOSS`

**Which tool offers in-depth insights into the active processes running on your computer?** `Process Explorer`

**By using the Process Explorer (procexp) tool, under what process can we find smss.exe?** `System`

**Which powerful Windows tool is designed to help you record issues with your system's apps?** `Procmon`

**Which tool can be used for Static analysis or studying executable file properties without running the files?** `PEStudio`

**Using PEStudio to open cryptominer.bin, what is the sha256 value of the file?** `E9627EBAAC562067759681DCEBA8DDE8D83B1D813AF8181948C549E342F67C0E`

**How many functions does cryptominer.bin have?** `102`

**What tool can generate file hashes for integrity verification, authenticate the source of system files, and validate their validity?** `CFF Explorer`

**Using CFF Explorer to open possible_medusa.txt, what is the MD5 of the file?** `646698572AFBBF24F50EC5681FEB2DB7`

**Using CFF Explorer, go to the DOS Header Section. What is the e_magic value?** `5A4D`

The `5A4D` is the little-endian version of `4D 5A` which is "MZ" again. That's the PE magic number. The DOS header always starts with this, which is why every Windows executable begins with those two bytes. The "MZ" stands for Mark Zbikowski, one of the original MS-DOS architects, which is the kind of obscure trivia that makes Windows internals fun.

---

## Task 4 — Analyzing Malicious Files {#task-4}

Now the hands-on part. We're working with two files in `C:\Users\Administrator\Desktop\Sample`: `windows.exe` and `cobaltstrike.exe`.

The scenario is that someone downloaded `windows.exe` at 3:43 AM on 09/24/2024 and it got flagged. We need to figure out what it is.

### PEStudio on windows.exe

Open the file in PEStudio. First things to look at:

**Hashes**. MD5 is `9FDD4767DE5AEC8E577C1916ECC3E1D6`, SHA-1 is `A1BC55A7931BFCD24651357829C460FD3DC4828F`. Real life, you'd paste these into VirusTotal to see if anyone's seen this file before. If nobody has, it might be a brand new sample.

**File description**. The file claims to be related to the Windows Registry Editor (REGEDIT). That's a problem because real REGEDIT lives at `C:\Windows\System32\regedt32.exe`. A file in a download folder that claims to be regedit is sus by definition. This is masquerading, T1036 in MITRE ATT&CK.

**Russian text in the metadata**. "Редактор реестра" means "Registry Editor" in Russian. "Операционная система Microsoft® Windows®" means "Microsoft Windows Operating System". If your org isn't a Russian-speaking environment, finding Russian strings in a file claiming to be a Microsoft tool is interesting. Doesn't prove anything, but worth noting.

**No rich header**. The "rich header" is a Microsoft compiler signature embedded in most legitimate Windows executables. If it's missing, the file was either compiled with a non-Microsoft toolchain (possible but uncommon) or the rich header was stripped out (suspicious, often done to make analysis harder).

**Entropy is 7.999**. Entropy measures how "random" the bytes in the file are. Normal compiled code has entropy around 5-6. Encrypted or packed data has entropy approaching 8 (the theoretical max). A value of 7.999 means this file is almost certainly packed or encrypted. Which is a HUGE indicator of malware because legitimate software very rarely needs to be packed.

**Imports / Functions tab**. PEStudio shows the API calls the executable imports. The "blacklist" sort puts the suspicious ones at top. Some standouts:

- `set_UseShellExecute`. Lets the process spawn other processes via the OS shell. Common in malware that needs to launch additional commands.
- `CryptoStream`, `RijndaelManaged`, `CipherMode`, `CreateDecryptor`. These are all .NET cryptography APIs, specifically for AES (Rijndael is the algorithm AES is based on). Malware uses crypto for many reasons. Encrypting C2 traffic, encrypting their own strings, or in the case of ransomware, encrypting victim files. Seeing these in an unknown binary is a flag.

**Manifest tab**, look at the administrator section. The `requestedExecutionLevel` is `requireAdministrator`. Means this binary will trigger UAC and demand admin privileges to run. Real REGEDIT doesn't need admin for everything it does, so this is another reason to be suspicious.

### FLOSS on windows.exe

Open PowerShell, navigate to the Sample folder. First time you open PowerShell on this VM it might take a minute to spawn, be patient.

```powershell
PS C:\Users\Administrator\Desktop\Sample> FLOSS.exe .\windows.exe > windows.txt
```

The `>` redirects the output to a text file so you can read it instead of watching it scroll past in the terminal. FLOSS warns that .NET string deobfuscation isn't supported, which tells you this is a .NET binary. Good to know.

Open `windows.txt` and scroll to the bottom. You'll see a bunch of the same API names you saw in PEStudio. `set_UseShellExecute`, `RijndaelManaged`, all of them. Cross-confirms what PEStudio showed. This is the value of using two tools, neither has to be 100% right because if both agree, you're more confident.

### Process Explorer + Process Monitor on cobaltstrike.exe

Different file, different approach. `cobaltstrike.exe` we're going to RUN and watch it. The goal is to see if it phones home to a C2 server.

Run `cobaltstrike.exe` by double-clicking it. Then open Process Explorer from the desktop or search bar.

In Procexp you should see `cobaltstrike.exe` running with PID 4756 (or whatever, different on your machine). The parent process is `explorer.exe` because we launched it by double-clicking. So the tree is `explorer.exe → cobaltstrike.exe`. That's expected for a manual launch. If the parent had been something weird like `winword.exe` or `svchost.exe`, that'd be suspicious.

Right-click the cobaltstrike.exe process in Procexp, select Properties, go to the TCP/IP tab. This shows you every network connection the process currently has open. There you'll see a connection out to a remote IP. That's the C2 server.

### Verify with Procmon

Trust but verify. One tool's output isn't enough. Stop cobaltstrike.exe, then open Procmon. Procmon shows EVERY filesystem and registry and process event happening on the entire system, which is way too much, so filter it.

Click the filter icon (or press CTRL+L), then:

1. Pick "Process Name" from the first dropdown
2. Pick "contains" from the second
3. Type `cobalt` in the value field
4. Make sure the action is "Include"
5. Click Add, then Apply

Now Procmon only shows events involving processes whose name contains "cobalt". Run cobaltstrike.exe again and watch.

You'll see TCP Connect events showing it reaching out to `47.120.46.210` on port `81`. Same IP Procexp showed, confirmed by a different tool. Now you have a verified C2 IP and port that you can hand to your incident response team to block at the firewall and hunt for in your network logs.

The reason port 81 is interesting: it's HTTP-adjacent but not the default. Sometimes malware uses non-standard ports to slip past basic detection that only looks at port 80/443/53. Worth flagging.

### Imphash

The Imphash (Import Hash) is a hash calculated from the list of imported functions in a PE file. The cool thing about imphashes is that two pieces of malware compiled from the same source code will have the same imphash, even if the file hashes are different. So if you see `cobaltstrike.exe` has imphash `92EEF189FB188C541CBD83AC8BA4ACF5`, you can pivot off that and search for other samples with the same imphash. They're probably from the same campaign or family.

**Using PEStudio, open windows.exe. What is the entropy value?** `7.999`

**What is the value under requestedExecutionLevel?** `requireAdministrator`

**Which function allows the process to use the operating system's shell to execute other processes?** `set_UseShellExecute`

**Which API starts with R and indicates that the executable uses cryptographic functions?** `RijndaelManaged`

**What is the Imphash of cobaltstrike.exe?** `92EEF189FB188C541CBD83AC8BA4ACF5`

**What is the defanged IP address to which the process cobaltstrike.exe is connecting?** `47[.]120[.]46[.]210`

**What is the destination port number used by cobaltstrike.exe when connecting to its C2 IP Address?** `81`

**What is the parent process of cobaltstrike.exe?** `explorer.exe`

---

## Task 5 — Conclusion {#task-5}

That's FlareVM. Same idea as REMnux but for Windows binaries, which is what most malware out there is. The Windows-native toolset matters because a lot of malware is built specifically to run on Windows and looks weird or doesn't run right on Linux.

A few things from doing this room.

One, **PEStudio is the single best "first look" tool on Windows**. Whenever you have a suspicious PE file, drop it in PEStudio first. Hashes, entropy, suspicious imports, version info, all in one place. The red color coding does a lot of the thinking for you.

Two, **high entropy = packed or encrypted**. Entropy above 7 means the bytes are very random. Normal compiled code is around 5-6. If a binary has entropy near 8, it's almost certainly packed. Packers exist for legitimate reasons (size reduction, license protection) but they're way more common in malware than legit software, so it's an instant flag.

Three, **always use multiple tools to confirm findings**. I keep saying this in these writeups because it's that important. PEStudio + FLOSS both showing the same suspicious APIs is way stronger evidence than either alone. Procexp + Procmon both showing the same C2 IP is way stronger than either alone.

Four, **the parent/child process relationship is huge**. A `cmd.exe` from `explorer.exe`? Normal. A `cmd.exe` from `winword.exe`? Malware. Procexp's tree view makes this visible at a glance. Get used to looking for weird parents.

Five, **Procmon filtering will save your sanity**. Default Procmon shows millions of events. Filter by process name, by operation type, by path, whatever. Filtering down to just what you care about is the difference between "Procmon is amazing" and "Procmon is unusable".

Six, **imphash is a malware family fingerprint**. Even when file hashes change between samples, the imphash often stays the same within a malware family because they're built from the same source. Note the imphash whenever you analyze something and you'll start spotting connections between samples.

Seven, **non-standard ports are a hint**. Port 81 instead of 80, port 8443 instead of 443, port 4444 random anything. Legit services usually use well-known ports. Malware sometimes goes non-standard to dodge basic detection.

FlareVM and REMnux together cover most of what you need for malware analysis. FlareVM for Windows binaries (most malware), REMnux for cross-platform stuff and memory analysis. Both pre-built so you can spend your time analyzing instead of installing tools. Onto the next room.

---
