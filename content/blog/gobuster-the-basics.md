---
title: "Gobuster: The Basics — TryHackMe Cyber Security 101"
date: 2026-05-10
category: "writeup"
excerpt: "Walkthrough of TryHackMe's Gobuster: The Basics room — This room focuses on an introduction to Gobuster, an offensive security tool used for enumeration."
image: "/images/blog/118.png"
readtime: "42 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Environment and Setup](#task-2)
- [Task 3 — Gobuster: Introduction](#task-3)
- [Task 4 — Use Case: Directory and File Enumeration](#task-4)
- [Task 5 — Use Case: Subdomain Enumeration](#task-5)
- [Task 6 — Use Case: Vhost Enumeration](#task-6)
- [Task 7 — Conclusion](#task-7)

---

## Task 1 — Introduction {#task-1}

Gobuster. If you've done a single CTF before this you've probably seen someone fire it off and rip through a website's directory structure in like ten seconds. Now we get to learn what it does and the different modes it has, instead of just blindly copying commands off a writeup.

This room is hands-on which is great, less theory dumping, more running stuff and seeing output. The idea is by the end you'll know how to use Gobuster for three things: directories and files on a web server, DNS subdomains, and virtual hosts. The vhost vs subdomain thing is the part most people get confused about and we'll get to that.

---

## Task 2 — Environment and Setup {#task-2}

Setup time. The target is an Ubuntu 20.04 box running a web server with a bunch of subdomains and vhosts on it. Two CMS installs on there too, WordPress and Joomla. We won't really be touching those in this room, they're just sitting there as part of what's on the box.

If you're using the AttackBox, Gobuster is preinstalled. If you're on your own machine you need the VPN running and Gobuster installed. Kali has it by default, on Ubuntu it's `apt install gobuster`, otherwise grab it from the GitHub repo.

Start the machine, give it about two minutes to boot.

### The DNS thing (don't skip this)

Here's the part that will mess you up if you ignore it. The room uses fake domain names like `example.thm` and `offensivetools.thm` that don't exist on the real internet. The target machine itself is running a DNS server that knows how to resolve those names. So you need to point your AttackBox at that DNS server, otherwise nothing in this room is going to work and you're going to be sitting there confused thinking Gobuster is broken.

The fix is to edit `/etc/resolv-dnsmasq` and stick the machine's IP at the top as a nameserver:

```bash
sudo nano /etc/resolv-dnsmasq
```

Add this as the first line (replace `MACHINE_IP` with the actual IP):

```
nameserver MACHINE_IP
```

Save with `Ctrl+O`, hit Enter, exit with `Ctrl+X`. Then restart dnsmasq:

```bash
/etc/init.d/dnsmasq restart
```

When you `cat` the file it should look like:

```bash
root@tryhackme:~# cat /etc/resolv-dnsmasq 
nameserver MACHINE_IP
nameserver 169.254.169.253
```

If you skip this and try to scan `offensivetools.thm` later, you're gonna get nothing back and waste twenty minutes wondering why.

---

## Task 3 — Gobuster: Introduction {#task-3}

So what is Gobuster. It's a brute force tool written in Go (hence the name) that enumerates stuff on web servers and DNS by chucking entries from a wordlist at a target and seeing what sticks. That's the whole concept. It's stupidly simple and that's why it works so well.

In terms of where it fits in a real engagement, it lives between recon and scanning. You've found the target, now you want to know what's on it. What directories are there. What subdomains exist. What virtual hosts are configured. Gobuster answers those questions with brute force.

### Two words to actually understand

**Enumeration** is just listing every resource available, whether you can actually access it or not. Like getting a list of every directory on a web server, even the ones that return 403 Forbidden. You still want to know they exist.

**Brute force** is trying every option until something works. The keys-on-a-keychain analogy. Gobuster doesn't guess intelligently, it just runs through a wordlist top to bottom.

### The help page

Run `gobuster --help` and you get this:

```bash
root@tryhackme:~# gobuster --help
Usage:
  gobuster [command]

Available Commands:
  completion  Generate the autocompletion script for the specified shell
  dir         Uses directory/file enumeration mode
  dns         Uses DNS subdomain enumeration mode
  fuzz        Uses fuzzing mode. Replaces the keyword FUZZ in the URL, Headers and the request body
  gcs         Uses gcs bucket enumeration mode
  help        Help about any command
  s3          Uses aws bucket enumeration mode
  tftp        Uses TFTP enumeration mode
  version     shows the current version
  vhost       Uses VHOST enumeration mode (you most probably want to use the IP address as the URL parameter)

Flags:
      --debug                 Enable debug output
      --delay duration        Time each thread waits between requests (e.g. 1500ms)
  -h, --help                  help for gobuster
      --no-color              Disable color output
      --no-error              Don't display errors
  -z, --no-progress           Don't display progress
  -o, --output string         Output file to write results to (defaults to stdout)
  -p, --pattern string        File containing replacement patterns
  -q, --quiet                 Don't print the banner and other noise
  -t, --threads int           Number of concurrent threads (default 10)
  -v, --verbose               Verbose output (errors)
  -w, --wordlist string       Path to the wordlist. Set to - to use STDIN.
      --wordlist-offset int   Resume from a given position in the wordlist (defaults to 0)
```

The commands you actually care about are `dir`, `dns`, and `vhost`. The other ones (gcs, s3, tftp, fuzz) are useful but not what this room covers.

The flags that show up basically everywhere:

`-t` (`--threads`) is how many threads run at once. Default is 10. Bigger wordlist + more threads = faster scan, but also = more chance of hammering the server too hard or getting noticed/blocked. I usually go up to 40 or 64 on CTF stuff because nothing cares, on real engagements you'd dial it way down.

`-w` (`--wordlist`) is the path to the wordlist. Required. This is the brute force fuel.

`--delay` is the wait between requests. Useful when something is rate limiting you or you're trying to look more like normal traffic.

`--debug` for when nothing makes sense and you need to see what's actually happening.

`-o` (`--output`) writes results to a file instead of just to your terminal. Good practice when you're doing real work because the terminal scrollback always betrays you eventually.

### Quick example

```bash
gobuster dir -u "http://www.example.thm/" -w /usr/share/wordlists/dirb/small.txt -t 64
```

Translated: directory mode, target is `www.example.thm`, use the small.txt wordlist, run 64 threads. Gobuster takes each line of the wordlist, sticks it on the end of the URL, sends a GET request, and reports the status code back.

**What flag do we use to specify the target URL?** `-u`

**What command do we use for the subdomain enumeration mode?** `dns`

---

## Task 4 — Use Case: Directory and File Enumeration {#task-4}

`dir` mode. The classic. Probably 80% of the time anyone uses Gobuster, this is what they're doing.

The idea is that web apps have predictable folder structures. WordPress has `/wp-admin`, `/wp-content`, `/wp-includes`. Joomla has its own pattern. Custom apps often have `/admin`, `/login`, `/api`, `/uploads`, `/backup`, `/test`, `/dev`, that kind of thing. Most of these aren't linked from the homepage but they exist. Gobuster takes a list of common names and checks each one. If something is there you get a status code back.

The status code part is huge. 200 means it's there and you can see it. 301 or 302 means it's redirecting somewhere (often to a login). 401/403 means it's there but you can't access it (which is still really useful info, you just found something the admin doesn't want you seeing). 404 means nothing there. So even before you look at any content, the status code alone tells you a lot.

### The dir flags worth knowing

`-c` (`--cookies`) lets you pass a cookie. Big deal when the area you're scanning is behind a login, you grab your session cookie and pass it in so Gobuster scans as a logged-in user.

`-x` (`--extensions`) tells Gobuster to also check for files with certain extensions. So `-x .php,.html,.txt` will check `admin.php`, `admin.html`, `admin.txt` for every word in your list. Massively expands what you find.

`-H` (`--headers`) for adding custom headers. Useful when the app needs an Authorization header or a custom one.

`-k` (`--no-tls-validation`) skips TLS cert checks. You'll need this constantly because every CTF box uses self-signed certs that your scanner will refuse to talk to otherwise. Gets old fast.

`-n` (`--no-status`) hides status codes from output. Cleaner but I never use it because the status codes are useful part.

`-s` (`--status-codes`) only show specific status codes. Like `-s 200,301` to only see results that hit those.

`-b` (`--status-codes-blacklist`) the opposite, hide certain status codes. By default Gobuster blacklists 404.

`-r` (`--followredirect`) follow redirects. Useful sometimes but can also clutter your output, depends on the app.

`-U` and `-P` (`--username` and `--password`) for basic auth. Not for form logins, that's a different thing.

### How to actually run it

```bash
gobuster dir -u "http://www.example.thm" -w /path/to/wordlist
```

`-u` and `-w` are required. Without them it just yells at you.

A more realistic command:

```bash
gobuster dir -u "http://www.example.thm" -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -r
```

Couple things to know about the URL:

You have to include the protocol (`http://` or `https://`). Forget it, scan fails immediately.

You can use IP or hostname but they're not always the same. A web server can host multiple sites on one IP (vhosting again, more on that in task 6) so hitting the IP might give you a totally different site than hitting the hostname. When in doubt use the hostname.

The URL is the starting point for the scan. So if you set `-u http://example.thm/admin` Gobuster scans inside the admin folder. Gobuster does NOT recurse on its own. If it finds `/admin/secret` and you also want to enumerate inside `/admin/secret`, you have to run a second scan pointing at that path. People forget this all the time.

To also look for files with specific extensions:

```bash
gobuster dir -u "http://www.example.thm" -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x .php,.js
```

That'll find both directories and any `.php` or `.js` files matching your wordlist entries.

### Doing the questions

The room wants you to enumerate `www.offensivetools.thm` and find a directory that looks weird, then look inside that directory for a `.js` file with a flag. The DNS resolver thing from Task 2 is what makes this work, if you didn't do that, this is where it falls apart.

First scan the root:

```bash
gobuster dir -u "http://www.offensivetools.thm" -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -t 64
```

You'll get a list of directories back. Most of them will be normal looking stuff (images, css, js, the usual). But one of them is going to stand out because it has a name like `secret` which is, well, kind of a giveaway. That's the one.

Then because Gobuster doesn't recurse, you run a second scan inside that directory and tell it to look for `.js` files:

```bash
gobuster dir -u "http://www.offensivetools.thm/secret" -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x .js -t 64
```

It'll find a `.js` file in there. Open it in the browser at `http://www.offensivetools.thm/secret/<filename>.js` and the flag is somewhere in the file contents. You can also use `curl`.

**Which flag do we have to add to our command to skip the TLS verification? Enter the long flag notation.** `--no-tls-validation`

**Enumerate the directories of www.offensivetools.thm. Which directory catches your attention?** `secret`

**Continue enumerating the directory found in question 2. You will find an interesting file there with a .js extension. What is the flag found in this file?** `THM{ReconWasASuccess}`

---

## Task 5 — Use Case: Subdomain Enumeration {#task-5}

Different mode now. `dns` mode goes after subdomains.

Quick reminder on what subdomains are. If `tryhackme.com` is a domain, then `learn.tryhackme.com`, `blog.tryhackme.com`, `static.tryhackme.com` are subdomains. Big sites have tons of these. Each one is potentially a different application, possibly running different software, possibly patched at different times. Just because the main site is locked down doesn't mean every subdomain is. The forgotten dev subdomain or the old API subdomain or the legacy mobile subdomain is where you find good stuff.

The way `dns` mode works is different from `dir`. It does actual DNS lookups. It takes each word in your list, prepends it to the domain, and asks the DNS server "does this exist". If DNS gives back an IP, it's a hit. No HTTP requests at all in this mode, it's pure DNS.

### The flags

`dns` mode has fewer flags than `dir` because there's less to configure. The ones that matter:

`-d` (`--domain`) sets the target domain. Required.

`-w` (`--wordlist`) sets the wordlist. Required.

`-c` (`--show-cname`) shows CNAME records.

`-i` (`--show-ips`) shows the IPs that the found subdomains resolve to. I usually have this on, it's useful info.

`-r` (`--resolver`) lets you specify a custom DNS server to use. Useful if you don't trust your default resolver or if (like in this room) the answers are only available from a specific DNS server.

### How to use it

```bash
gobuster dns -d example.thm -w /path/to/wordlist
```

Concrete example:

```bash
gobuster dns -d example.thm -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt
```

Output looks like:

```bash
root@tryhackme:~# gobuster dns -d example.thm -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt 
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Domain:     example.thm
[+] Threads:    10
[+] Timeout:    1s
[+] Wordlist:   /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt
===============================================================
Starting gobuster in DNS enumeration mode
===============================================================
Found: www.example.thm
                                                                                                                                                            
Found: shop.example.thm
                                                                                                                                                            
Found: academy.example.thm
                                                                                                                                                            
Found: primary.example.thm
                                                                                                                                                            
Progress: 4989 / 4990 (99.98%)
===============================================================
Finished
=============================================================== 
```

Four subdomains found: www, shop, academy, primary.

For the question, swap `example.thm` for `offensivetools.thm`:

```bash
gobuster dns -d offensivetools.thm -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt
```

You'll get back four subdomains for that one too.

Side note. The wordlist matters a LOT here. The top1million-5000 list is the standard starting point but if you don't find what you're looking for, try the bigger ones (`subdomains-top1million-20000.txt` or `-110000.txt`). Real engagements you might use multiple lists. Also the SecLists collection has separate lists for things like specific SaaS providers if you're looking at a particular kind of target.

**Apart from the dns keyword and the -w flag, which shorthand flag is required for the command to work?** `-d`

**Use the commands learned in this task, how many subdomains are configured for the offensivetools.thm domain?** `4`

---

## Task 6 — Use Case: Vhost Enumeration {#task-6}

Last mode. `vhost`. This is the one that confuses people because at first it looks identical to subdomain enumeration. It is not.

### Vhost vs subdomain (the actual difference)

A subdomain is a DNS thing. There is a DNS record somewhere that says `blog.example.thm` resolves to some IP. If you look it up in DNS, you get an answer. That's what `dns` mode finds.

A vhost (virtual host) is a web server thing. One physical server with one IP can host multiple websites. The way it knows which website to serve is by looking at the `Host:` header in your HTTP request. So you connect to the IP and your browser says "Host: blog.example.thm" in the request, and the web server says "ah, you want the blog site, here's that content". Same IP, totally different site, just based on the Host header.

The kicker is, a vhost might NOT have a DNS record. Someone could set up `internal.example.thm` as a vhost on the server but never make a public DNS record for it. So `dns` mode wouldn't find it. The only way to find it is to brute force the Host header directly against the IP and see when the server gives you a different response.

That's what `vhost` mode does. It connects to the IP, sets the Host header to `<word>.example.thm`, and watches what comes back. If the response is different in a meaningful way (different size usually) compared to a known invalid host, that vhost exists.

### The flags

`-u` (`--url`) target URL, usually the IP.

`--domain` the base domain to use after the wordlist entry.

`--append-domain` this one trips people up. By default, Gobuster's vhost mode treats your wordlist entry as the FULL hostname. So if your list has `www`, it'll set `Host: www`. That's not gonna do much. With `--append-domain`, it sticks `.example.thm` on the end automatically. Pretty much always want this on for normal vhost scans.

`--exclude-length` filters results by response size. CRITICAL. More on this below.

`-r` (`--follow-redirect`) follow redirects.

`-m` (`--method`) HTTP method, default is GET, fine 99% of the time.

### The example command

```bash
root@tryhackme:~# gobuster vhost -u "http://MACHINE_IP" --domain example.thm -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt --append-domain --exclude-length 250-320 
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:              http://10.10.94.214
[+] Method:           GET
[+] Threads:          10
[+] Wordlist:         /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt
[+] User Agent:       gobuster/3.6
[+] Timeout:          10s
[+] Append Domain:    true
[+] Exclude Length:   250,254,263,274,283,293,294,299,253,261,269,277,285,290,300,257,258,270,278,282,291,252,260,264,268,271,279,280,289,251,256,262,265,272,297,287,292,295,255,266,276,284,286,296,267,273,275,281,288,259,298
===============================================================
Starting gobuster in VHOST enumeration mode
===============================================================
Found: blog.example.thm Status: 200 [Size: 1493]
Found: shop.example.thm Status: 200 [Size: 2983]
Found: www.example.thm Status: 200 [Size: 84352]
Found: chelyabinsk-rnoc-rr02.backbone.example.thm Status: 404 [Size: 304]
Found: academy.example.thm Status: 200 [Size: 434]
Progress: 4989 / 4990 (99.98%)
===============================================================
Finished
===============================================================
```

Yeah, that command looks like a lot. Let me break down why every piece is there.

`gobuster vhost` mode select.

`-u "http://MACHINE_IP"` we hit the IP directly, not a hostname. Because we're testing the Host header.

`--domain example.thm` tells Gobuster "the domain part of the host is example.thm".

`-w /usr/share/wordlists/...` the wordlist.

`--append-domain` sticks the domain on each wordlist word so we end up with proper full hostnames in the Host header.

`--exclude-length 250-320` HERE is where things get real. Without this, you'd get like 5000 "found" results because the server's default response (when it doesn't recognize the host) has a fairly fixed size, and Gobuster reports anything that doesn't match its baseline. By telling it "ignore responses sized between 250 and 320 bytes", we filter out all the false positives where the server is returning its default "no such vhost" page.

Real vhost scanning is a process. You usually run it once, see what's spamming the output (a bunch of identical-size 404s usually), then add `--exclude-length` to filter those out, then run again. Iterative. The numbers in the example (250-320) didn't come from nowhere, they came from looking at the noise in an earlier run and going "okay all those false positives are around that size, exclude them".

### About that one weird result

Notice in the example output:

```
Found: chelyabinsk-rnoc-rr02.backbone.example.thm Status: 404 [Size: 304]
```

That's a false positive that slipped through. 404 status, weird random looking name. That's the kind of thing where the server returned something with a slightly different size than your exclude range. You'd ignore that one. The real hits are the ones with 200 status: blog, shop, www, academy.

### For the question

Run the same kind of command but against `offensivetools.thm`:

```bash
gobuster vhost -u "http://MACHINE_IP" --domain offensivetools.thm -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt --append-domain --exclude-length 250-320
```

You should see four results with status code 200. That's the answer.

**Use the commands learned in this task to answer the following question: How many vhosts on the offensivetools.thm domain reply with a status code 200?** `4`

---

## Task 7 — Conclusion {#task-7}

Done. Three modes covered:

`dir` for directories and files on a web server. The most-used mode by far.

`dns` for finding subdomains by querying DNS directly.

`vhost` for finding virtual hosts by brute forcing the Host header against the IP.

The big takeaway is the difference between subdomains and vhosts. Subdomains live in DNS, vhosts live in the web server's config. Sometimes they overlap (a subdomain is also configured as a vhost) and sometimes they don't (a vhost might exist on the server but never have a public DNS record). That's why both modes exist and why both are worth running on a target.

A couple of practical things from doing this stuff repeatedly. Wordlist quality matters more than scan settings. A bigger wordlist finds more, but an appropriate wordlist finds the right things faster. SecLists is your friend, get familiar with what's in `/usr/share/wordlists/SecLists/Discovery/`. Also save your output (`-o`) on anything beyond a quick test, you'll want to grep through it later.

Gobuster is loud. It's not stealthy, it's not subtle, and on a real target with any kind of monitoring you will absolutely show up in their logs. Fine for CTFs and labs, but on real engagements think about the `--delay` flag and lower thread counts. There's a quieter cousin called feroxbuster and one called ffuf that's more flexible if you grow out of Gobuster. But this is the standard starting point and what most writeups will use.

---