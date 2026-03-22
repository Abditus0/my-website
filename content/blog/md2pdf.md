---
title: "MD2PDF CTF"
date: 2026-03-21
category: "TryHackMe · Writeup"
excerpt: "Walkthrough of TryHackMe's MD2PDF CTF"
image: "/images/blog/10.png"
readtime: "5 min read"
draft: false
---

# MD2PDF

The title and description tell us everything we need to know going in. This is a conversion tool that takes Markdown files and converts them to PDF. Somewhere in there is a flag.

---

First thing I do is run an `nmap` scan to check for open ports:

```bash
nmap -sV 10.80.130.2
```

Open ports: `22`, `80`, and `5000`. Port 80 is HTTP so let's check the website.

![](/images/blog/md2pdf/1.png)

Not much to work with.

## Poking at the Input

It has to be something with the input. I try a few markdown commands like `ls` and `pwd` in different ways — nothing. Then I start wondering if the converter will process raw HTML tags. I try a few things and land on this:
```html
<iframe src="file:///etc/passwd"></iframe>
```

![](/images/blog/md2pdf/2.png)

I get a Bad Request. That's actually good news — it means the server is processing the tag and reacting to it. The converter is rendering HTML, which opens the door for **SSRF (Server Side Request Forgery)**. The idea is that we can trick the server into making requests on our behalf — including to places we normally can't reach.

## Finding the Hidden Path

I run `gobuster` to check for any interesting paths:
```bash
gobuster dir -u http://10.80.130.2 -w /usr/share/wordlists/dirb/common.txt
```

![](/images/blog/md2pdf/3.png)

It finds one path: `/admin`

Let's try to access it directly.

![](/images/blog/md2pdf/4.png)

Forbidden. It can only be accessed internally on port `5000`. But wait — if the converter makes requests on the server's behalf, maybe we can use it to reach that internal page:
```html
<iframe src="http://localhost:5000/admin"></iframe>
```

![](/images/blog/md2pdf/5.png)

It works. The flag appears.

- Just because a page is hidden from the outside doesn't mean it's safe — if something on the server can reach it, you can too
- Always check if a converter or renderer processes HTML. If it does, SSRF is worth trying
- `gobuster` on port 80 found the path, but the actual exploit went through port 5000 internally

**Flag:** `flag{1f4a2b6ffeaf4707c43885d704eaee4b}`