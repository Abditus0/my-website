---
title: "Neighbour CTF"
date: 2026-03-20
category: "TryHackMe · Writeup"
excerpt: "Walkthrough of TryHackMe's Neighbour CTF"
image: "/images/blog/6.png"
readtime: "5 min read"
draft: false
---



the first think i see in the description is that probably we will be able to find a information about someone very easy without a lot of digging and that will lead us to something interesting. 

the url leads to a log in page

i always like checking for default admin:admin credentials especially because the room is listed as "easy". Didnt work this time. something interesting is that you can log in as guest by pressing ctrl + U which ones up the html page. there is a comment on the html file giving us the credentials for the guest account: guest:guest.

after logging in as guest, there is nothing you can view or press. that strongly tells me that it has to be something with URL manipulation. This is also called IDOR. Its a specific vulnerability where changing something like `user_id=123` to `user_id=124` lets you access someone else’s data because the server doesn’t properly check permissions.

I will try to change the `guest` with `admin`. It worked. we are now logged in as admin which is very dangerous. The flag appears and the room is done! 