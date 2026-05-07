---
title: "Burp Suite: The Basics — TryHackMe Cyber Security 101"
date: 2026-05-07
category: "writeup"
excerpt: "Walkthrough of TryHackMe's Burp Suite: The Basics room — An introduction to using Burp Suite for web application pentesting."
image: "/images/blog/115.png"
readtime: "34 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — What is Burp Suite](#task-2)
- [Task 3 — Features of Burp Community](#task-3)
- [Task 4 — Installation](#task-4)
- [Task 5 — The Dashboard](#task-5)
- [Task 6 — Navigation](#task-6)
- [Task 7 — Options](#task-7)
- [Task 8 — Introduction to the Burp Proxy](#task-8)
- [Task 9 — Connecting through the Proxy (FoxyProxy)](#task-9)
- [Task 10 — Site Map and Issue Definitions](#task-10)
- [Task 11 — The Burp Suite Browser](#task-11)
- [Task 12 — Scoping and Targeting](#task-12)
- [Task 13 — Proxying HTTPS](#task-13)
- [Task 14 — Example Attack](#task-14)
- [Task 15 — Conclusion](#task-15)

---

## Task 1 — Introduction {#task-1}

Burp Suite. The big one. If you've spent any time around web pentesting you've heard the name, and now we finally get to use it.

This room is mostly theory, just a heads up. They warn you upfront that there's not a ton of hands on stuff here, it's more about learning what Burp is, what all the buttons do, and how to set it up properly. The actual exploiting comes in later rooms in the module. So treat this one as the boring but necessary setup before the fun starts.

---

## Task 2 — What is Burp Suite {#task-2}

Okay so what actually is Burp Suite. It's a Java program that sits between your browser and whatever website you're testing, and it lets you see, modify, and replay every single request going back and forth. That's basically it. Everything else Burp does is built on top of that one core feature.

You type something into a website, hit submit, the browser sends a request to the server, the server sends a response back. Burp catches all of that in the middle. You can change the request before it reaches the server, change the response before it reaches you, send the request to other Burp tools to mess with it more, whatever you want.

There are three editions:

**Community** is free, this is what we're using. Limited but still really powerful for what it is.

**Professional** is the paid version. Comes with the automatic vulnerability scanner, a fuzzer that isn't rate limited (community is rate limited which is annoying), project saving, report generation, an API, and access to all the extensions. This is what actual pros use.

**Enterprise** is a different beast. It's not for manual testing, it sits on a server and constantly scans your web apps for vulns. More like an automated monitoring tool.

We won't see Pro or Enterprise in this room because they cost money. Community edition has plenty for learning.

**Which edition of Burp Suite runs on a server and provides constant scanning for target web apps?** `Burp Suite Enterprise`

**Burp Suite is frequently used when attacking web applications and _____ applications.** `Mobile`

---

## Task 3 — Features of Burp Community {#task-3}

Quick tour of the tools inside Burp Community. You don't need to memorize this, you'll learn each one as you use it. But it's good to know what's there so you know which tool to reach for later.

**Proxy** is the main one. This is what catches the requests and lets you mess with them. The whole rest of Burp is basically built around the Proxy.

**Repeater** lets you take a captured request and resend it over and over with tweaks. This is huge for stuff like SQL injection where you're trying payload after payload to see what works.

**Intruder** is for spraying a bunch of requests at an endpoint. Brute forcing logins, fuzzing parameters, that kind of thing. In community it's rate limited so it's slow, but it still works.

**Decoder** is for encoding and decoding stuff. Base64, URL encoding, hex, all the usual suspects. You can do this with online tools too but having it built into Burp is faster.

**Comparer** compares two pieces of data side by side. Useful when you want to see exactly what changed between two responses.

**Sequencer** checks how random a token is. If a website's session cookies aren't actually random, that's a problem and Sequencer is what you'd use to figure that out.

There's also an extension system. The BApp Store has a bunch of community made extensions you can load in. Some require Pro but a lot work fine on Community.

**Which Burp Suite feature allows us to intercept requests between ourselves and the target?** `Proxy`

**Which Burp tool would we use to brute-force a login form?** `Intruder`

---

## Task 4 — Installation {#task-4}

If you're using the AttackBox you can skip this whole task because Burp is already installed.

If you're on your own machine then it depends on your OS:

**Kali Linux** has it preinstalled. If for some reason it's missing, just `apt install` it.

**Windows, Mac, regular Linux** you go to the PortSwigger downloads page, pick your OS, grab Community Edition, run the installer. It's a normal install, just click Next a few times.

The one thing to know if you're on Linux and you don't run the installer with sudo, it'll dump itself in your home directory at `~/BurpSuiteCommunity/BurpSuiteCommunity` and won't be added to your PATH. So you'd have to launch it from that folder. Annoying but not the end of the world.

---

## Task 5 — The Dashboard {#task-5}

First time you launch Burp it asks you about a project type. Community can't save projects so the options are basically meaningless, just click Next. Then it asks about config, default is fine, click Start Burp.

You might see a training screen. Worth going through if you have time. If you don't see it, you go straight to the dashboard which looks like four boxes of information and feels overwhelming until you realize most of it doesn't matter for community edition.

The four sections:

**Tasks** is for background stuff Burp is doing. By default there's a "Live Passive Crawl" which just logs the pages you visit. That's enough for community. Pro has more here.

**Event log** shows what Burp itself is doing. When the proxy starts, when connections happen, errors, that kind of thing. 

**Issue Activity** is a Pro thing. It shows vulnerabilities the auto scanner found. In Community this stays empty because there's no auto scanner.

**Advisory** is also mostly Pro. It gives detailed write ups of the vulns the scanner found. Empty in community most of the time.

Throughout Burp there are little question mark icons next to settings. Clicking them gives you actual useful info about what that setting does. Use them, they save you from having to google stuff.

**What menu provides information about the actions performed by Burp Suite, such as starting the proxy, and details about connections made through Burp?** `Event log`

---

## Task 6 — Navigation {#task-6}

Burp has tabs on top and sub tabs below them. You click a tab to switch modules, then click a sub tab to switch within that module. That's it. Not complicated.

If you want to pop a tab out into its own window you can. Go to Window in the menu bar at the top, click Detach. Same way to put it back.

The important keyboard shortcuts:

`Ctrl + Shift + D` for the Dashboard.
`Ctrl + Shift + T` for the Target tab.
`Ctrl + Shift + P` for the Proxy tab.
`Ctrl + Shift + I` for Intruder.
`Ctrl + Shift + R` for Repeater.

You'll mostly be living in Proxy and Repeater so those two shortcuts are the ones to memorize.

**Which tab Ctrl + Shift + P will switch us to?** `Proxy tab`

---

## Task 7 — Options {#task-7}

Settings in Burp come in two flavors:

**Global settings** apply to your whole Burp installation. Whatever you set here sticks around forever, every time you open Burp.

**Project settings** apply to just the current project. The catch in Community is that you can't save projects, so any project specific setting you change will be gone the moment you close Burp. Kind of pointless in community but good to know.

You access settings by clicking the Settings button in the top bar. It opens a separate window. There's a search bar at the top which is useful because there are a LOT of settings and finding what you want by clicking through categories is slow.

The questions for this task are basically a scavenger hunt to make you actually open the settings and look around. Use the search bar, type the keyword from each question, and you'll find the answer.

**In which category can you find a reference to a "Cookie jar"?** `Sessions`

**In which base category can you find the "Updates" sub-category, which controls the Burp Suite update behaviour?** `Suite`

**What is the name of the sub-category which allows you to change the keybindings for shortcuts in Burp Suite?** `Hotkeys`

**If we have uploaded Client-Side TLS certificates, can we override these on a per-project basis (yea/nay)?** `yea`

---

## Task 8 — Introduction to the Burp Proxy {#task-8}

Now the actual important thing. The Proxy.

Here's how it works. You set your browser to send all its traffic through Burp instead of straight to the internet. Burp catches each request, holds it, and waits. The browser is basically frozen until you tell Burp what to do with the request. You can:

Forward it (let it through to the server like normal)

Drop it (kill the request, server never sees it)

Edit it then forward it (change something then send it)

Send it to another tool like Repeater or Intruder for more work

That's the magic. You sit in the middle and you control everything.

When you don't want this micromanagement, you click the `Intercept is on` button to turn it off. Now traffic flows through normally but Burp still logs everything. That's the part people miss. Even with intercept off, Burp is still recording every single request in the HTTP history tab. You can go look at requests from earlier and send them to Repeater or whatever.

Burp also handles WebSockets, which is good because more and more sites use them.

The Proxy settings have some powerful stuff worth knowing about. The "Match and Replace" feature is wild, it uses regex to automatically modify requests as they pass through. Like you can set a rule that says "every time you see this header, change it to this other thing" and it'll just do it for every request. Useful for stuff like changing your user agent automatically.

By default, response interception is off. Burp catches your outgoing requests but lets the server's responses through without stopping. You can turn on response interception if you need it.

---

## Task 9 — Connecting through the Proxy (FoxyProxy) {#task-9}

To use the proxy your browser needs to actually send traffic through Burp. By default browsers don't do this. So you need a way to flip the proxy on and off easily, and that's where FoxyProxy comes in.

FoxyProxy is a Firefox extension. You install it, set up a profile that points to `127.0.0.1:8080` (which is where Burp listens by default), and now you can toggle the proxy on or off with one click of the FoxyProxy icon.

If you're on the AttackBox, FoxyProxy is already installed and configured. Less work for you.

If you're doing it yourself the steps are:

Install FoxyProxy Basic from the Firefox addon store.

Click the FoxyProxy icon, hit Options.

Click Add to make a new proxy profile.

Title is whatever you want, like Burp. Proxy IP is `127.0.0.1`. Port is `8080`.

Save it.

Now click the FoxyProxy icon again and select your Burp profile. Browser is now sending traffic through Burp.

Make sure Burp is actually running first, otherwise your browser is gonna sit there hanging trying to talk to a proxy that doesn't exist and you'll be confused for a minute.

Test it by going to the target machine's homepage. The browser will hang because intercept is on, then you switch to Burp and you should see your request sitting there in the Proxy tab. First successful intercept. Hit Forward to let it through, browser loads the page, and you're good.

One warning that the room mentions and is worth repeating. Don't leave intercept on and forget about it. You'll wonder why your browser stopped working completely.

Also worth noting, if you're on the AttackBox there will be other tabs open in the browser making WebSocket requests in the background. Close them before you start intercepting or your Proxy tab is gonna fill up with junk you don't care about.

---

## Task 10 — Site Map and Issue Definitions {#task-10}

The Target tab has three sub tabs:

**Site map** is a tree view of every page Burp has seen you visit. Just by browsing the site normally, your site map fills up. In Pro you can do active crawling where Burp follows links automatically, but in Community you build the map by clicking around yourself. Still useful, especially for finding API endpoints and hidden stuff.

**Issue definitions** is just a big list of every vulnerability the Pro scanner knows about, with descriptions. We can't actually run the scanner in community but we can read the list. Handy for writing reports, copy paste a description.

**Scope settings** is for telling Burp which sites you actually care about. We'll cover this more in task 12.

### Challenge

The challenge here is to browse around `http://MACHINE_IP/` and visit every link on the homepage. Then look at your site map and find an endpoint that looks weird. The idea is that just by clicking on every visible link, you populate your site map, and then you spot something in the map that you wouldn't have noticed by just looking at the website normally. Could be an admin panel, a hidden directory, a weird filename, something that wasn't linked in the navigation but got picked up because some background request mentioned it.

When you find the weird endpoint, visit it directly in the browser (or look at it in the Response tab of the site map entry) and you get the flag.

**What is the flag you receive after visiting the unusual endpoint?** `THM{NmNlZTliNGE1MWU1ZTQzMzgzNmFiNWVk}`

---

## Task 11 — The Burp Suite Browser {#task-11}

Plot twist. After all that FoxyProxy setup in task 9, Burp actually has its own built in browser that's already configured to use the proxy. You don't have to mess with FoxyProxy at all if you don't want to.

It's called Burp Browser. It's a Chromium based browser. To open it click the `Open Browser` button in the Proxy tab. A new browser window pops up, every request it makes goes straight through Burp, no setup required.

So why did we just do all the FoxyProxy stuff? Because eventually you want to use your real browser for testing too, and FoxyProxy is the way to do that. Burp Browser is convenient for quick stuff but a lot of people prefer their normal Firefox with all their extensions and bookmarks.

There's one gotcha. If you're running Burp as the root user on Linux (which is what happens on the AttackBox), Burp Browser won't start because Chromium refuses to run as root with a sandbox. Two ways to fix it:

**Smart way:** make a non root user on your machine and run Burp as that user. Annoying to set up but the right answer.

**Lazy way:** go to `Settings -> Tools -> Burp's browser` and check `Allow Burp's browser to run without a sandbox`. This is disabled by default for a reason. If something compromises the browser, no sandbox means it can mess with your whole machine. On the AttackBox it doesn't really matter because the AttackBox is throwaway. On your real computer, don't do this.

---

## Task 12 — Scoping and Targeting {#task-12}

Scope is one of those things that sounds boring until you use Burp without it for a while and realize how much noise gets caught.

When you turn on the proxy, Burp catches everything. Every request your browser makes. Visiting one website might trigger requests to ten different domains for ads, analytics, fonts, CDN images, all that crap. Your proxy fills up with junk and finding the actual interesting requests becomes a nightmare.

Scoping fixes this. You tell Burp "I only care about this one domain" and everything else gets ignored.

How to do it:

Go to the Target tab. In the site map on the left, right click on the target you care about. Click `Add To Scope`. Burp asks if you want to stop logging out of scope traffic, say yes.

Now switch to the Scope settings sub tab to confirm everything looks right. You can add or remove things from scope here too if you need to.

But there's a sneaky problem. Even after you do all this, the proxy will STILL intercept everything when intercept is on. The scope thing only stops logging, not interception. So you also need to go to the Proxy settings and find the "Intercept Client Requests" section, and add the rule `And URL Is in target scope`. Now intercept actually respects the scope.

After this is set up, your traffic view becomes way cleaner. Instead of catching every little thing your browser does, you only see requests to the actual target.

---

## Task 13 — Proxying HTTPS {#task-13}

If you're on the AttackBox this is already done for you. Skip the task.

For everyone else, here's the problem. When you visit an HTTPS site through Burp, the browser shows a certificate error. The reason is, Burp has to break the HTTPS encryption to be able to see and modify your traffic. The way it does this is by generating its own certificate and pretending to be the website. Your browser sees a certificate that's not from a trusted authority and freaks out.

The fix is to tell your browser to trust Burp's certificate authority (PortSwigger CA). Once you do that, Burp can MITM your HTTPS traffic without your browser complaining.

Steps:

With Burp running and the proxy active, go to `http://burp/cert` in your browser. This downloads a file called `cacert.der`.

Type `about:preferences` in your URL bar to open Firefox settings. Search for "certificates" and click View Certificates.

Click Import, pick the `cacert.der` file you just downloaded.

When it asks what to trust this CA for, check "Trust this CA to identify websites" and click OK.

Done. Now HTTPS sites work normally through Burp.

This is one of those things that feels sketchy because you're literally adding a "let this thing decrypt my traffic" certificate to your browser. And it is sketchy. The PortSwigger CA only matters on the machine where you imported it, and it only works because Burp has the matching private key locally. Don't do this on your daily driver browser if you can avoid it. Use a separate browser profile for testing.

---

## Task 14 — Example Attack {#task-14}

Finally something fun. We get to actually attack something.

The target is the support form at `http://MACHINE_IP/ticket/`. We're gonna do a Reflected XSS attack, which is where you inject JavaScript into a webpage in a way that makes the browser run it. Reflected means it only affects the person making the request, not everyone visiting the site.

### Walkthrough

First try it the dumb way. Type `<script>alert("Succ3ssful XSS")</script>` directly into the Contact Email field on the form. Doesn't work. The page has a client side filter that blocks special characters because emails aren't supposed to have angle brackets and quotes in them.

This is where Burp comes in. Client side filters run in your browser, which means they only check what you type before the form gets submitted. Once the request leaves your browser, those filters can't do anything anymore. So if we can modify the request AFTER the filter has done its check, we can sneak whatever we want past it.

Steps:

Make sure Burp is running with intercept on.

Go back to the form and put in normal looking data. Email like `pentester@example.thm`, query like `Test Attack`. Stuff that passes the filter.

Submit the form. Burp catches the request.

In Burp, find the email field in the request body. It currently says `pentester@example.thm`. Replace it with the XSS payload, `<script>alert("Succ3ssful XSS")</script>`.

Now the important part. Special characters like angle brackets need to be URL encoded so they survive the trip to the server. Highlight the payload you just pasted, then hit `Ctrl + U`. Burp converts it.

Click Forward. Request goes to the server. Server gets the payload, doesn't filter it because the filtering was only happening client side, and reflects it back in the response.

Browser gets the response, sees the script tag, runs it. Alert box pops up saying "Succ3ssful XSS".

That's the whole attack. It's a tiny example but it shows the core idea of why Burp is so useful. Anything the browser is doing to protect you can be bypassed because Burp lets you skip the browser entirely. Client side validation, client side filters, hidden form fields, disabled buttons, none of that matters once you can edit the request directly.

---

## Task 15 — Conclusion {#task-15}

That's Burp Basics done.

Most of this room was theory and clicking through menus, but the foundation is important. Now you know what each tab does, how to set up the proxy, how to scope your targets, how to deal with HTTPS certs, and you got one tiny taste of an actual attack at the end.

---