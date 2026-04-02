---
title: "HTTP in Detail — TryHackMe Pre Security Path"
date: 2026-03-14
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's HTTP in Detail room - Learn about how you request content from a web server using the HTTP protocol"
image: "/images/blog/23.png"
readtime: "18 min read"
draft: false
---

# HTTP in Detail

This room is all about HTTP. How requests and responses work, what all the different status codes mean, what headers do, and what cookies actually are. Every time you open a website, all of this is running in the background.

---

## Tasks

- [Task 1 — What is HTTP(S)?](#task-1)
- [Task 2 — Requests And Responses](#task-2)
- [Task 3 — HTTP Methods](#task-3)
- [Task 4 — HTTP Status Codes](#task-4)
- [Task 5 — Headers](#task-5)
- [Task 6 — Cookies](#task-6)
- [Task 7 — Making Requests](#task-7)

---

## Task 1 — What is HTTP(S)? {#task-1}

HTTP stands for **HyperText Transfer Protocol**. It is the set of rules used to talk to web servers and transfer data like HTML pages, images, and videos. Tim Berners-Lee developed it between 1989 and 1991.

HTTPS is just the secure version of HTTP. The S stands for **Secure**. This means the data travelling between my browser and the server gets encrypted so nobody can snoop on it. It also makes sure I am actually talking to the right server and not some fake one pretending to be it.

**Question: What does HTTP stand for?** `HyperText Transfer Protocol`

**Question: What does the S in HTTPS stand for?** `Secure`

**Question: On the mock webpage on the right there is an issue, once you've found it, click on it. What is the challenge flag?** `THM{INVALID_HTTP_CERT}`

---

## Task 2 — Requests And Responses {#task-2}

**What is a URL?**

A URL stands for **Uniform Resource Locator**. Every time I use the internet I use a URL. It is basically a set of instructions that tells my browser where to go and how to get there. Here is what each part of a URL does:

- **Scheme**: Tells the browser which protocol to use, like `http`, `https`, or `ftp`
- **User**: Some services let me put a username and password directly in the URL to log in
- **Host**: The domain name or IP address of the server I want to reach
- **Port**: The port to connect on. Usually 80 for HTTP and 443 for HTTPS, but it can be anything from 1 to 65535
- **Path**: The specific file or location I am trying to access
- **Query String**: Extra info I can send to the page. For example `/blog?id=1` tells the blog page to load the article with the id of 1
- **Fragment**: A reference to a specific spot on the page. Useful for long pages where I want to jump straight to a certain section

**Making a Request**

I can technically make a request to a web server with just one line: `GET / HTTP/1.1`. But to actually get a proper web experience I need to send extra data too, and that extra data goes in something called headers. Here is an example of a full request:
```
GET / HTTP/1.1
Host: tryhackme.com
User-Agent: Mozilla/5.0 Firefox/87.0
Referer: https://tryhackme.com/
```

Breaking it down line by line:
- Line 1: I am using the GET method, requesting the home page with `/`, and telling the server I am using HTTP version 1.1
- Line 2: I am telling the server I want the website tryhackme.com
- Line 3: I am telling the server I am using Firefox version 87
- Line 4: I am telling the server that the page that sent me here was https://tryhackme.com
- Line 5: A blank line that tells the server my request is finished

And the server sends back a response like this:
```
HTTP/1.1 200 OK
Server: nginx/1.15.8
Date: Fri, 09 Apr 2021 13:34:03 GMT
Content-Type: text/html
Content-Length: 98

<html>
<head>
    <title>TryHackMe</title>
</head>
<body>
    Welcome To TryHackMe.com
</body>
</html>
```

Breaking that down too:
- Line 1: The server is using HTTP 1.1 and the status code is 200 OK, which means my request worked
- Line 2: The web server software and its version
- Line 3: The current date, time, and timezone of the server
- Line 4: The type of content being sent back, in this case HTML
- Line 5: How long the response is in bytes, so I can check nothing got cut off
- Line 6: A blank line marking the end of the response headers
- Lines 7 to 14: The actual content I asked for, in this case the homepage

**Question: What HTTP protocol is being used in the above example?** `HTTP/1.1`

**Question: What response header tells the browser how much data to expect?** `Content-Length`

---

## Task 3 — HTTP Methods {#task-3}

HTTP methods are how I tell the server what I want to do when I make a request. There are quite a few of them but these are the main ones we deal with:

**GET Request**
When you want to get information from a web server.

**POST Request**
Used when you want to send data to the server, like submitting a form or creating something new.

**PUT Request**
Used when you want to send data to the server to update something that already exists.

**DELETE Request**
Used when you want to delete something from the server.

**Question: What method would be used to create a new user account?** `POST`

**Question: What method would be used to update your email address?** `PUT`

**Question: What method would be used to remove a picture you've uploaded to your account?** `DELETE`

**Question: What method would be used to view a news article?** `GET`

---

## Task 4 — HTTP Status Codes {#task-4}

Every time a server responds, the first line always contains a status code. It tells you what happened with the request. They are broken into 5 ranges:

**100-199 - Information Response**
These tell you the first part of the request was received and you should keep sending the rest. Not very common anymore.

**200-299 - Success**
These tell you that request worked.

**300-399 - Redirection**
These mean the thing I asked for has moved somewhere else, either a different page or a different website.

**400-499 - Client Errors**
These mean something was wrong with my request.

**500-599 - Server Errors**
These mean something broke on the server side. Usually a bigger problem.

Here are the specific ones that come up the most:

**200 - OK**: The request completed successfully.

**201 - Created**: Something new was created, like a new user or a new blog post.

**301 - Moved Permanently**: The page has moved to a new location. The browser gets redirected there and search engines update their records too.

**302 - Found**: Similar to 301 but temporary. The page might move back or change again soon.

**400 - Bad Request**: Something was wrong or missing in the request. Maybe the server expected a certain parameter we did not send.

**401 - Not Authorised**: I am not allowed to see this yet. I need to log in first.

**403 - Forbidden**: I do not have permission to see this even if I am logged in.

**404 - Page Not Found**: The page or resource I asked for does not exist.

**405 - Method Not Allowed**: I used the wrong method for this resource. For example, I sent a GET request to something that only accepts POST.

**500 - Internal Server Error**: The server ran into an error it does not know how to handle.

**503 - Service Unavailable**: The server cannot handle my request right now because it is overloaded or down for maintenance.

**Question: What response code might you receive if you've created a new user or blog post article?** `201`

**Question: What response code might you receive if you've tried to access a page that doesn't exist?** `404`

**Question: What response code might you receive if the web server cannot access its database and the application crashes?** `503`

**Question: What response code might you receive if you try to edit your profile without logging in first?** `401`

---

## Task 5 — Headers {#task-5}

Headers are extra bits of data I can send along with my HTTP request. The web server can also send headers back with its response. No headers are strictly required but without them things break pretty quickly.

**Common Request Headers** (what we send to the server):

**Host**: Since one server can host multiple websites, we use this to tell it which one we actually want. Without it, we would just get whatever the default site is.

**User-Agent**: This is the browser type and version number. The server uses this to format the website properly for the browser, since some HTML, JavaScript, and CSS features only work in certain browsers.

**Content-Length**: When we are sending data to the server, like filling out a form, this tells it how much data to expect. That way the server knows if anything got cut off.

**Accept-Encoding**: This tells the server which compression formats my browser can handle, so the data can be made smaller before it gets sent to me.

**Cookie**: This sends the saved cookie data back to the server with each request.

**Common Response Headers** (what the server sends back to me):

**Set-Cookie**: This tells my browser to save some information as a cookie so it can be sent back on future requests.

**Cache-Control**: This tells my browser how long to keep the response saved before it needs to ask the server again.

**Content-Type**: This tells my browser what kind of data is coming back, like HTML, CSS, JavaScript, images, PDFs, or video. My browser uses this to figure out how to handle it.

**Content-Encoding**: This tells my browser what compression method was used on the data so it knows how to decompress it.

**Question: What header tells the web server what browser is being used?** `User-Agent`

**Question: What header tells the browser what type of data is being returned?** `Content-Type`

**Question: What header tells the web server which website is being requested?** `Host`

---

## Task 6 — Cookies {#task-6}

A cookie is a small piece of data that gets stored on the computer. When we get a `Set-Cookie` header in a response, the browser saves that data. After that, every request we make to that server includes the cookie automatically.

The reason cookies exist is because HTTP is **stateless**. That means it does not keep track of previous requests. Every single request is treated as brand new. Cookies fix this by giving the server a way to remember who we are across multiple requests.

The most common use for cookies is website authentication. When we log in, the server gives us a cookie with a token inside. A token is a unique secret code that is not just the password written out in plain text. It is not something easy to guess. On every visit after that, the browser sends the token and the server recognises us.

We can actually see what cookies our browser is sending by opening developer tools, going to the Network tab, clicking on any request, and then checking the Cookies tab. It is a good way to see what is being passed back and forth.

**Question: Which header is used to save cookies to your computer?** `Set-Cookie`

---

## Task 7 — Practical {#task-7}

Interactive task where we use a browser emulator to make real HTTP requests and see what the server sends back. Good way to put everything from the room into practice.

**Question: Make a GET request to /room** `THM{YOU'RE_IN_THE_ROOM}`

**Question: Make a GET request to /blog and set the id parameter to 1** `THM{YOU_FOUND_THE_BLOG}`

**Question: Make a DELETE request to /user/1** `THM{USER_IS_DELETED}`

**Question: Make a PUT request to /user/2 with the username parameter set to admin** `THM{USER_HAS_UPDATED}`

**Question: Make a POST request to /login with the username thm and password letmein** `THM{HTTP_REQUEST_MASTER}`

---

That is HTTP. Every click, every page load, every form we submit. All of this is happening behind the scenes every single time. Once we understood the structure of it, a lot of other web stuff started making a lot more sense.

---