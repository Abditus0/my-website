---
title: "Web Application Basics — TryHackMe Cyber Security 101"
date: 2026-05-03
category: "writeup"
excerpt: "Walkthrough of TryHackMe's Web Application Basics room — Learn the basics of web applications: HTTP, URLs, request methods, response codes, and headers."
image: "/images/blog/110.png"
readtime: "26 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Web Application Overview](#task-2)
- [Task 3 — Uniform Resource Locator](#task-3)
- [Task 4 — HTTP Messages](#task-4)
- [Task 5 — HTTP Request: Request Line and Methods](#task-5)
- [Task 6 — HTTP Request: Headers and Body](#task-6)
- [Task 7 — HTTP Response: Status Line and Status Codes](#task-7)
- [Task 8 — HTTP Response: Headers and Body](#task-8)
- [Task 9 — Security Headers](#task-9)
- [Task 10 — Practical Task: Making HTTP Requests](#task-10)
- [Task 11 — Conclusion](#task-11)

---

## Task 1 — Introduction {#task-1}

Alright, switching gears. After all the Metasploit and Windows exploitation stuff, we're going back to basics with web apps. URLs, HTTP requests, responses, headers, all that good stuff.

If you've ever opened DevTools in your browser and looked at the Network tab and felt slightly overwhelmed by all the things flying back and forth, this room is for you. It's the foundation for pretty much every web hacking room that comes later, so it's worth not skipping even if some of it feels obvious.

---

## Task 2 — Web Application Overview {#task-2}

This task uses a planet analogy to explain web apps which is, I'll be honest, kind of a stretch. But the actual content is fine. Web apps have a Front End (what you see in the browser) and a Back End (the stuff happening on the server that you don't see).

Front End is HTML for structure, CSS for how it looks, and JavaScript for the interactive bits. Back End is the web server, the database, and sometimes a Web Application Firewall (WAF) sitting in front of everything to filter out dodgy requests.

Nothing complicated here, just terminology you'll need later.

**Which component on a computer is responsible for hosting and delivering content for web applications?** `web server`

**Which tool is used to access and interact with web applications?** `web browser`

**Which component acts as a protective layer, filtering incoming traffic to block malicious attacks, and ensuring the security of the the web application?** `web application firewall`

---

## Task 3 — Uniform Resource Locator {#task-3}

URLs. You've typed thousands of them. But you've probably never actually thought about all the parts that make one up.

A URL is broken down into:

- **Scheme** — the protocol, usually `http` or `https`. HTTPS is the encrypted one and you should basically always be using it.
- **User** — login info baked into the URL. Almost nobody does this anymore because it's a terrible idea security-wise.
- **Host/Domain** — the actual website name. Watch out for typosquatting, which is when someone registers a domain that looks almost like a real one (like `gooogle.com` with three o's) to trick people in phishing attacks.
- **Port** — the doorway on the server. 80 for HTTP, 443 for HTTPS by default. You don't usually see this in URLs because browsers fill it in automatically.
- **Path** — where on the server the resource is, like `/login` or `/api/users/123`.
- **Query String** — the bit after the `?`. Used for search terms, form data, that kind of thing. Looks like `?name=bob&age=27`.
- **Fragment** — the bit after the `#`. Jumps you to a specific section of the page.

The query string and fragment are user-controllable which is why they get abused for injection attacks. Anything a user can mess with, an attacker can mess with too.

**Which protocol provides encrypted communication to ensure secure data transmission between a web browser and a web server?** `HTTPS`

**What term describes the practice of registering domain names that are misspelt variations of popular websites to exploit user errors and potentially engage in fraudulent activities?** `Typosquatting`

**What part of a URL is used to pass additional information, such as search terms or form inputs, to the web server?** `Query String`

---

## Task 4 — HTTP Messages {#task-4}

HTTP messages are just the packets of data going between your browser and the server. There's two kinds: requests (you asking for something) and responses (the server answering).

Both kinds follow the same basic structure:

- **Start line** — the first line, tells you what kind of message this is
- **Headers** — key-value pairs with extra info
- **Empty line** — a divider between headers and body. Sounds dumb but it's important. Without it the parsing breaks.
- **Body** — the actual content

That's it. That's the whole format. Every single web request you've ever made follows this same pattern.

**Which HTTP message is returned by the web server after processing a client's request?** `HTTP response`

**What follows the headers in an HTTP message?** `Empty Line`

---

## Task 5 — HTTP Request: Request Line and Methods {#task-5}

Now we zoom in on the request side. The first line of any HTTP request looks like this:

```
METHOD /path HTTP/version
```

So something like `GET /login HTTP/1.1`. Three parts: the method, the path, the version.

The method is the verb. It tells the server what you want to do:

- **GET** — fetch something. Don't put passwords or tokens in GET requests because they end up in URLs and logs as plaintext.
- **POST** — send data, usually to create something. This is what most forms use.
- **PUT** — replace or update a resource entirely.
- **DELETE** — remove something. The name is not subtle.
- **PATCH** — update part of a resource without replacing the whole thing.
- **HEAD** — like GET but only gets the headers back, no body. Useful for checking if something exists without downloading it.
- **OPTIONS** — asks the server what methods are allowed for a resource.
- **TRACE** — debugging stuff, usually disabled because it can be abused.
- **CONNECT** — used for tunneling, mostly for HTTPS.

For HTTP versions you've got 0.9, 1.0, 1.1, 2, and 3. Version 1.1 is the one that's still everywhere even though 2 and 3 are faster and more secure. Old habits die hard.

**Which HTTP protocol version became widely adopted and remains the most commonly used version for web communication, known for introducing features like persistent connections and chunked transfer encoding?** `HTTP/1.1`

**Which HTTP request method describes the communication options for the target resource, allowing clients to determine which HTTP methods are supported by the web server?** `OPTIONS`

**In an HTTP request, which component specifies the specific resource or endpoint on the web server that the client is requesting, typically appearing after the domain name in the URL?** `URL Path`

---

## Task 6 — HTTP Request: Headers and Body {#task-6}

Headers are how the request carries extra info. Some of the ones you'll see all the time:

- **Host** — which website the request is for. Important because one server can host multiple sites.
- **User-Agent** — what browser you're using. Servers sometimes use this to send different content to different browsers.
- **Referer** — yes it's spelled wrong, that's not a typo, the original spec had a typo and now we're stuck with it forever. It tells the server which page you came from.
- **Cookie** — stuff the server told your browser to remember. Session IDs, preferences, that kind of thing.
- **Content-Type** — what format the body is in.

The body is where the actual data goes when you're sending stuff to the server (POST, PUT, etc). It can be in different formats:

- **URL Encoded** (`application/x-www-form-urlencoded`) — `key=value&key2=value2` style. The default for most HTML forms.
- **Form Data** (`multipart/form-data`) — used when you're uploading files. Splits the body into chunks separated by a boundary string.
- **JSON** (`application/json`) — what most modern APIs use. Curly braces, key-value pairs, easy for JavaScript to deal with.
- **XML** (`application/xml`) — older API style with nested tags. Still around but most new stuff uses JSON.

**Which HTTP request header specifies the domain name of the web server to which the request is being sent?** `Host`

**What is the default content type for form submissions in an HTTP request where the data is encoded as key=value pairs in a query string format?** `application/x-www-form-urlencoded`

**Which part of an HTTP request contains additional information like host, user agent, and content type, guiding how the web server should process the request?** `Request Headers`

---

## Task 7 — HTTP Response: Status Line and Status Codes {#task-7}

Now the response side. When the server replies, the first line is the Status Line and it's got three things: the HTTP version, a status code, and a reason phrase.

Something like `HTTP/1.1 200 OK`.

Status codes are grouped into ranges:

- **1xx** — Informational. The server got part of your request and wants you to keep going.
- **2xx** — Success. Everything worked.
- **3xx** — Redirection. The thing you asked for has moved.
- **4xx** — Client error. You messed up. The classic 404 lives here.
- **5xx** — Server error. The server messed up. Not your fault for once.

The ones you'll see most:

- **200 OK** — everything's fine
- **301 Moved Permanently** — this URL has moved, here's the new one
- **404 Not Found** — the thing you asked for doesn't exist
- **500 Internal Server Error** — server is having a meltdown

If you see 500 errors during a CTF, that's actually a good sign sometimes. It means you broke something the developer didn't expect, which often means there's something exploitable.

**What part of an HTTP response provides the HTTP version, status code, and a brief explanation of the response's outcome?** `Status Line`

**Which category of HTTP response codes indicates that the web server encountered an internal issue or is unable to fulfil the client's request?** `Server Error Responses`

**Which HTTP status code indicates that the requested resource could not be found on the web server?** `404`

---

## Task 8 — HTTP Response: Headers and Body {#task-8}

Just like requests have headers, responses have headers too. Some of the important ones:

- **Date** — when the response was generated
- **Content-Type** — what kind of data is in the body, like `text/html` or `application/json`
- **Server** — what software the server is running. This one is actually a security risk because it tells attackers exactly what to look up exploits for. A lot of admins remove or fake this header.
- **Set-Cookie** — tells your browser to store a cookie. Should always have the `HttpOnly` flag (so JavaScript can't read it, which protects against XSS) and the `Secure` flag (so it only goes over HTTPS).
- **Cache-Control** — tells your browser how long it can cache the response.
- **Location** — used with redirects to tell you where to go next.

The body is where the actual content goes. HTML for web pages, JSON for API responses, raw bytes for images, whatever the server is serving up.

**Which HTTP response header can reveal information about the web server's software and version, potentially exposing it to security risks if not removed?** `Server`

**Which flag should be added to cookies in the Set-Cookie HTTP response header to ensure they are only transmitted over HTTPS, protecting them from being exposed during unencrypted transmissions?** `Secure`

**Which flag should be added to cookies in the Set-Cookie HTTP response header to prevent them from being accessed via JavaScript, thereby enhancing security against XSS attacks?** `HttpOnly`

---

## Task 9 — Security Headers {#task-9}

This is the part of the room that's actually worth paying attention to. Security headers are extra response headers that protect against specific attacks.

**Content-Security-Policy (CSP)** is the big one. It tells the browser where it's allowed to load stuff from. So if an attacker manages to inject a script tag pointing to their evil server, CSP can block it because the evil server isn't on the allowed list.

A CSP looks like:

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.tryhackme.com; style-src 'self'
```
The `'self'` keyword just means "the same domain this page is on." The `script-src` directive specifically controls where scripts can come from, `style-src` is for CSS, and `default-src` is the fallback for anything not explicitly listed.

**Strict-Transport-Security (HSTS)** forces the browser to always use HTTPS, even if someone tries to type `http://`:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

`max-age` is how long this rule sticks around. `includeSubDomains` extends the rule to all subdomains, not just the main one. `preload` gets the site added to a built-in list browsers ship with so the rule applies even before your first visit.

**X-Content-Type-Options: nosniff** tells the browser not to try and guess what type of file something is. Without this, browsers sometimes try to be clever and decide that a file the server said was `.txt` is actually a script and run it. Which is exactly the kind of clever you don't want.

**Referrer-Policy** controls how much info gets sent in the Referer header when you click a link to another site. Options range from `no-referrer` (send nothing) to `strict-origin-when-cross-origin` (send the full URL on same-origin requests but only the origin on cross-origin ones).

There's a site called securityheaders.io where you can paste any URL and it'll grade the site's security headers. Try it on a few sites you use, the results are sometimes embarrassing.

**In a Content Security Policy (CSP) configuration, which property can be set to define where scripts can be loaded from?** `script-src`

**When configuring the Strict-Transport-Security (HSTS) header to ensure that all subdomains of a site also use HTTPS, which directive should be included to apply the security policy to both the main domain and its subdomains?** `includeSubDomains`

**Which HTTP header directive is used to prevent browsers from interpreting files as a different MIME type than what is specified by the server, thereby mitigating content type sniffing attacks?** `nosniff`

---

## Task 10 — Practical Task: Making HTTP Requests {#task-10}

Now the hands-on part. The room gives you a little emulator with buttons to make different HTTP requests and see what comes back. Click View Site to launch it.

This part is useful because reading about GET/POST/DELETE is one thing, actually firing them off and seeing the responses is what makes it click.

For the first one, just hit GET on `/api/users`. The response body will have a list of users and the flag.

**Make a GET request to `/api/users`. What is the flag?** `THM{YOU_HAVE_JUST_FOUND_THE_USER_LIST}`

**Make a POST request to `/api/user/2` and update the country of Bob from UK to US. What is the flag?** `THM{YOU_HAVE_MODIFIED_THE_USER_DATA}`

Then DELETE on `/api/user/1` to wipe a user. In a real app you'd never want random people doing this without auth, which is sort of the point of the exercise.

**Make a DELETE request to `/api/user/1` to delete the user. What is the flag?** `THM{YOU_HAVE_JUST_DELETED_A_USER}`

---

## Task 11 — Conclusion {#task-11}

And that's the room. Nothing super flashy here but this stuff is the backbone of basically every web hacking thing you'll do later. SQL injection, XSS, CSRF, IDOR, all of it builds on understanding what an HTTP request actually looks like and what the server does with it.

The security headers part is the bit I'd actually go back and re-read if any of it didn't stick. Knowing what a CSP does and how HSTS works makes it way easier to spot when a site is doing something dumb later on.

Run a few of your favourite sites through securityheaders.io if you haven't. You'll be surprised how many big-name sites get a C or worse.

On to the next one.

---