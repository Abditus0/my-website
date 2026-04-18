---
title: "Networking Core Protocols — TryHackMe Cyber Security 101"
date: 2026-04-18
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Networking Core Protocols room — Learn about the core TCP/IP protocols."
image: "/images/blog/83.png"
readtime: "36 min read"
draft: false
---

# Networking Core Protocols

This is the third room in the four-part networking series on TryHackMe. The room expects you to already know the OSI model, the TCP/IP model, and have a basic understanding of Ethernet, IP, and TCP.

If you have not done Networking Concepts yet, go do that first. This room builds on it.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — DNS: Remembering Addresses](#task-2)
- [Task 3 — WHOIS](#task-3)
- [Task 4 — HTTP(S): Accessing the Web](#task-4)
- [Task 5 — FTP: Transferring Files](#task-5)
- [Task 6 — SMTP: Sending Email](#task-6)
- [Task 7 — POP3: Receiving Email](#task-7)
- [Task 8 — IMAP: Synchronizing Email](#task-8)
- [Task 9 — Conclusion](#task-9)

---

## Task 1 — Introduction {#task-1}

The room opens by listing what you will learn: WHOIS, DNS, HTTP, FTP, SMTP, POP3, and IMAP. That is basically the full stack of protocols that power the two things most people use the internet for every single day, browsing and email.

You need to start both the AttackBox and the attached VM and give them a couple of minutes to boot before you do anything. The terminal on the AttackBox is where you will run most of the practical commands starting from Task 4.

---

## Task 2 — DNS: Remembering Addresses {#task-2}

Nobody memorizes IP addresses. You type `google.com` and something figures out that it maps to some IP address somewhere, and your browser goes there. That something is DNS.

DNS stands for Domain Name System. It runs at Layer 7, the application layer. By default it uses UDP port 53, and falls back to TCP port 53 when it needs to.

There are a bunch of DNS record types but the room focuses on four of them:

**A record** maps a hostname to one or more IPv4 addresses. So `example.com` points to something like `172.17.2.172`. This is what your browser queries when you type a URL.

**AAAA record** does the same thing but for IPv6. The room points out that AA is a battery size and AAA is Authentication, Authorization, and Accounting. Neither of those is DNS. Quad-A is the IPv6 one.

**CNAME record** maps a domain name to another domain name. So `www.example.com` can just point to `example.com` instead of having its own IP. Useful when you want multiple names to resolve to the same place without duplicating records everywhere.

**MX record** specifies which mail server handles emails for a domain. When you send an email to `test@example.com`, the mail server does a DNS lookup for the MX record of `example.com` to figure out where to deliver it.

You can look up DNS records from the command line with `nslookup`:

```shell
user@TryHackMe$ nslookup www.example.com
Server:         127.0.0.53
Address:        127.0.0.53#53

Non-authoritative answer:
Name:   www.example.com
Address: 93.184.215.14
Name:   www.example.com
Address: 2606:2800:21f:cb07:6820:80da:af6b:8b2c
```

It returned both an IPv4 and an IPv6 address. That one command actually triggered four packets behind the scenes, two queries and two responses. If you capture the traffic with tshark you can see it clearly:

```shell
user@TryHackMe$ tshark -r dns-query.pcapng -Nn
    1 0.000000000 192.168.66.89 → 192.168.66.1 DNS 86 Standard query 0x2e0f A www.example.com OPT
    2 0.059049584 192.168.66.1 → 192.168.66.89 DNS 102 Standard query response 0x2e0f A www.example.com A 93.184.215.14 OPT
    3 0.059721705 192.168.66.89 → 192.168.66.1 DNS 86 Standard query 0x96e1 AAAA www.example.com OPT
    4 0.101568276 192.168.66.1 → 192.168.66.89 DNS 114 Standard query response 0x96e1 AAAA www.example.com AAAA 2606:2800:21f:cb07:6820:80da:af6b:8b2c OPT
```

Packets 1 and 2 are the A record query and response. Packets 3 and 4 are the AAAA query and response. Your browser fires both automatically because it wants to know both addresses.

**Question: Which DNS record type refers to IPv6?** `AAAA`

**Question: Which DNS record type refers to the email server?** `MX`

---

## Task 3 — WHOIS {#task-3}

When someone registers a domain name, they get the ability to set DNS records for it. That is a lot of power over where traffic goes, so domain registrations are tied to real contact information. That contact info ends up in WHOIS records, which are publicly accessible.

WHOIS is not an acronym, it is literally "who is", as in who is the owner of this domain. You can look it up through online tools or just run the `whois` command on Linux.

The output typically gives you the registrant's name, address, phone number, email, when the domain was first created, and when it was last updated. Some people use privacy protection services that replace all their personal details with generic proxy information, so you will sometimes see stuff like "Domains By Proxy, LLC" instead of an actual person's name.

```shell
user@TryHackMe$ whois [REDACTED].com
[...]
Registrant Name: Registration Private
Registrant Organization: Domains By Proxy, LLC
Registrant Street: DomainsByProxy.com
[...]
```

For the questions, you just run `whois x.com` and `whois twitter.com` and look for the Creation Date field in the output.

`x.com` was created back in 1993. `twitter.com` showed up in 2000. So Elon bought a domain that predates Twitter by seven years. Make of that what you will.

**Question: When was the x.com record created?** `1993-04-02`

**Question: When was the twitter.com record created?** `2000-01-21`

---

## Task 4 — HTTP(S): Accessing the Web {#task-4}

Every time you open a browser and visit a website, HTTP or HTTPS is doing the work. HTTP stands for Hypertext Transfer Protocol and HTTPS is just the secure version. Both sit on top of TCP, using port 80 for HTTP and port 443 for HTTPS.

When your browser loads a page, it is actually sending structured text commands to a server and getting structured text back. Most of that exchange is hidden behind the browser UI. The room wants you to see what is actually happening under the hood.

The four main HTTP methods are:

**GET** fetches something from the server. Loading a web page is a GET request.

**POST** sends new data to the server. Submitting a form or uploading a file is a POST request.

**PUT** creates or overwrites a resource on the server.

**DELETE** removes a resource from the server.

You can talk HTTP manually using `telnet`, which is exactly what the room asks you to do. You connect to port 80, type `GET /file.html HTTP/1.1`, hit enter, type `Host: anything`, hit enter twice, and the server sends the file back as plain text. It feels ridiculous that this works but it does because HTTP really is just text commands over a TCP connection.

For the practical task, connecting to the machine and fetching `GET /flag.html` gives you the flag directly in the response body.

**Question: Use `telnet` to access the file `flag.html` on `MACHINE_IP`. What is the hidden flag?** `THM{TELNET-HTTP}`

---

## Task 5 — FTP: Transferring Files {#task-5}

HTTP is designed for web pages. FTP is designed for actual file transfers and it is more efficient at it. The two protocols are built for different jobs even though both move data between a client and a server.

FTP listens on TCP port 21 by default. The commands are straightforward:

**USER** sends the username.

**PASS** sends the password.

**RETR** downloads a file from the server to your machine.

**STOR** uploads a file from your machine to the server.

One thing to know is that FTP uses a separate connection for the actual data transfer. Port 21 is just for commands. When a file transfer happens, a second connection opens for the data. You can see this in Wireshark captures where the directory listing and the file download each appear on their own separate connection.

The room walks through connecting to the FTP server using the `ftp` command, logging in as `anonymous` with no password, listing files, and downloading one. You can grab `flag.txt` the same way:

```shell
user@TryHackMe$ ftp MACHINE_IP
Connected to MACHINE_IP.
220 (vsFTPd 3.0.5)
Name (MACHINE_IP:strategos): anonymous
331 Please specify the password.
Password:
230 Login successful.
ftp> ls
227 Entering Passive Mode (10,10,41,192,134,10).
150 Here comes the directory listing.
-rw-r--r--    1 0        0            1480 Jun 27 08:03 coffee.txt
-rw-r--r--    1 0        0              14 Jun 27 08:04 flag.txt
-rw-r--r--    1 0        0            1595 Jun 27 08:05 tea.txt
226 Directory send OK.
ftp> type ascii
200 Switching to ASCII mode.
ftp> get flag.txt
226 Transfer complete.
ftp> quit
221 Goodbye.
```

Then just `cat flag.txt` and there it is.

**Question: Retrieve `flag.txt` from the FTP server. What is the flag found?** `THM{FAST-FTP}`

---

## Task 6 — SMTP: Sending Email {#task-6}

When you hit send on an email, your mail client does not teleport it directly to the recipient. It hands the email off to a mail server using SMTP, and that server figures out how to get it to the right place. SMTP is Simple Mail Transfer Protocol and it handles both client-to-server and server-to-server email delivery.

The room compares it to going to a post office. You walk in, greet the employee, tell them who it is going to, tell them who it is from, hand over the package. SMTP sessions follow almost exactly that flow.

The main commands are:

**HELO or EHLO** starts the session. Your client introduces itself to the server.

**MAIL FROM** tells the server who the email is from.

**RCPT TO** tells the server who the email is going to.

**DATA** signals that the email content is coming next.

**.** on a line by itself ends the email. That single dot is the "I am done, send it" signal.

SMTP listens on TCP port 25. You can actually send an email manually using `telnet` to port 25 and typing all of these commands by hand. It is tedious but it makes the whole thing very obvious. Here is what that looks like:

```shell
user@TryHackMe$ telnet MACHINE_IP 25
Trying MACHINE_IP...
Connected to MACHINE_IP.
220 example.thm ESMTP Exim 4.95 Ubuntu Thu, 27 Jun 2024 16:18:09 +0000
HELO client.thm
250 example.thm Hello client.thm [10.11.81.126]
MAIL FROM: <user@client.thm>
250 OK
RCPT TO: <strategos@server.thm>
250 Accepted
DATA
354 Enter message, ending with "." on a line by itself
From: user@client.thm
To: strategos@server.thm
Subject: Telnet email

Hello. I am using telnet to send you an email!
.
250 OK id=1sMrpq-0001Ah-UT
QUIT
221 example.thm closing connection
Connection closed by foreign host.
```

**Question: Which SMTP command indicates that the client will start the contents of the email message?** `DATA`

**Question: What does the email client send to indicate that the email message has been fully entered?** `.`

---

## Task 7 — POP3: Receiving Email {#task-7}

SMTP handles sending. POP3 handles receiving. Post Office Protocol version 3 is what your email client uses to pull messages down from the mail server.

The post office analogy holds up here too. SMTP is dropping off a package at the post office. POP3 is checking your own mailbox and picking up whatever arrived.

The commands are simple:

**USER** sends the username.

**PASS** sends the password.

**STAT** asks how many messages are waiting and the total size.

**LIST** shows all messages and their individual sizes.

**RETR** followed by a message number downloads that message.

**DELE** marks a message for deletion.

**QUIT** ends the session and applies any deletions.

POP3 listens on TCP port 110. You connect with `telnet MACHINE_IP 110` and just type commands. The room shows you a full session where someone logs in, lists messages, and retrieves one.

One thing the room flags is that none of this is encrypted. If someone is capturing the traffic they can read your username, your password, and every email you download. That is not a POP3-specific problem, it is just what happens when you use plain unencrypted protocols, which is exactly why the next room in the series covers secure versions of all of these.

For the practical task, you log in with `linda` and `Pa$$123`, run `LIST` to see the four messages, then `RETR 4` to grab the fourth one.

The room asks you to identify the server software. You can see it in the banner when you first connect.

**Question: What is the name of the POP3 server running on the remote server?** `Dovecot`

**Question: Use `telnet` to connect to `MACHINE_IP`'s POP3 server. What is the flag contained in the fourth message?** `THM{TELNET_RETR_EMAIL}`

---

## Task 8 — IMAP: Synchronizing Email {#task-8}

POP3 is fine if you only ever check email from one device. You download the message, it gets deleted from the server, done. But if you check email on your phone in the morning and then open your laptop later and expect the same inbox to be there, POP3 falls apart.

IMAP solves this. Internet Message Access Protocol keeps your email on the server and syncs the state across every device. Read something on your phone, it shows as read on your laptop too. Delete something, it disappears everywhere. Move it to a folder, all your clients see the same folder structure.

The tradeoff is storage. POP3 clears messages off the server after you download them, which keeps server storage low. IMAP keeps everything on the server, so the server ends up holding your entire email history. That is why email providers charge for extra storage.

The IMAP commands are more involved than POP3:

**LOGIN** authenticates you.

**SELECT** picks which mailbox folder to look at.

**FETCH** retrieves a message. For example `fetch 3 body[]` grabs message 3 including headers and body.

**MOVE** moves messages to another mailbox.

**COPY** copies messages to another mailbox.

**LOGOUT** ends the session.

IMAP listens on TCP port 143. You connect with `telnet MACHINE_IP 143` and each command needs a tag prefix like `A`, `B`, `C`, `D` in sequence. It looks a bit weird at first but it is just how IMAP tracks which response belongs to which command.

Here is a full session fetching message 3:

```shell
user@TryHackMe$ telnet 10.10.41.192 143
Trying 10.10.41.192...
Connected to 10.10.41.192.
* OK [CAPABILITY IMAP4rev1 ...] Dovecot (Ubuntu) ready.
A LOGIN strategos
A OK [...] Logged in
B SELECT inbox
* 4 EXISTS
B OK [READ-WRITE] Select completed.
C FETCH 3 body[]
* 3 FETCH (BODY[] {445}
...email content here...
)
C OK Fetch completed.
D LOGOUT
* BYE Logging out
D OK Logout completed.
Connection closed by foreign host.
```

**Question: What IMAP command retrieves the fourth email message?** `fetch 4 body[]`

---

## Task 9 — Conclusion {#task-9}

The room wraps up with a port number summary for everything covered across this room and the previous one. Worth memorising these because they come up everywhere:

- TELNET: TCP port 23
- DNS: UDP or TCP port 53
- HTTP: TCP port 80
- HTTPS: TCP port 443
- FTP: TCP port 21
- SMTP: TCP port 25
- POP3: TCP port 110
- IMAP: TCP port 143

---

## This room

Networking Core Protocols covers the layer 7 stuff that most people interact with every day without thinking about it.

DNS is what turns a domain name into an IP address. A records for IPv4, AAAA for IPv6, CNAME for aliasing one domain to another, MX for mail servers.

WHOIS is the public registration data for a domain. Anyone can look it up unless the owner is using a privacy service.

HTTP is what browsers use to talk to web servers. GET, POST, PUT, DELETE. Port 80 for plain HTTP, port 443 for HTTPS.

FTP is for file transfers. More efficient than HTTP for that job. Port 21 for commands, a separate connection for the actual data.

SMTP is for sending email. Port 25. You say hello, you say who it is from, you say who it is going to, you type the message, you end with a dot on its own line.

POP3 is for downloading email to one device. Port 110. Simple commands, no sync.

IMAP is for synchronized email across multiple devices. Port 143. Keeps everything on the server so all your clients stay in the same state.

All of these protocols send data as plain text, passwords included. The next room is about fixing that.

---