---
title: "Wireshark: The Basics — TryHackMe Cyber Security 101"
date: 2026-04-20
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Wireshark: The Basics room — Learn the basics of Wireshark and how to analyse protocols and PCAPs."
image: "/images/blog/86.png"
readtime: "30 min read"
draft: false
---

# Wireshark: The Basics

If you have been following the networking series on TryHackMe, you have spent a good amount of time learning about protocols, how they work, and how most of them send everything in plain text. Now it is time to actually see that with your own eyes. This room is about Wireshark, the tool that lets you open up network traffic and look at exactly what is happening inside.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Tool Overview](#task-2)
- [Task 3 — Packet Dissection](#task-3)
- [Task 4 — Packet Navigation](#task-4)
- [Task 5 — Packet Filtering](#task-5)
- [Task 6 — Conclusion](#task-6)

---

## Task 1 — Introduction {#task-1}

Wireshark is an open-source, cross-platform network packet analyser. It can sniff live traffic from a network interface and also open saved packet capture files, which are called PCAPs. It is one of those tools that basically everyone in security ends up using at some point, whether you are troubleshooting something broken or investigating something suspicious.

The room gives you two files in the VM. The file `http1.pcapng` is there just to follow along with the screenshots in the room. The file `Exercise.pcapng` is what you actually use to answer the questions. Do not mix those up, otherwise you will spend a while wondering why your answers are wrong.

**Question: Which file is used to simulate the screenshots?** `http1.pcapng`

**Question: Which file is used to answer the questions?** `Exercise.pcapng`

---

## Task 2 — Tool Overview {#task-2}

Before you dive into any captures, the room walks you through what Wireshark actually is and how the interface is laid out. Worth paying attention to because Wireshark has a lot going on and it helps to know where everything lives before you start clicking around.

**What Wireshark is actually for**

The room lists a few main use cases. Detecting and troubleshooting network problems like congestion or load failures. Detecting security anomalies like rogue hosts, weird port usage, or suspicious traffic. And investigating protocol details, response codes, payloads, that kind of thing.

One thing the room makes very clear: Wireshark is not an IDS. It does not alert you to anything. It does not block anything. It does not modify packets. It just reads them and shows them to you. Whether that information means anything useful depends entirely on you, the analyst. Wireshark is a tool, not a brain.

**The interface**

When you open Wireshark without a file loaded, you see five main sections. The toolbar at the top has menus and shortcuts for all the main operations like filtering, sorting, exporting, and merging. Below that is the display filter bar, which is where you type queries to narrow down what you are looking at. Then there is a list of recently opened files, which is handy. Below that are the capture filter options and the available network interfaces, the actual connection points you can sniff on. And at the bottom is the status bar showing tool status, your current profile, and packet counts.

**Loading a PCAP**

You can load a file a few different ways: File menu, drag and drop, or double-clicking the file. Once a file is loaded, the interface splits into three panes. The packet list pane at the top shows a summary of every packet: source, destination, protocol, and some basic info. The packet details pane in the middle shows the full protocol breakdown of whatever packet you have selected. And the packet bytes pane at the bottom shows the raw hex and decoded ASCII of the selected packet, and it highlights the relevant bytes when you click on a field in the details pane.

**Packet colouring**

Wireshark colours packets to help you spot things easily. There are two types of colouring rules: temporary ones that only last for the current session, and permanent ones saved in your profile that persist between sessions. You can manage permanent rules through View > Coloring Rules. The default colouring scheme colour-codes packets by protocol type, which is why almost everything in the screenshots looks green. It is all HTTP.

**Sniffing live traffic**

The blue shark button starts a capture, the red button stops it, and the green button restarts. The status bar shows which interface you are sniffing on and how many packets have been collected so far.

**Merging PCAPs**

If you have two capture files you want to combine, File > Merge lets you pick a second file and merge it with the currently open one. Wireshark will show you the total packet count of the file you are importing. After merging, you need to save the result as a new file before working with it.

**Viewing file details**

If you are dealing with multiple capture files, knowing the details of each one becomes important. Statistics > Capture File Properties (or clicking the PCAP icon in the bottom left) shows you the file hash, capture time, any comments attached to the file, interface info, and statistics. This is also where flags can be hidden in CTF-style rooms like this one.

For this task, opening the capture file properties on `Exercise.pcapng` gives you what you need. The comments field has the flag there. The SHA256 hash is listed in that same window, and the total packet count is shown in the statistics.

**Question: Read the capture file comments. What is the flag?** `TryHackMe_Wireshark_Demo`

**Question: What is the total number of packets?** `58620`

**Question: What is the SHA256 hash value of the capture file?** `f446de335565fb0b0ee5e5a3266703c778b2f3dfad7efeaeccb2da5641a6d6eb`

---

## Task 3 — Packet Dissection {#task-3}

This is where things start getting interesting. Packet dissection, also called protocol dissection, is the process of decoding a packet layer by layer to see what is actually inside. Wireshark supports a huge number of protocols and can break them down automatically.

The room uses an HTTP packet as the example and walks through each layer. A typical packet will have between five and seven layers depending on what protocol is involved.

**Layer 1 — Frame**

This is the physical layer information. It tells you which frame number this is in the capture, the capture timestamp, frame length, and other physical layer details. Not always the most exciting layer but it is useful when you need timing information.

**Layer 2 — Source MAC**

This is the data link layer. It shows the source and destination MAC addresses. Useful for identifying which physical devices are communicating on the local network.

**Layer 3 — Source IP**

Network layer. Source and destination IP addresses. This is usually one of the first things you look at when trying to figure out who is talking to who.

**Layer 4 — Protocol**

Transport layer. Shows whether the packet is TCP or UDP, and shows the source and destination port numbers. Ports tell you a lot about what kind of traffic you are looking at before you even open the application layer.

**Protocol Errors**

This is a continuation of layer 4 and shows TCP segments that needed to be reassembled. You will see this when a large piece of data was split across multiple packets.

**Layer 5 — Application Protocol**

This is where the actual protocol in use lives. HTTP, FTP, SMB, whatever the application is using. This layer shows the protocol-specific details like request methods, headers, response codes.

**Application Data**

An extension of layer 5 showing the actual application payload. If there is a login form being submitted, the credentials might be sitting right here in plain text if the connection is unencrypted.

One thing worth noting: every time you click on a field in the details pane, Wireshark highlights the corresponding bytes in the packet bytes pane at the bottom. So if you click on the source IP field, the bytes that represent that IP address light up in the hex view. It is a nice way to understand what part of the raw packet each field comes from.

For the questions, you need to go to packet number 38 specifically. Click on it in the packet list and then dig through the layers in the details pane.

**Question: View packet number 38. Which markup language is used under the HTTP protocol?** `eXtensible Markup Language`

**Question: What is the arrival date of the packet?** `05/13/2004`

**Question: What is the TTL value?** `47`

**Question: What is the TCP payload size?** `424`

**Question: What is the e-tag value?** `9a01a-4696-7e354b00`

---

## Task 4 — Packet Navigation {#task-4}

A real capture file can have tens of thousands of packets. Scrolling through all of them by hand is not a viable strategy. This task covers the different ways Wireshark helps you navigate to what you actually care about.

**Packet numbers**

Every packet in a capture gets a unique number assigned by Wireshark. This makes it easy to reference specific packets when you are writing notes or sharing findings with someone else. You can jump directly to a packet by number using the Go menu or Ctrl+G.

**Finding packets**

Edit > Find Packet (or Ctrl+F) opens the search bar. This is genuinely one of the more useful features. You can search by display filter, hex value, string, or regex. String and regex are the ones you will use most often.

There is one thing that catches people out here. The search has three panes you can search in: the packet list, the packet details, and the packet bytes. If the information you are looking for only exists in the details pane and you search in the list pane, Wireshark will not find it even though the data is right there in the capture. Make sure you are searching in the right pane. Learned that one the hard way.

**Marking packets**

You can right-click a packet and mark it, which turns it black regardless of what colour it was before. Useful for flagging packets you want to come back to or export later. The catch is that marks are session-only. When you close the file and reopen it, the marks are gone.

**Packet comments**

Comments are the persistent version of marks. You can right-click a packet, add a comment, and it stays attached to that packet in the capture file. Unlike marks, comments survive closing and reopening the file. Other analysts looking at the same file will see your comments too.

**Exporting packets**

Sometimes you do not need the whole capture. You just need the suspicious bit. File > Export Packets lets you export a subset of packets to a new file. You can export marked packets, a range by number, or whatever is currently displayed after a filter.

**Exporting objects**

This one is genuinely cool. Wireshark can extract actual files from the capture if they were transferred over the wire. File > Export Objects, then pick your protocol (HTTP, SMB, FTP, and a few others). It shows you a list of all the files that were transferred and you can save whichever ones you want. For security analysts this is huge because you can pull out malware samples, documents, anything that was shared over an unencrypted protocol.

**Time display format**

By default Wireshark shows time as seconds since the beginning of the capture. That is fine for relative timing but terrible when you need to correlate events with real-world timestamps. View > Time Display Format lets you switch to UTC, which is usually what you want.

**Expert info**

Wireshark has a built-in expert system that flags unusual protocol states. It groups findings into four severity levels: Chat (blue, normal workflow), Note (cyan, notable events like error codes), Warn (yellow, unusual errors or problems), and Error (red, malformed packets). You can access it through Analyse > Expert Information or the small icon in the bottom left of the status bar.

**Question: Search the "r4w" string in packet details. What is the name of artist 1?** `r4w8173`

**Question: Go to packet 12 and read the packet comments. What is the answer?** `911cd574a42865a956ccde2d04495ebf`

**Question: There is a ".txt" file inside the capture file. What is the alien's name?** `PACKETMASTER`

**Question: Look at the expert info section. What is the number of warnings?** `1636`

---

## Task 5 — Packet Filtering {#task-5}

This is probably the most important practical skill in the whole room. A raw capture with 58,000 packets is noise. Filtering is how you cut through it.

Wireshark has two types of filters. Capture filters decide what gets recorded in the first place, so only matching traffic even gets saved to the file. Display filters work on an already-captured file and just control what you see without deleting anything. This task focuses on display filters.

**Apply as Filter**

The most basic way to filter. Click on any value in any packet, right-click it, and choose Apply as Filter. Wireshark builds the filter query for you and applies it immediately. The status bar updates to show how many packets match. This works for basically anything you can see in the packet details, IP addresses, ports, protocol fields, header values, all of it.

The room has a line that is genuinely useful: "If you can click on it, you can filter and copy it." That is the golden rule for analysts who do not want to write queries from scratch.

**Conversation Filter**

Apply as Filter only filters on one specific value. Conversation Filter is different. Right-click a packet and choose Conversation Filter, and Wireshark shows you all packets that are part of the same conversation as that packet, based on IP addresses and port numbers. So instead of just seeing all packets from one IP, you see the full back-and-forth exchange between two specific endpoints on specific ports.

**Colourise Conversation**

Same idea as Conversation Filter but without hiding anything. Instead of filtering down to just the related packets, it highlights them in a different colour while keeping everything else visible. Good when you want to track a conversation within the full context of all the other traffic.

**Prepare as Filter**

Similar to Apply as Filter but it does not execute immediately. It puts the query into the filter bar and waits for you to hit enter or add more conditions with AND/OR. Useful when you want to build a more complex filter by combining a few conditions before running it.

**Apply as Column**

Right-click any field value and choose Apply as Column, and that field gets added as a column in the packet list pane. So instead of having to click into each packet to check a specific value, you can see it at a glance across all packets. You can toggle columns on and off by clicking the column headers.

**Follow Stream**

This is the one you will probably use the most. Wireshark captures everything in individual packets but what you usually want to see is the full conversation reconstructed. Right-click any packet and choose Follow > TCP Stream (or HTTP Stream, or UDP Stream depending on the protocol). Wireshark reconstructs the entire exchange and shows it in a separate window. Traffic from the client shows in red, traffic from the server shows in blue.

This is where you can see things like login credentials sent over HTTP in plain text. The whole point of the previous room suddenly becomes very real when you follow an HTTP stream and see a username and password sitting there unencrypted.

When you close the stream window, Wireshark leaves a filter applied showing only the packets from that stream. Click the X in the filter bar to clear it and get back to the full capture.

**Basic display filter queries**

You can also just type filters directly into the filter bar. Typing a protocol name like `http` or `arp` or `ftp` and hitting enter shows only packets for that protocol. For port-based filtering the structure is `tcp.port == 80` or `udp.port == 53`. For IP filtering it is `ip.addr == 192.168.1.1`. These are the ones you will use constantly.

**Question: Go to packet number 4, right-click on "Hypertext Transfer Protocol" and apply it as a filter. What is the filter query?** `http`

**Question: What is the number of displayed packets?** `1089`

**Question: Go to packet number 33790, follow the HTTP stream. What is the total number of artists?** `3`

**Question: What is the name of the second artist?** `Blad3`

---

## Task 6 — Conclusion {#task-6}

That is the basics of Wireshark done. The room covers a lot of ground: the interface layout, loading and merging PCAPs, reading packet details across all the OSI layers, navigating large captures, exporting files and objects, and filtering traffic down to what actually matters.

Once you can take a 58,000 packet capture and narrow it down to a specific HTTP stream showing a login form submission, you understand why all those secure protocol rooms matter.

---