---
title: "MD2PDF CTF"
date: 2026-03-15
category: "ctf"
excerpt: "Walkthrough of TryHackMe's MD2PDF CTF - TopTierConversions LTD is proud to present its latest product launch."
image: "/images/blog/10.png"
readtime: "5 min read"
draft: false
---

# MD2PDF

The title and description tell us everything we need to know. This is a conversion tool that takes Markdown (MD) files and converts them to PDF. Somewhere in there is a flag.

---

First thing I do is run an `nmap` scan to check for open ports:

```bash
nmap -sV 10.80.130.2
```

Open ports: `22`, `80`, and `5000`. Port 80 is HTTP so let's check the website.

![](/images/blog/md2pdf/1.png)

Not much to work with.

## Poking at the Input

It has to be something with the input. I try a few markdown commands like `ls` and `pwd` in different ways, nothing. Then I start wondering if the converter will process raw HTML tags.


The converter is rendering HTML, which opens the door for **SSRF (Server Side Request Forgery)**. The idea is that we can trick the server into making requests on our behalf including to places we normally can't reach.

## Finding the Hidden Path

I run `gobuster` to check for any interesting paths:

![](/images/blog/md2pdf/3.png)

```bash
gobuster dir -u http://10.80.130.2 -w /usr/share/wordlists/dirb/common.txt
```

It finds one path: `/admin`

Let's try to access it directly.

![](/images/blog/md2pdf/5.png)

Forbidden. It can only be accessed internally on port `5000`. But if the converter makes requests on the server's behalf, maybe we can use it to reach that internal page:

```html
<iframe src="http://localhost:5000/admin"></iframe>
```

It works. The flag appears.

![](/images/blog/md2pdf/6.png)

- Just because a page is hidden from the outside doesn't mean it's safe. If something on the server can reach it, you can too
- Always check if a converter or renderer processes HTML. If it does, SSRF is worth trying
- `gobuster` on port 80 found the path, but the actual exploit went through port 5000 internally

**Flag:** `flag{1f4a2b6ffeaf4707c43885d704eaee4b}`
