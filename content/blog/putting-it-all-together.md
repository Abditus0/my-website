---
title: "Putting It All Together — TryHackMe Pre Security Path"
date: 2026-04-02
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Putting It All Together room - Learn how all the individual components of the web work together to bring you access to your favourite web sites."
image: "/images/blog/25.png"
readtime: "8 min read"
draft: false
---

# Putting It All Together

This room brings everything together. DNS, HTTP, web servers, load balancers, databases, all of it. Every time you visit a website, a whole chain of things happens behind the scenes and this room walks through what that looks like.

---

## Tasks

- [Task 1 — Putting It All Together](#task-1)
- [Task 2 — Other Components](#task-2)
- [Task 3 — How Web Servers Work](#task-3)
- [Task 4 — Quiz](#task-4)

---

## Task 1 — Putting It All Together {#task-1}

When you request a website, your computer first needs to find the server's IP address and it uses DNS for that. Then it talks to the web server using HTTP. The web server sends back HTML, JavaScript, CSS, images and whatever else the page needs, and your browser uses all of that to display the page to you.

That is the basic flow, but there are also a few extra components that help make the web faster and more reliable.

---

## Task 2 — Other Components {#task-2}

**Load Balancers**

When a website gets a lot of traffic, one single server is not going to be enough. A load balancer sits in front of multiple servers and decides which one should handle each request. This keeps things running smoothly under heavy load and also means if one server goes down, the others can keep handling traffic.

Load balancers use different algorithms to decide where to send requests. **Round-robin** just sends each new request to the next server in the list. **Weighted** sends the request to whichever server is currently the least busy.

They also do health checks, regularly pinging each server to make sure it is still responding. If a server stops responding properly, the load balancer stops sending traffic to it until it comes back.

**CDN (Content Delivery Network)**

A CDN lets you host static files like JavaScript, CSS, images and videos across thousands of servers all around the world. When someone requests one of those files, the CDN sends it from whichever server is physically closest to them. This cuts down on load times and takes a lot of pressure off the main server.

**Databases**

Most websites need to store data somewhere. Web servers connect to databases to save and retrieve information. Databases can be as simple as a plain text file or as complex as a cluster of multiple servers built for speed and reliability. Common ones you will come across are MySQL, MSSQL, MongoDB and Postgres.

**WAF (Web Application Firewall)**

A WAF sits between the user's request and the web server. Its job is to protect the server from attacks. It checks incoming requests for common attack techniques, verifies the request is coming from a real browser and not a bot, and uses rate limiting to block IPs that are sending too many requests too quickly. If a request looks like an attack, it gets dropped before it ever reaches the server.

**Question: What can be used to host static files and speed up a client's visit to a website?** `CDN`

**Question: What does a load balancer perform to make sure a host is still alive?** `health check`

**Question: What can be used to help against the hacking of a website?** `WAF`

---

## Task 3 — How Web Servers Work {#task-3}

**What is a Web Server?**

A web server is software that listens for incoming connections and uses HTTP to deliver content to whoever asked for it. The most common ones you will come across are Apache, Nginx, IIS and NodeJS.

Every web server has a root directory where it serves files from. Apache and Nginx on Linux both default to `/var/www/html`. IIS on Windows uses `C:\inetpub\wwwroot`. So if you requested `http://www.example.com/picture.jpg`, the server would look for and send back `/var/www/html/picture.jpg` from its hard drive.

**Virtual Hosts**

A single web server can host multiple websites with completely different domain names. It does this using virtual hosts, which are just text based config files. When a request comes in, the server checks the hostname from the HTTP headers and matches it against its virtual hosts. If it finds a match it serves that site, if not it falls back to the default.

Each virtual host can point to a completely different folder on the hard drive. So `one.com` could map to `/var/www/website_one` and `two.com` could map to `/var/www/website_two`. There is no limit to how many you can have.

**Static vs Dynamic Content**

Static content never changes. Things like images, CSS, JavaScript files and plain HTML pages that are always the same. The server just sends them as they are.

Dynamic content changes depending on the request. A blog homepage that updates when a new post is added, or a search page that shows different results depending on what you searched. This kind of content is generated on the backend using programming languages, and the user only ever sees the final HTML output, never the code that produced it.

**Scripting and Backend Languages**

Backend languages are what make websites actually interactive. Some common ones are PHP, Python, Ruby, NodeJS and Perl. They can talk to databases, call external services, and process user input.

A simple example with PHP: if someone visits `http://example.com/index.php?name=adam` and the file looks like this:
```html
<html><body>Hello <?php echo $_GET["name"]; ?></body></html>
```

The server processes it and sends back:
```html
<html><body>Hello adam</body></html>
```

The user never sees the PHP code, only the result. This is what the backend means, it all happens behind the scenes. And because it is processing user input, any mistakes in how that is handled can open up serious security issues.

**Question: What does web server software use to host multiple sites?** `Virtual Hosts`

**Question: What is the name for the type of content that can change?** `Dynamic`

**Question: Does the client see the backend code? Yay/Nay** `Nay`

---

## Task 4 — The Quiz {#task-4}

This is an interactive drag and drop task where you arrange the steps of a website request in the correct order. The correct order is:

1. Request tryhackme.com in your browser
2. Check Local Cache for IP Adrress
3. Check your recursive DNS Server for Address
4. Query root server to find authoritative DNS Server
5. Authoritative DNS server advises the IP address for the website
6. Request passes through a Web Application Firewall
7. Request passes through a Load Balancer
8. Connect to Webserver on port 80 or 443
9. Web server receives the GET request
10. Web Application talks to Database
11. Your Browser renders the HTML into a viewable website

**Question: Flag** `THM{YOU_GOT_THE_ORDER}`

---

Every single website visit goes through this whole chain. Once you see it laid out like this it starts to make a lot more sense why things like load balancers and CDNs exist, and why security has to be thought about at every single step of it.

---