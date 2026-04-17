---
title: "Networking Essentials — TryHackMe Cyber Security 101"
date: 2026-04-17
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Networking Essentials room — Explore networking protocols from automatic configuration to routing packets to the destination."
image: "/images/blog/81.png"
readtime: "24 min read"
draft: false
---

# Networking Essentials

This is the second room in the four-part networking series on TryHackMe. The other three are Networking Concepts, Networking Core Protocols, and Networking Secure Protocols. The room asks you to already know the OSI model, the TCP/IP model, and have a rough idea of how Ethernet, IP, and TCP work.

If you skipped Networking Concepts, go do that first. This one builds directly on it.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — DHCP: Give Me My Network Settings](#task-2)
- [Task 3 — ARP: Bridging Layer 3 Addressing to Layer 2 Addressing](#task-3)
- [Task 4 — ICMP: Troubleshooting Networks](#task-4)
- [Task 5 — Routing](#task-5)
- [Task 6 — NAT](#task-6)
- [Task 7 — Closing Notes](#task-7)

---

## Task 1 — Introduction {#task-1}

The room opens with three questions to get you curious. How does your laptop automatically set itself up when you join a new WiFi? How can you see every router your packets passed through on the way to some server on the other side of the world? And how does your whole household full of phones and laptops and smart TVs all get internet access when your ISP only gave you one IP address?

Those are good questions and the answers are not obvious until someone explains the underlying protocols. That is what this room does.

The topics covered are DHCP, ARP, NAT, ICMP, ping, and traceroute. All of them are things your devices use constantly in the background without you noticing.

---

## Task 2 — DHCP: Give Me My Network Settings {#task-2}

You walk into a coffee shop, open your laptop, connect to the WiFi, and within seconds you are browsing. You did not type a single IP address. Nobody handed you a subnet mask. It just worked.

That is DHCP doing its job.

DHCP stands for Dynamic Host Configuration Protocol. Whenever a device connects to a network, it needs at minimum three things configured: an IP address with a subnet mask, a gateway (router), and a DNS server. Doing this manually on every device every time it joins a new network would be a nightmare, especially for phones and laptops that move around all the time. DHCP automates all of it. It also prevents address conflicts, which is what happens when two devices end up with the same IP and both break.

DHCP runs at the application layer and uses UDP underneath. The DHCP server listens on UDP port 67 and the client sends from UDP port 68. Your phone and laptop are almost certainly set to use DHCP by default.

The process follows four steps, called DORA:

**DHCP Discover** is the first step. The client has just joined the network and has no IP address yet. It broadcasts a DHCPDISCOVER message basically shouting "is there a DHCP server here?" to the entire network.

**DHCP Offer** is the server's response. It replies with a DHCPOFFER message proposing an available IP address along with the network configuration the client should use.

**DHCP Request** is the client saying yes. It broadcasts a DHCPREQUEST message accepting the offered IP.

**DHCP Acknowledge** is the server confirming. It replies with a DHCPACK message and that IP address is now officially assigned to that client.

Here is what that exchange looks like in a packet capture:

```shell
user@TryHackMe$ tshark -r DHCP-G5000.pcap -n
    1   0.000000      0.0.0.0 → 255.255.255.255 DHCP 342 DHCP Discover - Transaction ID 0xfb92d53f
    2   0.013904 192.168.66.1 → 192.168.66.133 DHCP 376 DHCP Offer    - Transaction ID 0xfb92d53f
    3   4.115318      0.0.0.0 → 255.255.255.255 DHCP 342 DHCP Request  - Transaction ID 0xfb92d53f
    4   4.228117 192.168.66.1 → 192.168.66.133 DHCP 376 DHCP ACK      - Transaction ID 0xfb92d53f
```

A couple of things worth noticing here. In packets 1 and 3, the client's source IP is `0.0.0.0` because it does not have an IP yet. It sends to `255.255.255.255` which is the broadcast address, meaning every device on the local network receives it. The DHCP server is the one that actually cares and responds. At the link layer, those first two packets go to the broadcast MAC address `ff:ff:ff:ff:ff:ff` for the same reason.

By the end of this four-step process, your device has everything it needs: a leased IP address, a gateway to route packets outside the local network, and a DNS server to resolve domain names.

**Question: How many steps does DHCP use to provide network configuration?** `4`

**Question: What is the destination IP address that a client uses when it sends a DHCP Discover packet?** `255.255.255.255`

**Question: What is the source IP address a client uses when trying to get IP network configuration over DHCP?** `0.0.0.0`

---

## Task 3 — ARP: Bridging Layer 3 Addressing to Layer 2 Addressing {#task-3}

This one confused me when I was studying for it so let me try to explain it in a way that makes sense.

Everything on the internet works with IP addresses. Your device knows the IP of the gateway, the DNS server, the web server it wants to reach. Great. But here is the problem: when two devices are on the same local network and need to actually send data to each other, IP alone is not enough. The Ethernet frame that carries the IP packet needs a destination MAC address in its header. And your device might know the IP of the other device but not its MAC address.

That is the gap ARP fills.

ARP stands for Address Resolution Protocol. It translates from an IP address (layer 3) to a MAC address (layer 2) so that Ethernet frames can be constructed and sent.

Here is how it works. Say your device at `192.168.66.89` wants to send something to `192.168.66.1` (your router). It knows the IP but not the MAC. So it broadcasts an ARP Request to every device on the network asking "who has `192.168.66.1`? Tell me your MAC address." The device that owns that IP, in this case the router, replies directly with an ARP Reply containing its MAC address.

```shell
user@TryHackMe$ tshark -r arp.pcapng -Nn
    1 0.000000000 cc:5e:f8:02:21:a7 → ff:ff:ff:ff:ff:ff ARP 42 Who has 192.168.66.1? Tell 192.168.66.89
    2 0.003566632 44:df:65:d8:fe:6c → cc:5e:f8:02:21:a7 ARP 42 192.168.66.1 is at 44:df:65:d8:fe:6c
```

Packet 1 goes to `ff:ff:ff:ff:ff:ff`, the broadcast MAC address, so every device on the network sees it. Packet 2 comes straight back to the requester with the answer. From this point on, both devices can talk properly.

You might also see ARP output from `tcpdump` which labels the same packets differently, calling them ARP Request and ARP Reply rather than showing the question and answer in plain text. Same thing either way.

One thing worth knowing: ARP does not ride inside UDP or IP. It is encapsulated directly in an Ethernet frame. Some people place it at layer 2 because it deals with MAC addresses, others put it at layer 3 because it supports IP operations. The room does not stress too much about which layer it belongs to. What matters is what it does: maps IP addresses to MAC addresses on local networks.

**Question: What is the destination MAC address used in an ARP Request?** `ff:ff:ff:ff:ff:ff`

**Question: In the example above, what is the MAC address of `192.168.66.1`?** `44:df:65:d8:fe:6c`

---

## Task 4 — ICMP: Troubleshooting Networks {#task-4}

ICMP is the protocol behind two of the most classic networking tools: `ping` and `traceroute`. You have probably used both.

### Ping

`ping` sends an ICMP Echo Request (ICMP Type 8) to a target and waits for an ICMP Echo Reply (ICMP Type 0) back. That round trip tells you two things: the target is alive and reachable, and roughly how long it takes for a packet to get there and back (the round-trip time, or RTT).

```shell
user@TryHackMe$ ping 192.168.11.1 -c 4
PING 192.168.11.1 (192.168.11.1) 56(84) bytes of data.
64 bytes from 192.168.11.1: icmp_seq=1 ttl=63 time=11.2 ms
64 bytes from 192.168.11.1: icmp_seq=2 ttl=63 time=3.81 ms
64 bytes from 192.168.11.1: icmp_seq=3 ttl=63 time=3.99 ms
64 bytes from 192.168.11.1: icmp_seq=4 ttl=63 time=23.4 ms

--- 192.168.11.1 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3003ms
rtt min/avg/max/mdev = 3.805/10.596/23.366/7.956 ms
```

The `-c 4` flag stops it after four packets, otherwise it runs forever. The output shows zero packet loss and the minimum, average, maximum, and standard deviation of the RTT. Clean result.

Worth knowing: a failed ping does not always mean the target is down. A firewall somewhere along the path might be blocking ICMP packets. It is a common thing to do on servers.

### Traceroute

`traceroute` on Linux (or `tracert` on Windows) maps out every router between you and the destination. It is genuinely useful when something is slow or broken and you want to figure out where the problem is.

The trick it uses is the TTL field in the IP header. TTL stands for Time to Live and it counts how many routers a packet is allowed to pass through. Every router that forwards the packet decrements the TTL by one. When TTL hits zero, the router drops the packet and sends back an ICMP Time Exceeded message (ICMP Type 11) to the original sender.

`traceroute` exploits this. It sends the first packet with TTL set to 1. The very first router drops it and sends back an ICMP Time Exceeded, revealing its IP address. Then it sends another with TTL set to 2, which gets one hop further before being dropped. It keeps incrementing until it finally reaches the destination.

```shell
user@TryHackMe$ traceroute example.com
traceroute to example.com (93.184.215.14), 30 hops max, 60 byte packets
 1  _gateway (192.168.66.1)  4.414 ms  4.342 ms  4.320 ms
 2  192.168.11.1 (192.168.11.1)  5.849 ms  5.830 ms  5.811 ms
 3  100.104.0.1 (100.104.0.1)  11.130 ms  11.111 ms  11.093 ms
 4  10.149.1.45 (10.149.1.45)  6.156 ms  6.138 ms  6.120 ms
 5  * * *
 6  * * *
 7  * * *
 8  172.16.48.1 (172.16.48.1)  5.667 ms  8.165 ms  6.861 ms
 9  ae81.edge4.Marseille1.Level3.net (212.73.201.45)  50.811 ms  52.857 ms 213.242.116.233 (213.242.116.233)  52.798 ms
10  NTT-level3-Marseille1.Level3.net (4.68.68.150)  93.351 ms  79.897 ms  79.804 ms
11  ae-9.r20.parsfr04.fr.bb.gin.ntt.net (129.250.3.38)  62.935 ms  62.908 ms  64.313 ms
12  ae-14.r21.nwrknj03.us.bb.gin.ntt.net (129.250.4.194)  141.816 ms  141.782 ms  141.757 ms
13  ae-1.a02.nycmny17.us.bb.gin.ntt.net (129.250.3.17)  145.786 ms ae-1.a03.nycmny17.us.bb.gin.ntt.net (129.250.3.128)  141.701 ms  147.586 ms
14  ce-0-3-0.a02.nycmny17.us.ce.gin.ntt.net (128.241.1.14)  148.692 ms ce-3-3-0.a03.nycmny17.us.ce.gin.ntt.net (128.241.1.90)  141.615 ms ce-0-3-0.a02.nycmny17.us.ce.gin.ntt.net (128.241.1.14)  148.168 ms
15  ae-66.core1.nyd.edgecastcdn.net (152.195.69.133)  141.100 ms ae-65.core1.nyd.edgecastcdn.net (152.195.68.133)  140.360 ms ae-66.core1.nyd.edgecastcdn.net (152.195.69.133)  140.638 ms
16  93.184.215.14 (93.184.215.14)  140.574 ms  140.543 ms  140.514 ms
17  93.184.215.14 (93.184.215.14)  140.488 ms  139.397 ms  141.854 ms
```

Hops 5, 6, and 7 show `* * *`, meaning those routers did not respond. Either they dropped the packet silently or their ICMP Time Exceeded replies got blocked before reaching us. That is completely normal. Some routers are just configured that way.

The hops that do respond sometimes show a hostname that reveals useful info, like which ISP or backbone network the packet is passing through and roughly where in the world it is. In this example you can see it went through Marseille and then New York before reaching the destination.

The route can also change if you run traceroute multiple times. Networks reroute traffic constantly.

**Question: Using the example images above, how many bytes were sent in the echo (ping) request?** `40`

**Question: Which IP header field does the `traceroute` command require to become zero?** `TTL`

---

## Task 5 — Routing {#task-5}

So packets hop from router to router across the internet until they reach their destination. That part makes sense. But how does each router actually know which direction to send a packet? How does a router in London know that a packet destined for a server in Tokyo should go east and not west?

The answer is routing protocols. Routers constantly exchange information with each other about which networks they can reach and how far away they are, and they use that information to build routing tables. When a packet arrives, the router looks up the destination IP in its table and sends the packet out the right interface.

The room covers four routing protocols:

**OSPF (Open Shortest Path First)** works by having routers share information about the state of their directly connected links with every other router in the network. Each router ends up with a complete map of the network topology and can calculate the shortest path to any destination itself. It is one of the most widely used interior routing protocols.

**EIGRP (Enhanced Interior Gateway Routing Protocol)** is a Cisco proprietary protocol. It combines ideas from different routing approaches and factors in things like bandwidth and delay when choosing routes, not just hop count. Because it is Cisco proprietary, you will only see it in environments running Cisco equipment.

**BGP (Border Gateway Protocol)** is the big one. BGP is what the internet actually runs on at the top level. It is the protocol that lets different organisations and ISPs exchange routing information with each other so that traffic can travel between completely separate networks. When your ISP needs to hand off your packet to another ISP, BGP is what made that handoff possible.

**RIP (Routing Information Protocol)** is the simple one. Routers share which networks they can reach and how many hops it takes to get there. Routes with fewer hops win. It works fine for small networks but does not scale well, which is why you mostly see it in basic or learning environments.

**Question: Which routing protocol discussed in this task is a Cisco proprietary protocol?** `EIGRP`

---

## Task 6 — NAT {#task-6}

Remember from Networking Concepts that IPv4 can theoretically support around four billion addresses? Sounds like a lot until you realise there are way more than four billion devices that need internet access. Smart TVs, phones, laptops, printers, security cameras, fridges apparently. IPv4 was always going to run out eventually and it essentially did.

One of the main things keeping IPv4 alive is NAT, which stands for Network Address Translation.

The idea is simple. Instead of giving every device in your house its own public IP address, your router gets one public IP and shares it with all your devices. Your phone, your laptop, your tablet, they all go out to the internet appearing to be the same public IP address. From the outside world's perspective, it all looks like one device.

What makes this work is that your router keeps a translation table. When your laptop makes a connection to some web server, the router notes down the laptop's internal IP and port number and maps it to the router's own public IP and a different port number. When the web server replies, the reply comes back to the router's public IP and that specific port. The router looks up its table, figures out it belongs to the laptop, and forwards it on. The whole thing is invisible to both your laptop and the web server.

Here is a concrete example. Your laptop at internal IP `192.168.0.129` starts a connection from TCP port `15401`. The router rewrites this as coming from public IP `212.3.4.5` on TCP port `19273`. The web server responds to `212.3.4.5:19273`. The router sees that, looks it up in the table, and sends the reply to `192.168.0.129:15401`. Done.

This is why NAT routers maintain a table of ongoing connections. Each TCP connection gets its own entry. The number of simultaneous connections the router can handle is mainly limited by how many port numbers are available, which is a 16-bit number, so up to 65535 per public IP. That is roughly 65 thousand connections.

**Question: In the network diagram above, what is the public IP that the phone will appear to use when accessing the Internet?** `212.3.4.5`

**Question: Assuming that the router has infinite processing power, approximately speaking, how many thousand simultaneous TCP connections can it maintain?** `65`

---

## Task 7 — Closing Notes {#task-7}

This task has a site to visit for a flag. Click the View Site button, follow the instructions, and grab it.

**Question: Click on the View Site button to access the related site. Please follow the instructions on the site to obtain the flag.** `THM{computer_is_happy}`

---

## This room

Networking Essentials covers a lot of the "how does any of this actually work" questions that people have about basic internet stuff but never get around to looking up.

DHCP is what gives your device its network config automatically when you join a network. DORA, four steps, done.

ARP is what fills the gap between knowing an IP address and knowing the MAC address you need to build an Ethernet frame. It broadcasts a question and gets a direct reply.

ICMP is the protocol that makes ping and traceroute work. Ping tests whether a host is alive. Traceroute exploits the TTL field to map out every router along the path.

Routing protocols are how routers figure out which direction to send packets. OSPF and EIGRP for internal networks, BGP for the internet at large, RIP for small simple setups.

NAT is how your whole home network shares a single public IP address. The router keeps a translation table and handles all the rewrites transparently.

All of this runs constantly in the background every time you use the internet. It is kind of wild that it works as reliably as it does.

---