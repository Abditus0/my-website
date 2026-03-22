---
title: "Neighbour CTF"
date: 2026-03-20
category: "TryHackMe · Writeup"
excerpt: "Walkthrough of TryHackMe's Neighbour CTF — Check out our new cloud service, Authentication Anywhere. Can you find other user's secrets?"
image: "/images/blog/6.png"
readtime: "5 min read"
draft: false
---

# Neighbour

The first thing I notice in the description is that we'll probably be able to find information about someone very easily. No deep digging required, and that'll lead us somewhere interesting.

---

The URL drops us straight onto a login page.

I always check for default `admin:admin` credentials, especially when a room is listed as *easy*. Didn't work this time. Something interesting though. You can log in as guest by pressing `Ctrl + U`, which opens the raw HTML page. There's a comment sitting right in the source handing us the credentials:
 
```
guest:guest
```

![](/images/blog/neighbour/1.png)


## Logging in as Guest

After logging in as guest, there's nothing to view or interact with. That's a strong hint that something's going on with the URL. This is a classic case of **IDOR (Insecure Direct Object Reference)**. A vulnerability where changing something like `user_id=123` to `user_id=124` lets you access someone else's data because the server doesn't properly check permissions.

## Exploiting the IDOR
 
I swap `guest` for `admin` in the URL.
 
![](/images/blog/neighbour/2.png)

![](/images/blog/neighbour/3.png)

It works.
 
We're now logged in as admin which in a real scenario would be extremely dangerous. The flag appears and the room is done!

![](/images/blog/neighbour/4.png)
 
- Always check page source for comments. Developers leave sensitive info there more often than you'd think
- When there's nothing to interact with as a low privilege user, look at the URL
- IDOR is dead simple to exploit when there's no server side permission checking in place

**Flag:** `flag{66be95c478473d91a5358f2440c7af1f}`