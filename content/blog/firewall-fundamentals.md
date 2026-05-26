---
title: "Firewall Fundamentals — TryHackMe Cyber Security 101"
date: 2026-05-26
category: "writeup"
excerpt: "Walkthrough of TryHackMe's Firewall Fundamentals room — Learn about firewalls and get hands-on with Windows and Linux built-in firewalls."
image: "/images/blog/131.png"
readtime: "32 min read"
draft: false
---

## Tasks

- [Task 1 — What Is the Purpose of a Firewall](#task-1)
- [Task 2 — Types of Firewalls](#task-2)
- [Task 3 — Rules in Firewalls](#task-3)
- [Task 4 — Windows Defender Firewall](#task-4)
- [Task 5 — Linux iptables Firewall](#task-5)

---

## Task 1 — What Is the Purpose of a Firewall {#task-1}

The room kicks off with the classic security guard analogy. Guards stand outside banks and shopping malls checking who comes in and out, firewalls do the same thing but for network traffic. It's a fine analogy, it's been used in every networking book ever written, and you'll see it again in basically every firewall room you ever do.

The idea: a firewall is something that sits between your device (or network) and the rest of the world, and it inspects every packet trying to come in or go out. You give it rules. It checks each packet against those rules. Allow or deny. That's the core of it.

Modern firewalls do way more than just allow/deny based on simple rules, but that's the foundation everything else is built on top of. The room is going to cover the different types of firewalls, what makes up a firewall rule, and then hands-on with the built-in firewalls on Windows and Linux.

The only prerequisite is the Networking Concepts room which you should already have done if you're going through the path in order.

**Which security solution inspects the incoming and outgoing traffic of a device or a network?** `firewall`

---

## Task 2 — Types of Firewalls {#task-2}

Not all firewalls are the same. They've evolved a lot over the years, and different types work at different layers of the OSI model. Heads up that we're about to be talking about OSI layers a lot. If you don't remember which layer is which, layer 3 is IP addresses, layer 4 is TCP/UDP ports, layer 7 is the application data (HTTP, DNS, that kind of stuff).

### Stateless firewall

The oldest and simplest type. Operates at layers 3 and 4. It looks at each packet completely on its own and asks "does this match a rule?" It does not remember anything about previous packets.

That sounds fine until you think about it for a second. Say a malicious source sends a packet, the firewall checks the rules and drops it. Cool. Then the same source sends another packet two seconds later. The stateless firewall has zero memory of the first packet, so it just runs the rule matching all over again from scratch. Every single packet, fresh evaluation.

The upside is they're fast because they don't have to maintain any state. The downside is they can't reason about connections, only about individual packets. They're still around for high-throughput places where speed matters more than smarts.

### Stateful firewall

This is the upgrade. Also operates at layers 3 and 4, but it keeps a memory of what's going on. It maintains a state table, which is basically a log of every active connection it knows about.

So when a packet comes in, the firewall checks "is this part of an existing connection I already approved?" If yes, just let it through, no need to re-evaluate. If it's a brand new connection, then check the rules. If a source had its traffic denied recently, the firewall remembers that too and shuts down follow-up packets from the same source automatically.

This is what most "regular" firewalls are. The vast majority of modern firewalls are stateful at minimum.

### Proxy firewall

Now we jump up to layer 7. Stateful firewalls can tell that packet came from IP X going to port 80 on IP Y, but they can't tell what's IN the packet. Proxy firewalls can.

The way it works is the proxy firewall sits as a middleman between your network and the outside. When someone in your network wants to visit a website, the request goes to the proxy first. The proxy looks at the full content of the request (what URL, what data, what file types), decides if it's okay, and then forwards the request out using its own IP address. Replies come back to the proxy, get inspected, then get handed back to the original user. Bonus side effect, your internal IPs never get exposed to the outside, which is nice.

Also called application-level gateways because they operate at the application layer. Content filtering (blocking certain websites, blocking file types, blocking specific keywords) usually happens at this layer.

### Next-Generation Firewall (NGFW)

The big modern one. Operates across layers 3 through 7, which basically means it can do everything the previous types could plus a lot more. NGFWs typically include:

- Deep packet inspection (reads packet contents, not just headers)
- Built-in intrusion prevention system (IPS) that blocks attacks in real time
- Heuristic analysis (recognizes attack patterns even if it hasn't seen the exact attack before)
- SSL/TLS decryption (which is necessary because most malicious traffic is encrypted now, so a firewall that can't decrypt HTTPS is basically half blind)
- Integration with threat intel feeds so it can block known-bad IPs and domains automatically

This is what big companies deploy. Palo Alto, Fortinet, Check Point, Cisco Firepower, all the expensive enterprise stuff is in this category. They're not just firewalls anymore, they're more like full security platforms.

### Quick reference

Stateless: basic rule matching, no memory, fast.

Stateful: rule matching plus tracks connections, can apply more complex policies based on connection state.

Proxy: inspects packet content, applies content filtering, hides internal IPs.

NGFW: all of the above plus deep packet inspection, IPS, heuristics, SSL decryption, threat intel.

**Which type of firewall maintains the state of connections?** `stateful firewall`

**Which type of firewall offers heuristic analysis for the traffic?** `next-generation firewall`

**Which type of firewall inspects the traffic coming to an application?** `proxy firewall`

---

## Task 3 — Rules in Firewalls {#task-3}

The firewall by itself isn't doing anything until you tell it what to allow and what to block. That's what rules are for. Even built-in firewalls come with some default rules out of the box, but most of the time you'll be adding your own based on your specific situation.

Common scenario: your company has a policy of blocking all incoming SSH from the internet, except from a few specific IPs that the sysadmins use. That's literally two rules. One that says "block all SSH inbound" and one that says "but allow SSH inbound from these specific IPs" with a higher priority.

### What a rule is made of

Every firewall rule, regardless of vendor, boils down to the same handful of pieces:

**Source address.** Where the traffic is coming FROM. An IP, a range, or "any".

**Destination address.** Where the traffic is going TO. Same deal, IP, range, or any.

**Port.** TCP/UDP port number(s) involved.

**Protocol.** TCP, UDP, ICMP, etc.

**Action.** What to do with matching traffic. Allow, deny, forward.

**Direction.** Is this rule for incoming or outgoing traffic?

That's the whole anatomy. Every firewall rule everywhere is some combination of those fields.

### The three actions

**Allow.** Pretty self-explanatory. Traffic that matches gets through.

Example, allow all outgoing HTTP traffic from your network:

`Action: Allow | Source: 192.168.1.0/24 | Destination: Any | Protocol: TCP | Port: 80 | Direction: Outbound`

**Deny.** Block it. The packet gets dropped (or rejected, depending on firewall behavior).

Example, block all incoming SSH from anywhere to your critical server:

`Action: Deny | Source: Any | Destination: 192.168.1.0/24 | Protocol: TCP | Port: 22 | Direction: Inbound`

**Forward.** Send the traffic to a different network or host. Only available on firewalls that double as routers/gateways, which is most enterprise firewalls. This is what you use for things like port forwarding, where incoming traffic on a public port gets redirected to an internal server.

Example, forward all incoming web traffic to your web server:

`Action: Forward | Source: Any | Destination: 192.168.1.8 | Protocol: TCP | Port: 80 | Direction: Inbound`

### Rule directionality

**Inbound rules** apply to traffic coming INTO your network or machine. Like allowing port 80 to reach your web server.

**Outbound rules** apply to traffic LEAVING your network or machine. Like blocking outgoing SMTP from every device except the mail server, which is a really common control to prevent compromised machines from being used as spam relays.

**Forward rules** are about redirecting traffic from one place to another, usually used for port forwarding through gateways.

One quick thing that catches people. Don't assume an inbound and outbound rule for the same connection cancel each other out or that you only need one. They're separate things. A connection has packets going both ways and depending on how the firewall is configured, you may need to allow both directions explicitly. Stateful firewalls handle this automatically (allow the inbound, the outbound replies are tracked through state). Stateless ones, you'd need both rules.

**Which type of action should be defined in a rule to permit any traffic?** `allow`

**What is the direction of the rule that is created for the traffic leaving our network?** `outbound`

---

## Task 4 — Windows Defender Firewall {#task-4}

Time to touch a firewall. Windows Defender Firewall is built into every Windows. It's not the most exciting tool in the world but it's there, it's free, and it works. You open it by searching "Windows Defender Firewall" in the start menu.

Start the machine and either use the in-browser split view or RDP in with:

- Username: `Administrator`
- Password: `windows-defender@123`
- IP: `MACHINE_IP`

### The dashboard

The main page shows you Network Profiles and a bunch of options on the left side. The profiles thing is something Windows does that you should understand.

### Network profiles

Windows tries to be smart about figuring out what kind of network you're on (using Network Location Awareness, NLA) and applies different firewall settings depending on the profile. There are two:

**Private networks.** Your home network, trusted office network, places where you generally want things to work and you're okay with being more permissive. File sharing on, printer discovery on, etc.

**Guest or public networks.** Coffee shops, airports, hotels, anywhere you don't trust. Should be locked down hard. Block incoming connections, minimize what's exposed.

You can adjust per-app permissions per profile by clicking "Allow an app or feature through Windows Defender Firewall". You get a giant list of apps and checkboxes for each profile.

You can turn the firewall on or off through the settings option, but Microsoft really doesn't want you to fully disable it. Instead they recommend "Block all incoming connections" if you want maximum lockdown without breaking outbound. There's also a "Restore defaults" button if you've messed something up badly and want to start over.

### Creating a custom rule

Here's where the interesting part is. The task walks through creating an outbound rule that blocks all HTTP (port 80) and HTTPS (port 443) traffic, which effectively kills your ability to browse the web from that machine. Useful test rule because the effect is obvious and easy to verify.

Quick test before creating the rule. Visit `http://10.10.10.10/` in the browser. It loads fine. Good baseline.

Then to create the rule:

1. From the dashboard, click "Advanced settings". This opens the Windows Firewall with Advanced Security console, which is honestly where you'll be doing all the real configuration. The basic dashboard is for users, advanced settings is for admins.

2. Click "Outbound Rules" on the left, then "New Rule..." on the right. The Rule Wizard opens.

3. Rule type: select "Custom" and click Next. Custom gives you the most control.

4. Program: select "All programs" and Next. This makes the rule apply system-wide regardless of which app is making the connection.

5. Protocol and ports: Protocol type = TCP. Local port = All Ports (leave it). Remote port = Specific Ports, then enter `80,443`. No spaces between the comma and the next port number, the wizard is picky about that. Click Next.

6. Scope: leave both local and remote IP addresses set to "Any IP address". Next.

7. Action: select "Block the connection". Next.

8. Profile: leave all three (Domain, Private, Public) checked. Next.

9. Name: give it something descriptive like "Block HTTP/HTTPS Outbound" with an optional description. Click Finish.

Done. The rule shows up in the Outbound Rules list and is active immediately.

Now go back to the browser and try `http://10.10.10.10/` again. Error page. "Can't reach this page." That's the rule working. Same for any HTTPS site you try. The internet is effectively gone from this machine until you disable or delete that rule.

### The exercise

For the task questions, you don't need to create rules. The VM already has rules pre-loaded that the security team set up to block some suspicious traffic, and you need to look at them and answer questions.

Open Windows Defender Firewall, go to Advanced settings, click on Inbound Rules. Look through the existing custom rules in the list. You're looking for two specific ones related to SSH (port 22).

First question is about the rule that blocks ALL incoming SSH traffic. Look for the rule where the action is Block, the port is 22, and the source/scope is set to allow from any IP. Check the name column.

Second question is about a rule that ALLOWS SSH from one specific IP address. This will be a separate rule, Action Allow, port 22, but with a specific remote IP set in the Scope tab. Find that one, note its name and the IP it whitelists. You can see the scope details by double clicking the rule and going to the Scope tab.

**What is the name of the rule that was created to block all incoming traffic on the SSH port?** `Core Op`

**A rule was created to allow SSH from one single IP address. What is the rule name?** `Infra team`

**Which IP address is allowed under this rule?** `192.168.13.7`

---

## Task 5 — Linux iptables Firewall {#task-5}

Linux side now. And honestly the Linux firewall ecosystem is way more confusing than the Windows one because there are like five different tools that all do the same thing in slightly different ways.

### Netfilter

Underneath all the Linux firewall tools is this thing called Netfilter. Netfilter is the firewall framework built into the Linux kernel. It's what does the packet filtering, NAT, and connection tracking. Everything else you'll hear about (iptables, nftables, firewalld, ufw) is just a tool that configures Netfilter. They're frontends. The engine doing the real work is always Netfilter.

That's important to understand because otherwise it looks like Linux has six different competing firewalls. It doesn't. It has one firewall (Netfilter) and a bunch of different ways to talk to it.

The tools:

**iptables.** The classic. Been around forever. Most widely used. Powerful but the syntax is brutal. Writing iptables rules from scratch is the kind of thing that produces commands like `iptables -A INPUT -p tcp -m state --state NEW --dport 22 -j ACCEPT` and that's a simple one.

**nftables.** The replacement for iptables. Cleaner syntax, more efficient, supports more features. Most modern distros are moving to it. Still based on Netfilter underneath.

**firewalld.** Different approach. Comes with predefined "zones" (work, home, public, dmz, etc) and you assign network interfaces to zones, and the zones have their own rule sets. Used heavily on Red Hat / CentOS / Fedora.

### ufw (Uncomplicated Firewall)

The name says it all. ufw exists because iptables syntax is unfriendly, and Ubuntu wanted a way for people to set up firewall rules without crying. ufw is just a friendly wrapper that takes simple commands and translates them into iptables rules behind the scenes.

The task focuses on ufw because of course it does, it's the easy one. Let's walk through the basics.

### Checking status

```
user@ubuntu:~$ sudo ufw status
Status: inactive
```

If it's inactive, the firewall isn't doing anything. You have to enable it.

### Enabling and disabling

```
user@ubuntu:~$ sudo ufw enable
Firewall is active and enabled on system startup
```

Done. Now it's running and will start automatically on boot. To turn it off, swap `enable` for `disable`. Worth knowing about because if you ever lock yourself out of a remote SSH session by enabling ufw without first allowing port 22, you'll be a sad person. So, real talk, ALWAYS run `sudo ufw allow 22/tcp` BEFORE you enable ufw on a remote machine. Otherwise you'll enable it, your session will keep working (because it's an existing connection), but the next time you try to SSH in you'll find out the hard way. Ask me how I know.

### Default policies

You can set a default behavior for incoming or outgoing traffic. This is the "if no other rule matches, do this" fallback.

```
user@ubuntu:~$ sudo ufw default allow outgoing
Default outgoing policy changed to 'allow'
(be sure to update your rules accordingly)
```

Swap `outgoing` for `incoming` to set the inbound default, swap `allow` for `deny` to flip the action. So `sudo ufw default deny incoming` is "block everything coming in by default" which is a sensible starting point for most servers.

### Adding rules

The straightforward way:

```
user@ubuntu:~$ sudo ufw deny 22/tcp
Rule added
Rule added (v6)
```

That's it. Block all incoming SSH. The `(v6)` line means it also added the equivalent rule for IPv6, which ufw does automatically. Other examples:

- `sudo ufw allow 80/tcp` allow incoming HTTP
- `sudo ufw deny from 1.2.3.4` block a specific IP entirely
- `sudo ufw allow from 192.168.1.0/24 to any port 22` allow SSH only from your LAN

Compare that to the equivalent iptables command and you'll see why ufw exists.

### Listing rules

```
user@ubuntu:~$ sudo ufw status numbered
To                         Action      From
--                         ------      ----
[ 1] 22/tcp                     DENY IN     Anywhere
[ 2] 22/tcp (v6)                DENY IN     Anywhere (v6)
```

The `numbered` flag gives you those `[1]`, `[2]` numbers which you need for deleting rules. Without it you just get the rules without numbers.

### Deleting rules

```
user@ubuntu:~$ sudo ufw delete 2
Deleting:
deny 22/tcp
Proceed with operation (y|n)? y
Rule deleted (v6)
```

Reference the rule by its number from the numbered status output, confirm, gone. Note that if you delete rule 1, all subsequent rules shift up (rule 2 becomes rule 1, etc), so if you're deleting multiple rules either delete from the highest number down, or re-run `status numbered` between deletions.

### Which one to use

Honestly, depends on what you're doing. If you're a beginner or you're just trying to get basic firewall rules set up on your personal Linux box, ufw. If you're managing servers professionally and need fine-grained control or complex rule sets, you'll end up learning iptables or nftables. If you're on a Red Hat-based system, you'll probably use firewalld since it's the default there. They all configure the same underlying Netfilter so the firewall behavior is identical, the difference is just how painful it is to write the rules.

**Which Linux firewall utility is considered to be the successor of "iptables"?** `nftables`

**What rule would you issue with ufw to deny all outgoing traffic from your machine as a default policy? (answer without sudo)** `ufw default deny outgoing`

---