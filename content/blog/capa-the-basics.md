---
title: "CAPA: The Basics — TryHackMe Cyber Security 101"
date: 2026-06-09
category: "writeup"
excerpt: "Walkthrough of TryHackMe's CAPA: The Basics room — Learn to use CAPA to identify malicious capabilities."
image: "/images/blog/136.png"
readtime: "50 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Tool Overview: How CAPA Works](#task-2)
- [Task 3 — Dissecting CAPA Results Part 1: General Information, MITRE and MAEC](#task-3)
- [Task 4 — Dissecting CAPA Results Part 2: Malware Behavior Catalogue](#task-4)
- [Task 5 — Dissecting CAPA Results Part 3: Namespaces](#task-5)
- [Task 6 — Dissecting CAPA Results Part 4: Capability](#task-6)
- [Task 7 — More Information, more fun!](#task-7)
- [Task 8 — Conclusion](#task-8)

---

## Task 1 — Introduction {#task-1}

Malware analysis. The whole problem with analyzing potentially malicious files is that to learn what they do, you sort of need to run them, and running them might wreck your machine. So you have two options. Dynamic analysis where you let the thing execute in a sandbox and watch what it does, or static analysis where you poke at the file without running it. This room is all about the static side, using a tool called CAPA.

CAPA stands for Common Analysis Platform for Artifacts. Built by the FireEye Mandiant team. The whole point is, you give it a binary (a PE file, an ELF, a .NET module, shellcode, even a sandbox report), and it tells you what the file is capable of doing. Stuff like "this thing makes HTTP requests", "this thing reads files", "this thing creates scheduled tasks for persistence". It does this by running a giant pile of rules against the file, each rule looking for specific patterns or strings or behaviors.

The big win here is that CAPA basically takes years of reverse engineering experience and bottles it up into a tool you can run with one command. You don't have to crack open Ghidra and stare at assembly to figure out what a binary does. CAPA does the first pass for you. You still want to dig deeper for real engagements, but as a starting point it's incredibly fast.

The room gives you a VM with CAPA already installed and a bunch of pre-processed report files because running CAPA against the sample binary takes several minutes and nobody wants to wait. The pre-processed files live in `C:\Users\Administrator\Desktop\capa` and we'll use those.

---

## Task 2 — Tool Overview: How CAPA Works {#task-2}

Running CAPA is genuinely simple. Open PowerShell, navigate to the directory with the binary, point capa at the file. That's it.

```powershell
PS C:\Users\Administrator\Desktop\capa> capa.exe .\cryptbot.bin
```

You'll see it load rules and start analyzing. This is the part where you sit there for a few minutes while it grinds through everything.

The room recommends you don't wait for the run to finish. They've pre-processed the result and dropped it in a file called `cryptbot.txt` in the same directory. Open a second PowerShell window and run:

```powershell
PS C:\Users\Administrator\Desktop\capa> Get-Content .\cryptbot.txt
```

This dumps the same output you'd have gotten if you waited. Way faster.

### The flags you'll use

There's three you really care about.

`-h` for help. Shows all the available options. Standard stuff.

`-v` for verbose. Gives you more detail than the default output but takes longer to run.

`-vv` for very verbose. The big one. Shows you the exact strings and conditions in each rule that matched. Takes WAY longer. We'll get to this in Task 7.

### What the default output looks like

You'll get something like this (this is the cryptbot.bin output):

```
┌─────────────┬────────────────────────────────────────────────────────────────────────────────────┐
│ md5         │ 3b9d26d2e7433749f2c32edb13a2b0a2                                                   │
│ sha1        │ 969437df8f4ad08542ce8fc9831fc49a7765b7c5                                           │
│ sha256      │ ae7bc6b6f6ecb206a7b957e4bb86e0d11845c5b2d9f7a00a482bef63b567ce4c                   │
│ analysis    │ static                                                                             │
│ os          │ windows                                                                            │
│ format      │ pe                                                                                 │
│ arch        │ i386                                                                               │
│ path        │ /home/strategos/Room-CAPA/cryptbot.bin                                             │
└─────────────┴────────────────────────────────────────────────────────────────────────────────────┘
```

Then a bunch more tables. MITRE ATT&CK tactics, MAEC categories, MBC behaviors, and at the bottom the Capability list with their Namespaces. Each table tells you something slightly different about what the binary does. The next several tasks dig into each of these.

For now just know the workflow is: run the tool, get the giant output, then go through each section.

**What command-line option would you use if you need to check what other parameters you can use with the tool? Use the shortest format.** `-h`

**What command-line options are used to find detailed information on the malware's capabilities? Use the shortest format.** `-v`

**What command-line options do you use to find very verbose information about the malware's capabilities? Use the shortest format.** `-vv`

**What PowerShell command will you use to read the content of a file?** `Get-Content`

---

## Task 3 — Dissecting CAPA Results Part 1: General Information, MITRE and MAEC {#task-3}

Now we start picking apart what CAPA told us.

### The first block: basic info

This is the easy one. Hashes (md5, sha1, sha256) so you can identify the file. Analysis type, which is `static` because we're not running it. OS context (Windows in this case). Format (`pe` for Portable Executable, the standard Windows binary format). Architecture (`i386` meaning 32-bit x86). And the path to the file.

That's literally just metadata. Nothing crazy here, but it's good to verify you're analyzing what you think you're analyzing. Wrong hash means wrong file.

### MITRE ATT&CK section

This is where it starts to get interesting. CAPA maps the behaviors it found to the MITRE ATT&CK framework, which is basically the industry standard catalogue of attacker tactics and techniques. If you don't know what MITRE ATT&CK is, the short version: it's a giant map of "here are the things attackers do, broken down by phase". Initial access, execution, persistence, defense evasion, exfiltration, all of it. Every technique has an ID like T1027.

The format CAPA uses is:

`ATT&CK Tactic::ATT&CK Technique::Technique Identifier`

Or if there's a sub-technique:

`ATT&CK Tactic::ATT&CK Technique::ATT&CK Sub-Technique::Technique Identifier.Sub-technique Identifier`

So when CAPA shows `Defense Evasion::Obfuscated Files or Information::T1027`, that reads as:

- Tactic: Defense Evasion
- Technique: Obfuscated Files or Information
- Technique ID: T1027

And when you see `Defense Evasion::Obfuscated Files or Information::Indicator Removal from Tools T1027.005`, it's the same but with a sub-technique tacked on:

- Tactic: Defense Evasion
- Technique: Obfuscated Files or Information
- Sub-Technique: Indicator Removal from Tools
- Identifier: T1027.005

The whole point of this mapping is so that when you find a suspicious file, you can immediately tell an incident responder "hey this thing is doing T1027.005, here's what the playbook says to look for". It speeds up triage massively because everyone speaks the same language.

### MAEC

MAEC stands for Malware Attribute Enumeration and Characterization. It's another standardized way to describe malware behaviors, separate from MITRE ATT&CK. There's overlap but it's a different angle.

CAPA mostly uses two MAEC values: Launcher and Downloader.

**Launcher** means the file does stuff like dropping additional payloads, setting up persistence, connecting to C2 servers, or executing specific functions. It's a "this thing kicks off other stuff" tag.

**Downloader** means the file fetches more payloads from the internet, pulls updates, runs secondary stages, grabs config files. Basically the first stage of a multi-stage attack chain.

For cryptbot.bin the MAEC value is `launcher`, which makes sense given what the rest of the report shows it doing (scheduled tasks, process creation, the whole package).

**What is the sha256 of cryptbot.bin?** `ae7bc6b6f6ecb206a7b957e4bb86e0d11845c5b2d9f7a00a482bef63b567ce4c`

**What is the Technique Identifier of Obfuscated Files or Information?** `T1027`

**What is the Sub-Technique Identifier of Obfuscated Files or Information::Indicator Removal from Tools?** `T1027.005`

**When CAPA tags a file with this MAEC value, it indicates that it demonstrates behaviour similar to, but not limited to, Activating persistence mechanisms?** `launcher`

**When CAPA tags a file with this MAEC value, it indicates that the file demonstrates behaviour similar to, but not limited to, Fetching additional payloads or resources from the internet?** `Downloader`

---

## Task 4 — Dissecting CAPA Results Part 2: Malware Behavior Catalogue {#task-4}

Now we get into MBC, which is yet another way to describe malware behaviors. Yes, there's a lot of overlapping frameworks in this space. ATT&CK, MAEC, MBC, they all kind of cover the same ground from different angles. Don't worry too much about it, just know that MBC is malware-specific and goes into a bit more detail on behaviors than ATT&CK does.

### The format

MBC entries come in two flavors:

`OBJECTIVE::Behavior::Method[Identifier]`

Example: `ANTI-STATIC ANALYSIS::Executable Code Obfuscation::Argument Obfuscation [B0032.020]`. Objective is Anti-static Analysis, Behavior is Executable Code Obfuscation, Method is Argument Obfuscation, Identifier is B0032.020.

`OBJECTIVE::Behavior::[Identifier]`

Example: `COMMUNICATION::HTTP Communication:: [C0002]`. Objective is Communication, Behavior is HTTP Communication, Identifier is C0002.

The first format has an extra Method (basically a sub-technique). The second doesn't.

### Objectives

These are the big buckets. The top level categories. They roughly map to ATT&CK tactics but with two extras specific to malware analysis: Anti-Behavioral Analysis and Anti-Static Analysis.

- **Anti-Behavioral Analysis** is the malware trying to dodge sandboxes and debuggers.
- **Anti-Static Analysis** is the malware trying to make static analysis harder. Obfuscation, packing, etc.
- **Collection** is gathering info from the target.
- **Command and Control** is calling home.
- **Credential Access** is stealing usernames and passwords.
- **Defense Evasion** is bypassing detection.
- **Discovery** is mapping out the environment.
- **Execution** is running commands.
- **Exfiltration** is sending stolen data out.
- **Impact** is the damage.
- **Lateral Movement** is spreading.
- **Persistence** is sticking around after reboot.
- **Privilege Escalation** is getting more access.

Most of these line up with what you'd expect.

### Micro-Objectives

These are smaller, more granular categories for behaviors that aren't necessarily malicious on their own but are commonly abused. Things like:

- **PROCESS**: anything to do with processes (create, terminate, set thread context, check mutex)
- **MEMORY**: allocate, change protection, free memory
- **COMMUNICATION**: DNS, FTP, HTTP, ICMP, SMTP traffic
- **DATA**: checking strings, compressing, encoding, decoding data

A messaging app might create a process and do HTTP communication. That's not malicious by itself. But when you see a binary doing process injection AND HTTP communication AND scheduled task creation AND obfuscation, that's when it adds up to malware.

In the CAPA output, both Objective and Micro-Objective show up in the same Objective column. CAPA doesn't visually separate them in the report.

### Behaviors and Micro-Behaviors

Same idea, one level down. Behaviors are the specific things being done. A few examples from the cryptbot output:

- **Virtual Machine Detection** (B0009) under Anti-Behavioral Analysis. Malware checking if it's in a VM.
- **Executable Code Obfuscation** (B0032) under Anti-Static Analysis. Code that's been intentionally obscured.
- **Command and Scripting Interpreter** (E1059) under Execution. Using cmd.exe, PowerShell, bash, python, etc. to run things.
- **File and Directory Discovery** (E1083) under Discovery. Searching for files.
- **Obfuscated Files or Information** (E1027) under both Anti-Static Analysis and Defense Evasion. Hiding data through encoding or encryption.

Micro-Behaviors include things like:

- **Allocate Memory** (C0007) under MEMORY
- **Create Process** (C0017) under PROCESS
- **HTTP Communication** (C0002) under COMMUNICATION
- **Check String** (C0019) under DATA
- **Encode Data** (C0026) under DATA, which covers base64 and XOR
- **Create Directory** (C0046), **Delete File** (C0047), **Read File** (C0051), **Writes File** (C0052) all under FILE SYSTEM

### Methods

Methods are sub-techniques attached to behaviors. They tell you HOW the behavior is being done.

For example under Encode Data:

- **Base64** is C0026.001
- **XOR** is C0026.002

Under Executable Code Obfuscation:

- **Argument Obfuscation** is B0032.020
- **Stack Strings** is B0032.017

Under HTTP Communication:

- **Read Header** is C0002.014

Under Obfuscated Files or Information:

- **Encoding-Standard Algorithm** is E1027.m02

So when CAPA tells you `DATA :: Encode Data::Base64 [C0026.001]`, it's telling you the binary does data encoding, specifically with Base64, and the identifier you can reference is C0026.001. The whole point of this structure is that you can describe what malware does in a precise way that other analysts will immediately understand.

**What serves as a catalogue of malware objectives and behaviours?** `Malware Behavior Catalogue`

**Which field is based on ATT&CK tactics in the context of malware behaviour?** `Objective`

**What is the Identifier of "Create Process" micro-behavior?** `C0017`

**What is the behaviour with an Identifier of B0009?** `Virtual Machine Detection`

**Malware can be used to obfuscate data using base64 and XOR. What is the related micro-behavior for this?** `Encode Data`

**Which micro-behavior refers to "Malware is capable of initiating HTTP communications"?** `HTTP Communication`

---

## Task 5 — Dissecting CAPA Results Part 3: Namespaces {#task-5}

Now we hit the last table in the output, the Capability and Namespace block. This is where CAPA shows you the specific rules that matched and groups them by category.

The format is:

`Capability(Rule Name) :: TLN(Top-Level Namespace)/Namespace`

Example: `reference anti-VM strings :: anti-analysis/anti-vm/vm-detection`

- Capability (or rule name): `reference anti-VM strings`
- Top-Level Namespace: `anti-analysis`
- Namespace: `anti-vm/vm-detection`

The Top-Level Namespace is the broad bucket. The Namespace is the more specific subfolder. And the Capability is the exact rule that fired.

### Top-Level Namespaces

CAPA groups its rules into top-level namespaces based on what kind of behavior they detect. Here are the ones you'll bump into:

- **anti-analysis**: rules that detect anti-analysis stuff like obfuscation, packing, anti-debugging, VM detection
- **collection**: rules for data gathering that malware tends to do before exfiltration
- **communication**: rules for network behavior, C2, data transmission
- **compiler**: rules that fingerprint which compiler built the binary
- **data-manipulation**: rules for things like encryption and encoding (string encryption, base64, XOR)
- **executable**: rules about properties of the executable file itself, like PE sections or debug info
- **host-interaction**: rules for how the binary interacts with the host. File reads/writes, process creation, registry access
- **impact**: rules for the damage. Remote access, exfiltration, destruction
- **internal**: rules used internally by CAPA, not really meant for analysts to look at directly
- **lib**: building blocks for other rules
- **linking**: rules around dynamic linking and loading external libraries
- **load-code**: rules for runtime code loading and injection
- **malware-family**: rules that fingerprint specific malware families
- **nursery**: a staging ground for rules that aren't quite polished yet. New rules live here until they graduate
- **persistence**: rules for how malware stays installed after reboot
- **runtime**: rules that identify the language or platform the binary runs on
- **targeting**: rules for behaviors aimed at specific targets (the example given is ATMs)

The Nursery one is interesting because it means even though CAPA found something with that rule, the rule itself might not be reliable yet. Treat Nursery matches with a bit of skepticism.

### How namespaces and rules connect

Each namespace has a bunch of YAML files inside it, one per rule. The rule's name is also the YAML filename with dashes instead of spaces.

So for the namespace `anti-analysis/anti-vm/vm-detection`, you'd find YAML files like:

- `reference-anti-vm-strings-targeting-virtualbox.yml`
- `reference-anti-vm-strings-targeting-virtualpc.yml`
- `reference-anti-vm-strings.yml`
- and more

Each of these is a separate rule that looks for specific patterns. When the rule matches, it shows up in the Capability column with the name `reference anti-VM strings targeting VirtualBox` (the YAML filename, minus the `.yml`, with spaces instead of dashes).

For the obfuscation namespace under anti-analysis you'd see rules like:

- `obfuscated-with-dotfuscator.yml`
- `obfuscated-with-smartassembly.yml`

Same pattern. Same idea.

**Which top-level Namespace contains a set of rules specifically designed to detect behaviours, including obfuscation, packing, and anti-debugging techniques exhibited by malware to evade analysis?** `anti-analysis`

**Which namespace contains rules to detect virtual machine (VM) environments? Note that this is not the TLN or Top-Level Namespace.** `anti-vm/vm-detection`

**Which Top-Level Namespace contains rules related to behaviours associated with maintaining access or persistence within a compromised system?** `persistence`

**Which namespace addresses techniques such as String Encryption, Code Obfuscation, Packing, and Anti-Debugging Tricks, which conceal or obscure the true purpose of the code?** `obfuscation`

**Which Top-Level Namespace Is a staging ground for rules that are not quite polished?** `Nursery`

---

## Task 6 — Dissecting CAPA Results Part 4: Capability {#task-6}

Continuing from Task 5, this task walks through specific capabilities found in the cryptbot output and shows the connection between each capability, its namespace, and the YAML rule that fired.

The pattern is always the same. Capability is the rule name (with spaces). Rule file is the same name with dashes and `.yml` on the end. Then it's nested under one or more namespace folders under a top-level namespace.

### A walkthrough example: "reference anti-VM strings"

- Rule file: `reference-anti-vm-strings.yml`
- Namespace: `anti-vm/vm-detection`
- Top-Level Namespace: `anti-analysis`

What this is telling you: CAPA found strings in the binary that look like the binary is checking whether it's running inside a VM. Stuff like "VMware", "VirtualBox", VM-related registry keys, driver names. Malware does this all the time because if it detects a VM it might just refuse to run, since VMs are usually analysts' sandboxes.

### Another example: "schedule task via schtasks"

- Rule file: `schedule-task-via-schtasks.yml`
- Namespace: `scheduled-tasks`
- Top-Level Namespace: `persistence`

This means CAPA saw the binary using the Windows `schtasks` command to register itself as a scheduled task. This is one of the classic persistence tricks. You schedule yourself to run at login, or every hour, or whenever, and now the malware survives reboots and keeps coming back.

### The "exceptions" thing

The room calls out a gotcha. Sometimes a Capability shows up listed under a Top-Level Namespace that doesn't contain its YAML file. The example is "reference cryptocurrency strings" which logically belongs under the Impact TLN, but if you go looking for the YAML file it's inside the Nursery TLN.

That's because Nursery is the staging area for rules that aren't fully polished, so even though a rule logically fits under Impact, it might still be sitting in Nursery until it gets reviewed properly. Don't panic if you can't find a rule file where you expect it. Check Nursery.

### Mapping a result back to plain English

Take this example:

```
┌─────────────────────────────────┬──────────────────────────────────┐
│ Capability                      │ Namespace                        │
├─────────────────────────────────┼──────────────────────────────────┤
│ reference Base64 string         │ data-manipulation/encoding/base64│
└─────────────────────────────────┴──────────────────────────────────┘
```

Reading that out:

- **Capability**: `reference Base64 string`. The binary references a Base64 string somewhere in its code.
- **Top-Level Namespace**: `data-manipulation`. Rules about transforming data.
- **Namespace**: `encoding/base64`. Rules specifically about Base64 encoding.
- **Rule file**: `reference-base64-string.yml`.

What it means in plain English: this binary appears to use Base64 encoding for something. Could be encoding C2 traffic, could be encoding stolen data, could be just decoding its own strings. CAPA doesn't tell you the WHY, just the WHAT. You still have to reverse engineer to figure out the motive.

**What rule yaml file was matched if the Capability or rule name is check HTTP status code?** `check-http-status-code.yml`

**What is the name of the Capability if the rule YAML file is reference-anti-vm-strings.yml?** `reference anti-VM strings`

**Which TLN or Top-Level Namespace includes the Capability or rule name run PowerShell expression?** `load-code`

**Check the conditions inside the check-for-windows-sandbox-via-registry.yml rule file. What is the value of the API that ends in Ex is it looking for?** `RegOpenKeyEx`

---

## Task 7 — More Information, more fun! {#task-7}

Okay so the default CAPA output is useful but it's basically just "here's what we found". It doesn't tell you WHY each rule matched. Like, what specific string was in the binary that made the VM detection rule fire? You don't know from the default output. For that, you need verbose mode.

### -vv (very verbose)

This is the big one. Run:

```powershell
PS C:\Users\Administrator\Desktop\capa> capa -vv .\cryptbot.bin
```

And you get a giant report that includes the strings, API calls, and conditions inside each rule that matched. The output is something like 3000+ lines for cryptbot. It's a LOT.

Again, the room pre-processed this for you. The file is `cryptbot_vv.txt` in the same capa directory.

```powershell
PS C:\Users\Administrator\Desktop\capa> Get-Content .\cryptbot_vv.txt
```

If you open this in PowerShell you'll see a wall of text. Trying to navigate this in a terminal or even a normal text editor is brutal. It works but it sucks. Which brings us to the better way.

### The JSON option

If you add `-j` to the command you can dump the verbose output as JSON instead of plain text:

```powershell
PS C:\Users\Administrator\Desktop\capa> capa.bin -j -vv .\cryptbot.bin > cryptbot_vv.json
```

JSON is structured, which means a tool can render it nicely. And conveniently there's a tool for exactly that.

### CAPA Web Explorer

This is the game changer. CAPA Web Explorer is a web-based interface that takes a CAPA JSON report and gives you a real UI to navigate it.

There's two ways to use it. Online at https://mandiant.github.io/capa/explorer/#/. Or offline, which the VM has set up already. There's a Chrome shortcut on the desktop called `capa_web_explorer_offline.html`. Heads up, the offline version sometimes takes up to a minute to load in Chrome on the VM. Be patient.

Once it's loaded, look for the **Upload from local** button at the bottom left. Upload the `cryptbot_vv.json` file. You'll get an interface where you can click through every capability and see the exact features that matched.

### What this gets you

Let's say you want to know what specifically triggered the "reference anti-VM strings targeting VMWare" rule. Click on it in the web explorer and you see the rule's full YAML, including all the strings it was looking for. The rule looks something like:

```yaml
rule:
  meta:
    name: reference anti-VM strings targeting VMWare
    namespace: anti-analysis/anti-vm/vm-detection
    ...
  features:
    - or:
      - string: /VMWare/i
      - string: /VMTools/i
      - string: /SOFTWARE\\VMware, Inc\.\\VMware Tools/i
      - string: /vmnet\.sys/i
      - string: /vmmouse\.sys/i
      - string: /vmusb\.sys/i
      ... (lots more)
```

And the web explorer shows you exactly which of those strings was found in the binary. So for example you'd see that "VMWare" specifically matched, which means the binary literally contains the word "VMWare" somewhere in its code. Which is suspicious because why would a normal program need to mention VMWare by name? It's checking for it.

Another example: the "schedule task via schtasks" rule:

```yaml
rule:
  meta:
    name: schedule task via schtasks
    namespace: persistence/scheduled-tasks
    ...
  features:
    - and:
      - match: host-interaction/process/create
      - or:
        - and:
          - string: /schtasks/i
          - string: /\/create /i
        - string: /Register-ScheduledTask /i
```

So this rule needs the binary to: create a process AND either contain both the strings "schtasks" and "/create " OR contain "Register-ScheduledTask ". If the rule fired in your output, you know the binary did all of that. Now you know it's not just creating processes, it's specifically creating processes that involve scheduled task commands.

This is the bit that turns CAPA from "interesting summary" into  useful evidence". When you're writing up a malware report you can say "the binary contains the strings X, Y, and Z that indicate it's checking for VMWare" instead of just "CAPA flagged anti-VM behavior". Much more credible.

### Global Search Box

The web explorer also has filters and a Global Search box that lets you find capabilities, namespaces, strings, anything across the whole report. With 3000+ lines of data this is essential. You're not scrolling through that by hand.

**Which parameter allows you to output the result of CAPA into a .json file?** `-j`

**What tool allows you to interactively explore CAPA results in your web browser?** `CAPA Web Explorer`

**Which feature of this CAPA Web Explorer allows you to filter options or results?** `Global Search Box`

---

## Task 8 — Conclusion {#task-8}

That's CAPA. Honestly one of the more underrated tools in the malware analysis world. It's not flashy, it doesn't crack open the binary and show you the assembly, but it gets you 80% of the way to "what does this thing do" with a single command.

A few takeaways from going through this room.

One, **CAPA is your first pass, not your only pass**. It tells you what the binary is capable of, not what it does at runtime. A file might "have the capability" to talk over HTTP but never do it on a specific run. For the full picture you still need dynamic analysis. Static and dynamic are complementary, not competitors.

Two, **don't wait for the tool to finish on big files**. CAPA takes minutes per binary. The room set this up well by pre-processing the output for us, but in your own work you'll want to start a run and go do something else while it cranks. Especially with `-vv`.

Three, **the verbose output is gold but unreadable in a terminal**. The Web Explorer fixes this completely. Once you have `-j -vv` output in JSON, just upload it and click around. No reason to ever read raw verbose output again unless you genuinely enjoy pain.

Four, **MAEC, MBC, MITRE ATT&CK all describe similar stuff in different words**. Don't get hung up trying to memorize the difference. You'll pick it up by exposure. The important thing is that CAPA maps to all of them so your report can speak to whoever you're reporting to in whatever framework they use.

Five, **Nursery namespace = treat with extra skepticism**. Those are rules that aren't fully baked. They might give you a useful hint or they might be a false positive. Verify with another method before putting them in a final report.

Six, **the rule name = the YAML filename with dashes for spaces**. Once you internalize this pattern, jumping from a Capability in the output to the rule definition is fast. Want to know what `reference cryptocurrency strings` is looking for? Open `reference-cryptocurrency-strings.yml`. Done.

CAPA isn't going to replace reverse engineering for real engagements. But for triaging a pile of suspicious files, mapping what they're up to, or building IOCs to share with your team, it's one of the fastest tools out there. Onto the next room.

---