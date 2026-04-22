---
title: "Nmap: The Basics — TryHackMe Cyber Security 101"
date: 2026-04-22
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Nmap: The Basics room — Learn how to use Nmap to discover live hosts, find open ports, and detect service versions."
image: "/images/blog/90.png"
readtime: "32 min read"
draft: false
---

# Nmap: The Basics

You are on a network. Maybe it is a lab network, maybe it is a CTF, maybe it is a pentest. The question is always the same: what is out there, and what is it running? You could sit there manually pinging IP addresses one by one. You could try telnetting to every port like it is 1995. Or you could just use Nmap. One of my favorite tools.

Nmap has been around since 1997. That is almost 30 years of people finding it useful, which should tell you something. This room covers the core stuff: finding live hosts, scanning ports, detecting service versions, controlling scan speed, and saving your results.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Host Discovery: Who Is Online](#task-2)
- [Task 3 — Port Scanning: Who Is Listening](#task-3)
- [Task 4 — Version Detection: Extract More Information](#task-4)
- [Task 5 — Timing: How Fast is Fast](#task-5)
- [Task 6 — Output: Controlling What You See](#task-6)
- [Task 7 — Conclusion and Summary](#task-7)

---

## Task 1 — Introduction {#task-1}

The problem this room is addressing is a real one. You are connected to a network and you need to know two things: which devices are alive on that network, and what services are those devices running. Sounds simple. In practice, doing it without the right tool is a nightmare.

The manual approach is painful. To check which hosts are alive on a `/24` network, you have 254 IP addresses to check. You could use `ping`, but if the target has a firewall blocking ICMP traffic, ping just returns nothing and you have no idea if the host is up or just ignoring you. You could use `arp-scan`, but that only works if you are on the same local network, so forget it if there is a router in the way. You end up burning a lot of time and still not being sure about your results.

Then there is the service discovery problem. Even once you know a host is alive, you need to figure out what it is running. You could telnet to every port manually. There are 65,535 of them on TCP alone. Even with a script automating the attempts, that is a lot of waiting around. It is not a good time.

Nmap solves both of these problems. It is open source, it is flexible, and it has been tested and improved for nearly three decades. This room focuses on the essentials: discovering live hosts, scanning for open ports, detecting service versions, controlling timing, and formatting output.

The room also notes that you should ideally know your way around the TCP/IP model before starting. If you have gone through the Networking Concepts, Networking Essentials, Networking Core Protocols, and Networking Secure Protocols rooms already, you are in good shape.

---

## Task 2 — Host Discovery: Who Is Online {#task-2}

Before you can do anything useful, you need to know who is actually online. Nmap's `-sn` option handles this. It is described as a ping scan, but it is smarter than a regular `ping` command, as you will see.

**Specifying your targets**

Nmap gives you a few ways to define what you want to scan:

- IP range with `-`: `192.168.0.1-10` scans everything from `.1` to `.10`
- Subnet notation: `192.168.0.1/24` covers the whole `/24` block
- Hostname: just pass something like `example.thm` directly

**Scanning a local network**

When you are directly connected to the network you are scanning, whether over Ethernet or WiFi, Nmap can do something clever. It sends ARP requests to each address. ARP is a layer 2 protocol, which means it does not care about firewalls or ICMP blocking. If a device is on the network, it will respond to an ARP request. That response is what Nmap uses to mark the host as up.

The bonus here is that ARP responses include MAC addresses. From a MAC address you can look up the vendor, which gives you a hint about what kind of device you are looking at. A Tuya Smart MAC suggests an IoT device. An Espressif MAC suggests something like an ESP32 microcontroller. Useful context.

```shell
sudo nmap -sn 192.168.66.0/24
```

The example output in the room shows 7 hosts up on a `/24` network, with MAC addresses and vendor names listed for each one.

**Scanning a remote network**

Now imagine the target network is on the other side of one or more routers. You cannot send ARP requests through a router, so Nmap has to change its approach. Instead it sends a combination of things: ICMP echo requests, ICMP timestamp requests, TCP SYN packets to port 443, and TCP ACK packets to port 80. If anything comes back, the host is up.

The room shows an example where `192.168.11.1` replied to an ICMP echo request right away. `192.168.11.2` got hit with all of those probes and replied to none of them, so it was marked as down. Five hosts ended up being reachable in that scan.

**List scan**

If you want to double check your target list before scanning anything, `-sL` lists all the IP addresses Nmap would scan without sending a single probe. Good for sanity checking before you kick off a big scan.

```shell
nmap -sL 192.168.0.1/24
```

One thing worth knowing: throughout this room, everything is run with `sudo` or as root. The reason matters. Without root privileges, Nmap cannot craft certain types of packets. You end up stuck with basic scan types and lose a lot of the tool's capability. Just use `sudo`.

**Question: What is the last IP address that will be scanned when your scan target is `192.168.0.1/27`?** `192.168.0.31`

---

## Task 3 — Port Scanning: Who Is Listening {#task-3}

Okay so now you know which hosts are alive. The next step is figuring out what services they are running, and to do that you need to scan their ports. TCP has 65,535 ports. UDP has another 65,535. You are not checking all of those manually.

**Connect scan (`-sT`)**

The most straightforward approach is the connect scan. Nmap tries to complete a full TCP three-way handshake with each port. SYN goes out, if the port is open the target replies with SYN-ACK, then Nmap sends ACK to complete the connection, and then immediately tears it down with RST-ACK. If the port is closed the target just replies with RST-ACK right away and Nmap moves on.

This works reliably but it does leave logs on the target. A completed TCP connection is something most systems will record.

```shell
nmap -sT MACHINE_IP
```

**SYN scan (`-sS`)**

The SYN scan is sometimes called a stealth scan and it is the default when running with root privileges. Instead of completing the three-way handshake, Nmap only sends the SYN packet. If the port is open, the target replies with SYN-ACK. At that point Nmap knows the port is open, sends a RST to kill the connection, and never actually establishes it. Because the connection is never completed, fewer logs tend to get written.

On a closed port, the behaviour is the same as with a connect scan: the target just replies with RST-ACK immediately.

```shell
sudo nmap -sS MACHINE_IP
```

**UDP scan (`-sU`)**

A lot of important services run on UDP. DNS uses it, DHCP uses it, NTP uses it, SNMP uses it. UDP is connectionless so there is no handshake to work with. Nmap sends UDP packets to each port. Closed ports typically reply with an ICMP destination unreachable message. Open ports may or may not reply depending on the service. This makes UDP scanning slower and less definitive than TCP scanning, but it is worth doing if you want a complete picture.

```shell
sudo nmap -sU MACHINE_IP
```

**Limiting the ports you scan**

By default Nmap scans the 1,000 most common ports. That covers a lot of ground but it is not everything. You have a few options:

`-F` scans only the 100 most common ports, which is faster

`-p10-1024` scans a specific range

`-p-` scans every single port from 1 to 65535, which takes a while but misses nothing

`-p1-1023` covers the well-known ports, which is often enough

**Question: How many TCP ports are open on the target system at MACHINE_IP?** `6`

**Question: Find the listening web server on MACHINE_IP and access it with your browser. What is the flag that appears on its main page?** `THM{SECRET_PAGE_38B9P6}`

---

## Task 4 — Version Detection: Extract More Information {#task-4}

Finding open ports is great. But knowing a port is open does not tell you much on its own. Port 22 being open tells you SSH is probably running. It does not tell you which SSH server, which version, or whether that version has known vulnerabilities. For that you need version detection.

**OS detection (`-O`)**

Adding `-O` tells Nmap to make an educated guess about the target's operating system. It looks at various indicators in the way the target responds to packets and tries to match them against a database of known OS fingerprints. The example in the room shows Nmap detecting Linux 4.15 to 5.8, when the actual version was 5.15. Not perfect, but close enough to be useful.

```shell
sudo nmap -sS -O MACHINE_IP
```

**Service and version detection (`-sV`)**

`-sV` adds a VERSION column to the output. Nmap probes open ports and tries to figure out exactly what software is listening and what version it is. The room shows it correctly identifying OpenSSH 8.9p1 on port 22. That kind of detail is genuinely useful. If a version is old enough to have public exploits, you want to know that before you start poking around.

```shell
sudo nmap -sS -sV MACHINE_IP
```

**The all-in-one option (`-A`)**

If you want OS detection, version scanning, traceroute, and a few other additions all at once, `-A` does it. It is noisier and slower than a plain port scan but it gives you a much more complete picture with one command.

```shell
sudo nmap -A MACHINE_IP
```

**Forcing the scan (`-Pn`)**

Here is a situation that will catch you out eventually. You run a scan against a host and Nmap comes back saying the host is down, so it skips the port scan entirely. But you know the host is up. What happened is that the target does not respond to the probes Nmap uses during host discovery, so Nmap assumes it is offline and does not bother scanning it.

`-Pn` tells Nmap to skip host discovery and just scan every target as if it were already confirmed to be up. It is slower because you are scanning hosts that might genuinely be down, but it saves you from missing targets that quietly ignore pings.

```shell
sudo nmap -sS -Pn MACHINE_IP
```

**Question: What is the name and detected version of the web server running on `MACHINE_IP`?** `lighttpd 1.4.74`

---

## Task 5 — Timing: How Fast is Fast {#task-5}

By default Nmap runs at a reasonable speed. But sometimes you need to go slower so you do not trigger alarms, and sometimes you want to go faster because you have a lot to cover and you know the network can handle it. Nmap gives you control over both.

**Timing templates**

There are six timing templates, numbered 0 to 5, with names that do a decent job of describing them:

- `T0` — paranoid. Extremely slow. The room measured it at 9.8 hours for 100 ports. Good if you are doing something where getting caught would be very bad.
- `T1` — sneaky. Still slow at 27.53 minutes for 100 ports, but more realistic for actual stealthy work.
- `T2` — polite. About 40 seconds for 100 ports. Slower than default to reduce load on the network and target.
- `T3` — normal. The default. About 0.15 seconds for 100 ports in the room's lab setup.
- `T4` — aggressive. Slightly faster than normal at 0.13 seconds. Good for stable, fast networks.
- `T5` — insane. Maximum speed, trades accuracy and reliability for raw pace.

You pick a template by number (`-T4`) or by name (`-T aggressive`). Both work the same way.

The difference between T0 and T3 is dramatic. The room shows screenshots of the packet timing at each level. At T0 Nmap waits 5 minutes between ports. At T1 it waits 15 seconds. At T2 it drops to 0.4 seconds. By T3 it is just going as fast as it can without thinking about it.

**Parallelism**

`--min-parallelism` and `--max-parallelism` let you control how many probes Nmap sends at the same time. By default Nmap manages this automatically. On a bad network with packet loss it might drop to one probe at a time. On a clean fast network it might run hundreds in parallel. You can override this if you know your network situation better than Nmap does.

**Rate control**

`--min-rate` and `--max-rate` let you set the minimum and maximum number of packets per second Nmap sends across the whole scan. Useful if you need to stay under a specific threshold to avoid triggering rate-based detection.

**Host timeout**

`--host-timeout` sets a maximum amount of time Nmap will spend waiting on a single host. If a host is responding very slowly and you do not want to wait forever, this caps the wait and moves on.

**Question: What is the non-numeric equivalent of `-T4`?** `-T aggressive`

---

## Task 6 — Output: Controlling What You See {#task-6}

Sometimes a scan takes a while and you are just sitting there watching a blank terminal wondering if anything is actually happening. Sometimes you finish a scan and then realise you forgot to save the results. Both of these situations are fixable.

**Verbosity**

Adding `-v` to your command gives you real-time updates as the scan runs. Instead of waiting for the whole thing to finish before seeing anything, you get output as Nmap moves through its stages. The room shows a comparison between a scan without `-v` and the same scan with it. The verbose version shows every stage: ARP ping scan, parallel DNS resolution, SYN stealth scan for each live host, open ports as they are discovered. It is a lot more useful when you are learning what Nmap is actually doing under the hood.

If `-v` is not enough, you can stack them: `-vv`, `-vvv`, `-v4`. You can even press `v` during a running scan to increase verbosity on the fly, which is a nice touch.

For even more detail, `-d` enables debugging output. That is a significant step up in noise level. `-d9` is the maximum and will absolutely flood your terminal with information. Only really useful if something is going wrong and you need to understand exactly what Nmap is doing at every step.

**Saving results**

Running a scan and not saving the output is a bad habit. You will want to refer back to it. Nmap gives you four output format options:

- `-oN filename` saves normal human-readable output to a file
- `-oX filename` saves XML output, which is good for importing into other tools
- `-oG filename` saves grepable output, which works nicely with `grep` and `awk` if you want to filter results from the command line later
- `-oA basename` saves all three formats at once, creating three files with `.nmap`, `.xml`, and `.gnmap` extensions

The `-oA` option is convenient when you are not sure which format you will need later. Just save all of them and sort it out afterwards.

**Question: What option must you add to your `nmap` command to enable debugging?** `-d`

---

## Task 7 — Conclusion and Summary {#task-7}

That is the room done. It covers a solid range of what Nmap can do, and honestly it only scratches the surface. There are four more rooms in TryHackMe's Network Security module dedicated entirely to Nmap if you want to go deeper.

One thing the room closes with is worth keeping in mind. When you run Nmap as a local user without `sudo`, you lose a lot. Nmap defaults to a connect scan (`-sT`) because it cannot craft raw packets without root privileges. SYN scans, OS detection, and a bunch of other features just stop working. Always run it with `sudo` unless you have a specific reason not to.

Here is a summary of everything covered:

- `-sL` — list scan, shows targets without actually scanning them
- `-sn` — ping scan, host discovery only
- `-sT` — TCP connect scan, completes the full three-way handshake
- `-sS` — TCP SYN scan, only the first step of the handshake, default with sudo
- `-sU` — UDP scan
- `-F` — fast mode, scans the 100 most common ports
- `-p[range]` — scan a specific port range, `-p-` scans everything
- `-Pn` — treat all hosts as online, skips host discovery
- `-O` — OS detection
- `-sV` — service and version detection
- `-A` — OS detection, version detection, and extras all at once
- `-T<0-5>` — timing template from paranoid to insane
- `--min-parallelism` and `--max-parallelism` — control parallel probes
- `--min-rate` and `--max-rate` — control packet rate
- `--host-timeout` — maximum wait time per host
- `-v` — verbose output, stackable with `-vv`, `-vvv`, etc.
- `-d` — debugging output, up to `-d9`
- `-oN` — normal output to file
- `-oX` — XML output to file
- `-oG` — grepable output to file
- `-oA` — all formats at once

**Question: What kind of scan will Nmap use if you run `nmap MACHINE_IP` with local user privileges?** `connect scan`

Nmap is one of those tools that just feels good to use. You type one command and suddenly you know things about a network that would have taken you forever to find manually. It has this satisfying quality where the more you learn about it, the more you realize how much more there is to learn. Easily one of my favorite tools.

---